// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {AccessControl} from "openzeppelin-contracts/contracts/access/AccessControl.sol";

/**
 * @title AssetToken
 * @dev Permissioned ERC20 token representing shares in a Private Equity deal.
 *      Includes Native Dividend Tracking (Hold-to-Earn).
 */
contract AssetToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant WHITELIST_MANAGER_ROLE = keccak256("WHITELIST_MANAGER_ROLE");
    bytes32 public constant DIVIDEND_DISTRIBUTOR_ROLE = keccak256("DIVIDEND_DISTRIBUTOR_ROLE");

    mapping(address => bool) public isWhitelisted;
    IERC20 public immutable paymentToken; // USDC

    // --- Dividend Tracking State ---
    uint256 constant MAGNITUDE = 2**128;
    uint256 public magnifiedDividendPerShare;
    mapping(address => int256) public magnifiedDividendCorrections;
    mapping(address => uint256) public withdrawnDividends;

    uint256 public totalDividendsDistributed;

    event WhitelistUpdated(address indexed account, bool status);
    event DividendsDistributed(address indexed from, uint256 weiAmount);
    event DividendClaimed(address indexed to, uint256 weiAmount);

    constructor(
        string memory name,
        string memory symbol,
        address admin,
        address _paymentToken
    ) ERC20(name, symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(WHITELIST_MANAGER_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(DIVIDEND_DISTRIBUTOR_ROLE, admin);
        
        isWhitelisted[admin] = true;
        paymentToken = IERC20(_paymentToken);
    }

    /**
     * @dev Start or stop allowing an address to hold tokens.
     */
    function updateWhitelist(address account, bool status) external onlyRole(WHITELIST_MANAGER_ROLE) {
        isWhitelisted[account] = status;
        emit WhitelistUpdated(account, status);
    }

    /**
     * @dev Mint new tokens. Only callable by addresses with MINTER_ROLE (e.g. DealManager).
     */
    function mint(address to, uint224 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    // --- Dividend Logic ---

    /**
     * @dev Distributes dividends to token holders.
     *      The sender must approve `amount` of paymentToken to this contract.
     */
    function distributeDividends(uint256 amount) external onlyRole(DIVIDEND_DISTRIBUTOR_ROLE) {
        require(totalSupply() > 0, "No supply");
        require(amount > 0, "Amount is 0");

        paymentToken.transferFrom(msg.sender, address(this), amount);

        magnifiedDividendPerShare += (amount * MAGNITUDE) / totalSupply();
        totalDividendsDistributed += amount;

        emit DividendsDistributed(msg.sender, amount);
    }

    /**
     * @dev View the amount of dividend in wei that an address can withdraw.
     */
    function withdrawableDividendOf(address account) public view returns (uint256) {
        return accumulativeDividendOf(account) - withdrawnDividends[account];
    }

    /**
     * @dev View the amount of dividend in wei that an address has accumulated.
     */
    function accumulativeDividendOf(address account) public view returns (uint256) {
        return uint256(int256(magnifiedDividendPerShare * balanceOf(account)) + magnifiedDividendCorrections[account]) / MAGNITUDE;
    }

    /**
     * @dev Claims dividends for the sender.
     */
    function claimDividends() external {
        _claimDividends(msg.sender);
    }

    function _claimDividends(address account) internal {
        uint256 withdrawable = withdrawableDividendOf(account);
        if (withdrawable > 0) {
            withdrawnDividends[account] += withdrawable;
            paymentToken.transfer(account, withdrawable);
            emit DividendClaimed(account, withdrawable);
        }
    }

    // --- Overrides ---

    /**
     * @dev We override _update to handle both Whitelist checks AND Dividend Corrections.
     */
    function _update(address from, address to, uint256 value) internal override {
        // 1. Whitelist Checks
        if (from == address(0)) { // Mint
            require(isWhitelisted[to], "AssetToken: Recipient not whitelisted");
        } else if (to == address(0)) { // Burn
            // No check needed
        } else { // Transfer
            require(isWhitelisted[from], "AssetToken: Sender not whitelisted");
            require(isWhitelisted[to], "AssetToken: Recipient not whitelisted");
        }

        // 2. Dividend Corrections
        // We MUST call super._update first to update balances? 
        // No, standard pattern updates corrections BEFORE changing balances if using `balanceOf` in correction logic?
        // Wait. 
        // Correction update: `correction[account] -= M * amount_received`
        // If I receive 100 tokens, my correction decreases by M*100.
        // My balance increases by 100.
        // New Accumulated = M * (OldBal + 100) + (OldCorr - M*100) = M*OldBal + M*100 + OldCorr - M*100 = M*OldBal + OldCorr.
        // Correct. The value shouldn't change just because I received tokens.
        
        if (value > 0) {
            int256 correctionAmount = int256(magnifiedDividendPerShare * value);
            
            if (from != address(0)) {
                magnifiedDividendCorrections[from] += correctionAmount;
            }
            if (to != address(0)) {
                magnifiedDividendCorrections[to] -= correctionAmount;
            }
        }

        super._update(from, to, value);
    }
}
