// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/AssetToken.sol";
import "../src/SimpleAMM.sol";
import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

// Mock Payment Token (USDC)
contract MockUSDC is ERC20 {
    constructor() ERC20("USDC", "USDC") {
        _mint(msg.sender, 1_000_000 * 1e18);
    }
}

contract TradingTest is Test {
    AssetToken public assetToken;
    MockUSDC public usdc;
    SimpleAMM public amm;
    
    address public admin = address(1);
    address public investor = address(2);
    
    function setUp() public {
        vm.startPrank(admin);
        
        // 1. Deploy Tokens
        usdc = new MockUSDC();
        assetToken = new AssetToken("High Growth Tech", "HGT", admin, address(usdc));
        
        // 2. Deploy AMM
        amm = new SimpleAMM(address(usdc), address(assetToken));
        
        // 3. Setup Whitelists (CRITICAL STEP)
        // Verify Investor
        assetToken.updateWhitelist(investor, true);
        // Verify AMM Contract so it can hold/send tokens
        assetToken.updateWhitelist(address(amm), true);
        
        // 4. Admin mints initial supply to self (Admin is auto-whitelisted in constructor)
        assetToken.mint(admin, 100_000 * 1e18);
        
        vm.stopPrank();
        
        // Fund Investor with USDC
        vm.prank(admin);
        usdc.transfer(investor, 10_000 * 1e18);
    }
    
    function testLiquidityProvision() public {
        vm.startPrank(admin);
        
        // Approve AMM
        usdc.approve(address(amm), 50_000 * 1e18);
        assetToken.approve(address(amm), 50_000 * 1e18);
        
        // Add Liquidity: 50k USDC + 50k Tokens (Price = 1.0)
        amm.addLiquidity(50_000 * 1e18, 50_000 * 1e18);
        
        assertEq(amm.reserve0(), 50_000 * 1e18);
        assertEq(amm.reserve1(), 50_000 * 1e18);
        
        vm.stopPrank();
    }
    
    function testTrading() public {
        // First add liquidity
        testLiquidityProvision();
        
        vm.startPrank(investor);
        
        uint256 swapAmount = 1000 * 1e18; // Swap 1000 USDC
        usdc.approve(address(amm), swapAmount);
        
        uint256 expectedOut = 987158034397061298836; // Rough calc for CPMM with 0.3% fee
        
        // Swap USDC -> AssetToken
        uint256 received = amm.swap(address(usdc), swapAmount);
        
        assertGt(received, 0);
        assertEq(assetToken.balanceOf(investor), received);
        
        // Verify AssetToken transfer restrictions didn't revert
        // (Because AMM and Investor are both whitelisted)
        
        vm.stopPrank();
    }

    function testTradingWithoutWhitelistReverts() public {
        // Admin removes AMM from whitelist
        vm.prank(admin);
        assetToken.updateWhitelist(address(amm), false);
        
        vm.startPrank(admin);
        usdc.approve(address(amm), 1000 * 1e18);
        assetToken.approve(address(amm), 1000 * 1e18);
        
        // Should revert because AMM cannot receive the tokens
        vm.expectRevert("AssetToken: Recipient not whitelisted");
        amm.addLiquidity(1000 * 1e18, 1000 * 1e18);
        
        vm.stopPrank();
    }
}
