// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {AssetToken} from "./AssetToken.sol";

/**
 * @title DealManager
 * @dev Manages the fundraising lifecycle for a specific deal.
 */
contract DealManager is Ownable {
    
    struct DealConfig {
        uint256 hardCap;   // Max amount to raise
        uint256 softCap;   // Min amount to raise for success
        uint256 endTime;   // Timestamp when fundraising ends
        uint256 rate;      // How many AssetTokens per 1 unit of PaymentToken (scaled)
                           // For simplicity in POC: 1:1 ratio (rate = 1e18 if decimals match)
    }

    IERC20 public paymentToken;     // USDC
    AssetToken public assetToken;   // The RWA token
    address public treasury;        // Where funds go on success

    DealConfig public config;
    uint256 public totalRaised;
    bool public dealFinalized;
    bool public dealCancelled;

    mapping(address => uint256) public contributions;

    event Contributed(address indexed user, uint256 amount);
    event DealFinalized(uint256 totalRaised);
    event Refunded(address indexed user, uint256 amount);

    constructor(
        address _paymentToken,
        address _assetToken,
        address _treasury
    ) Ownable(msg.sender) {
        paymentToken = IERC20(_paymentToken);
        assetToken = AssetToken(_assetToken);
        treasury = _treasury;
    }

    function startDeal(uint256 _hardCap, uint256 _softCap, uint256 _duration) external onlyOwner {
        require(config.endTime == 0, "Deal already started");
        
        config = DealConfig({
            hardCap: _hardCap,
            softCap: _softCap,
            endTime: block.timestamp + _duration,
            rate: 1 // 1:1 ratio for POC simplicity
        });
    }

    function updateTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }

    /**
     * @dev User contributes Stablecoin to the deal.
     */
    function contribute(uint256 amount) external {
        require(block.timestamp < config.endTime, "Deal ended");
        require(!dealFinalized && !dealCancelled, "Deal not active");
        require(totalRaised + amount <= config.hardCap, "Hardcap reached");
        require(amount > 0, "Amount must be > 0");

        // Transfer funds to this contract
        // NOTE: User must approve this contract first
        paymentToken.transferFrom(msg.sender, address(this), amount);

        contributions[msg.sender] += amount;
        totalRaised += amount;

        emit Contributed(msg.sender, amount);
    }

    /**
     * @dev Admin finalizes the deal if soft cap is met.
     */
    function finalizeDeal() external onlyOwner {
        require(block.timestamp >= config.endTime || totalRaised == config.hardCap, "Deal still active");
        require(totalRaised >= config.softCap, "Soft cap not met");
        require(!dealFinalized, "Already finalized");

        dealFinalized = true;

        // 1. Move funds to treasury
        paymentToken.transfer(treasury, totalRaised);

        // 2. Mint tokens to all contributors
        // In a real optimized contract, users might claim tokens to save gas loop.
        // For POC, we'll assume a Pull pattern for tokens to be safe, or just let users 'claim'.
        // Let's implement a 'claimTokens' function to avoid block gas limits.
        // But for strict POC "CloseDeal" user story: "Asset Tokens minted/transferred to investors".
        // We will keep the funds in contract until users claim tokens? 
        // Or actually, let's implement a claim function for the tokens.
        
        emit DealFinalized(totalRaised);
    }

    /**
     * @dev If deal failed or cancelled, users reclaim funds.
     */
    function refund() external {
        bool failed = block.timestamp >= config.endTime && totalRaised < config.softCap;
        require(dealCancelled || failed, "Deal successful or ongoing");

        uint256 amount = contributions[msg.sender];
        require(amount > 0, "No contribution");

        contributions[msg.sender] = 0;
        paymentToken.transfer(msg.sender, amount);

        emit Refunded(msg.sender, amount);
    }

    /**
     * @dev Claim Asset Tokens after successful deal.
     */
    function claimTokens() external {
        require(dealFinalized, "Deal not finalized");
        
        // Amount logic: 1 USDC = 1 AssetToken (simplified)
        // If decimals differ, we need conversion. Assuming both 18 or 6 decimals for now.
        uint256 amountContributed = contributions[msg.sender];
        require(amountContributed > 0, "Nothing to claim");

        contributions[msg.sender] = 0; // Prevent re-entrancy/double claim
        
        // Mint tokens
        // This requires DealManager to have MINTER_ROLE on AssetToken
        assetToken.mint(msg.sender, uint224(amountContributed));
    }

    // Emergency cancel
    function cancelDeal() external onlyOwner {
        require(!dealFinalized, "Cannot cancel finalized deal");
        dealCancelled = true;
    }
}
