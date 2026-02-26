// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {AssetToken} from "../src/AssetToken.sol";
import {DealManager} from "../src/DealManager.sol";
import {MockUSDC} from "./Mocks.sol";

contract POCTest is Test {
    AssetToken assetToken;
    DealManager dealManager;
    MockUSDC usdc;

    address admin = address(1);
    address alice = address(2);
    address bob = address(3);
    address treasury = address(4);

    function setUp() public {
        vm.startPrank(admin);

        // 1. Deploy USDC
        usdc = new MockUSDC();

        // 2. Deploy AssetToken
        assetToken = new AssetToken("Ultramar Hotel", "ULT-H", admin, address(usdc));

        // 3. Deploy DealManager
        dealManager = new DealManager(address(usdc), address(assetToken), treasury);

        // 4. Grant MINTER_ROLE to DealManager
        assetToken.grantRole(assetToken.MINTER_ROLE(), address(dealManager));

        vm.stopPrank();

        // Mint USDC to Alice & Bob
        usdc.mint(alice, 100_000 * 1e18);
        usdc.mint(bob, 1_000_000 * 1e18);
    }

    function test_HappyPath() public {
        // --- 1. Admin Starts Deal ---
        vm.startPrank(admin);
        dealManager.startDeal(
            1_000_000 * 1e18, // Hardcap
            500_000 * 1e18,   // Softcap
            7 days            // Duration
        );
        
        // Whitelist Alice
        assetToken.updateWhitelist(alice, true);
        vm.stopPrank();

        // --- 2. Alice Contributes ---
        vm.startPrank(alice);
        usdc.approve(address(dealManager), 10_000 * 1e18);
        dealManager.contribute(10_000 * 1e18);
        vm.stopPrank();

        assertEq(dealManager.totalRaised(), 10_000 * 1e18);
        assertEq(dealManager.contributions(alice), 10_000 * 1e18);

        // --- 3. Bob tries to contribute without whitelist (should fail? checked in DealManager? No) ---
        // Wait, DealManager doesn't check whitelist on contribute, but AssetToken checks on mint?
        // Let's check DealManager logic.
        // DealManager logic: contribute() just takes USDC.
        // closeDeal() -> runs mint().
        // AssetToken.mint() -> checks _update -> checks recipient whitelist.
        // So Bob CAN contribute, but when he tries to claim, it will FAIL if not whitelisted.
        // Or DealManager.closeDeal() will FAIL if it mints to non-whitelisted?
        // Since my DealManager logic uses a PULL pattern (claimTokens), closeDeal won't fail.
        // But Bob's claimTokens() will fail.
        
        // Let's Whitelist Bob midway to allow him.
        vm.prank(admin);
        assetToken.updateWhitelist(bob, true);

        vm.startPrank(bob);
        usdc.approve(address(dealManager), 500_000 * 1e18);
        dealManager.contribute(500_000 * 1e18); // Hit softcap (10k + 500k > 500k)
        vm.stopPrank();

        // --- 4. Finalize Deal ---
        vm.warp(block.timestamp + 8 days); // End time reached
        
        vm.prank(admin);
        dealManager.finalizeDeal();

        assertEq(dealManager.dealFinalized(), true);
        assertEq(usdc.balanceOf(treasury), 510_000 * 1e18); // Funds moved to treasury

        // --- 5. Claim Tokens ---
        vm.startPrank(alice);
        dealManager.claimTokens();
        assertEq(assetToken.balanceOf(alice), 10_000 * 1e18);
        vm.stopPrank();

        vm.startPrank(bob);
        dealManager.claimTokens();
        assertEq(assetToken.balanceOf(bob), 500_000 * 1e18);
        vm.stopPrank();

        // --- 6. Yield Distribution (Native) ---
        // Alice holds 10,000. Bob holds 500,000.
        // Total Supply = 510,000.
        
        // Admin deposits 1000 USDC yield
        vm.startPrank(admin);
        usdc.mint(admin, 1000 * 1e18);
        usdc.approve(address(assetToken), 1000 * 1e18);
        
        assetToken.distributeDividends(1000 * 1e18);
        vm.stopPrank();

        // Alice claims
        vm.startPrank(alice);
        // Alice share = (10,000 / 510,000) * 1000 = 19.6078...
        // Let's check calculation roughly
        uint256 totalRaisedAmt = 510_000 * 1e18;
        uint256 aliceAmt = 10_000 * 1e18;
        uint256 yieldAmt = 1000 * 1e18;
        
        uint256 expectedAlice = (yieldAmt * aliceAmt) / totalRaisedAmt;
        
        // Due to precision, might vary slightly, but lets check withdrawable
        uint256 withdrawableAlice = assetToken.withdrawableDividendOf(alice);
        
        // Allow dust difference of 1 wei
        assertApproxEqAbs(withdrawableAlice, expectedAlice, 1);
        
        assetToken.claimDividends();
        // Check USDC balance increase
        // Initial (100k) - Contribution (10k) + Yield (~19.6)
        uint256 expectedBalance = 90_000 * 1e18 + expectedAlice;
        assertApproxEqAbs(usdc.balanceOf(alice), expectedBalance, 1);
        vm.stopPrank();

        // Bob claims
        vm.startPrank(bob);
        uint256 bobAmt = 500_000 * 1e18;
        uint256 expectedBob = (yieldAmt * bobAmt) / totalRaisedAmt;
        assetToken.claimDividends();
        assertApproxEqAbs(usdc.balanceOf(bob), 1_000_000 * 1e18 - 500_000 * 1e18 + expectedBob, 1);
        vm.stopPrank();
    }

    function test_Refund() public {
        vm.startPrank(admin);
        dealManager.startDeal(1000 * 1e18, 500 * 1e18, 1 days);
        vm.stopPrank();

        vm.startPrank(alice);
        usdc.approve(address(dealManager), 100 * 1e18);
        dealManager.contribute(100 * 1e18); // Only 100, soft cap is 500
        vm.stopPrank();

        vm.warp(block.timestamp + 2 days); // Expired

        // Try to finalize -> should fail
        vm.prank(admin);
        vm.expectRevert("Soft cap not met"); // Or "Soft cap not met"
        dealManager.finalizeDeal();

        // Refund
        vm.startPrank(alice);
        uint256 balanceBefore = usdc.balanceOf(alice);
        dealManager.refund();
        assertEq(usdc.balanceOf(alice), balanceBefore + 100 * 1e18);
        vm.stopPrank();
    }
}
