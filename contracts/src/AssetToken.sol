// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {AccessControl} from "openzeppelin-contracts/contracts/access/AccessControl.sol";

/**
 * @title AssetToken
 * @dev Permissioned ERC20 token representing shares in a Private Equity deal.
 * Only whitelisted addresses can hold tokens.
 */
contract AssetToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant WHITELIST_MANAGER_ROLE = keccak256("WHITELIST_MANAGER_ROLE");

    mapping(address => bool) public isWhitelisted;

    event WhitelistUpdated(address indexed account, bool status);

    constructor(
        string memory name,
        string memory symbol,
        address admin
    ) ERC20(name, symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(WHITELIST_MANAGER_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        
        // Admin is implicitly whitelisted to facilitate initial setup if needed, 
        // but typically they won't hold tokens. Let's explicitly whitelist them just in case.
        isWhitelisted[admin] = true;
        emit WhitelistUpdated(admin, true);
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

    /**
     * @dev Hook that is called before any transfer of tokens. This includes minting and burning.
     * We enforce the whitelist check here.
     */
    function _update(address from, address to, uint256 value) internal override {
        // Allow minting (from == 0) if 'to' is whitelisted
        if (from == address(0)) {
            require(isWhitelisted[to], "AssetToken: Recipient not whitelisted");
        }
        // Allow burning (to == 0) if 'from' is whitelisted (logical, but they must have had tokens)
        else if (to == address(0)) {
            // No strict check needed for burning, but 'from' must have had tokens so they were whitelisted.
        }
        // Normal transfer
        else {
            require(isWhitelisted[from], "AssetToken: Sender not whitelisted");
            require(isWhitelisted[to], "AssetToken: Recipient not whitelisted");
        }

        super._update(from, to, value);
    }
}
