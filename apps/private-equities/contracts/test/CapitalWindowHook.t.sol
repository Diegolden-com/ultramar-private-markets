// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Deployers} from "v4-core/test/utils/Deployers.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {Currency} from "v4-core/src/types/Currency.sol";
import {PoolId} from "v4-core/src/types/PoolId.sol";
import {PoolIdLibrary} from "v4-core/src/types/PoolId.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {SwapParams} from "v4-core/src/types/PoolOperation.sol";
import {PoolSwapTest} from "v4-core/src/test/PoolSwapTest.sol";
import {MessageHashUtils} from "openzeppelin-contracts/contracts/utils/cryptography/MessageHashUtils.sol";
import {AssetToken} from "../src/AssetToken.sol";
import {CapitalWindowHook} from "../src/CapitalWindowHook.sol";
import {CapitalWindowRegistry} from "../src/CapitalWindowRegistry.sol";
import {CapitalWindowRouter} from "../src/CapitalWindowRouter.sol";
import {SolvencyRegistry} from "../src/SolvencyRegistry.sol";
import {MockUSDC} from "./Mocks.sol";

contract CapitalWindowHookTest is Test, Deployers {
    using MessageHashUtils for bytes32;
    using PoolIdLibrary for PoolKey;
    using Hooks for IHooks;

    uint256 private constant AUTHORIZER_PK = 0xA11CE;
    uint256 private constant PRICE_SCALE = 1e18;

    MockUSDC private usdc;
    AssetToken private companyToken;
    SolvencyRegistry private solvency;
    CapitalWindowRegistry private registry;
    CapitalWindowHook private hook;
    CapitalWindowRouter private capitalRouter;

    Currency private paymentCurrency;
    Currency private companyCurrency;
    address private hookAddress;
    address private authorizer;
    address private issuer = address(0x1111);
    address private treasury = address(0x2222);
    address private sellerEscrow = address(0x3333);
    address private investor = address(0x4444);
    address private secondInvestor = address(0x5555);

    event CapitalWindowHookSwap(
        PoolId indexed poolId,
        uint256 indexed windowId,
        address indexed investor,
        address router,
        CapitalWindowRegistry.WindowMode mode,
        uint256 paymentAmount,
        uint256 companyTokenAmount,
        uint256 effectivePrice
    );
    event WindowConsumed(
        uint256 indexed windowId,
        address indexed investor,
        CapitalWindowRegistry.WindowMode indexed mode,
        uint256 paymentAmount,
        uint256 companyTokenAmount,
        uint256 filledAfter
    );

    function setUp() public {
        vm.warp(1_000_000);
        authorizer = vm.addr(AUTHORIZER_PK);

        deployFreshManagerAndRouters();

        usdc = new MockUSDC();
        companyToken = new AssetToken("Lavanderias CX", "LCX", address(this), address(usdc));
        solvency = new SolvencyRegistry(address(this));
        registry = new CapitalWindowRegistry(address(this), solvency);
        capitalRouter = new CapitalWindowRouter(manager);

        hookAddress = address(
            uint160(
                Hooks.BEFORE_ADD_LIQUIDITY_FLAG | Hooks.BEFORE_REMOVE_LIQUIDITY_FLAG | Hooks.BEFORE_SWAP_FLAG
                    | Hooks.BEFORE_SWAP_RETURNS_DELTA_FLAG
            )
        );
        address implementation = address(new CapitalWindowHook(manager, registry));
        vm.etch(hookAddress, implementation.code);
        hook = CapitalWindowHook(hookAddress);

        registry.grantRole(registry.HOOK_ROLE(), hookAddress);
        registry.grantRole(registry.AUTHORIZER_ROLE(), authorizer);

        companyToken.updateWhitelist(hookAddress, true);
        companyToken.updateWhitelist(address(manager), true);
        companyToken.updateWhitelist(investor, true);
        companyToken.updateWhitelist(secondInvestor, true);

        companyToken.mint(address(this), 2_000_000e18);
        companyToken.transfer(hookAddress, 1_500_000e18);

        usdc.mint(investor, 100_000e18);
        usdc.mint(secondInvestor, 100_000e18);

        vm.prank(investor);
        usdc.approve(address(capitalRouter), type(uint256).max);
        vm.prank(secondInvestor);
        usdc.approve(address(capitalRouter), type(uint256).max);

        paymentCurrency = Currency.wrap(address(usdc));
        companyCurrency = Currency.wrap(address(companyToken));
        (currency0, currency1) = Currency.unwrap(paymentCurrency) < Currency.unwrap(companyCurrency)
            ? (paymentCurrency, companyCurrency)
            : (companyCurrency, paymentCurrency);
        (key,) = initPool(currency0, currency1, IHooks(hookAddress), 3000, SQRT_PRICE_1_1);

        solvency.publishSolvency(issuer, 150, 250, block.timestamp);
    }

    function testHookAddressEncodesOnlyCapitalWindowPermissions() public view {
        IHooks hookPermissions = IHooks(hookAddress);

        hookPermissions.validateHookPermissions(
            Hooks.Permissions({
                beforeInitialize: false,
                afterInitialize: false,
                beforeAddLiquidity: true,
                afterAddLiquidity: false,
                beforeRemoveLiquidity: true,
                afterRemoveLiquidity: false,
                beforeSwap: true,
                afterSwap: false,
                beforeDonate: false,
                afterDonate: false,
                beforeSwapReturnDelta: true,
                afterSwapReturnDelta: false,
                afterAddLiquidityReturnDelta: false,
                afterRemoveLiquidityReturnDelta: false
            })
        );

        assertTrue(hookPermissions.isValidHookAddress(3000), "hook address must be valid for static fee pools");
        assertTrue(hookPermissions.hasPermission(Hooks.BEFORE_ADD_LIQUIDITY_FLAG), "before add liquidity");
        assertTrue(hookPermissions.hasPermission(Hooks.BEFORE_REMOVE_LIQUIDITY_FLAG), "before remove liquidity");
        assertTrue(hookPermissions.hasPermission(Hooks.BEFORE_SWAP_FLAG), "before swap");
        assertTrue(hookPermissions.hasPermission(Hooks.BEFORE_SWAP_RETURNS_DELTA_FLAG), "before swap delta");

        assertFalse(hookPermissions.hasPermission(Hooks.AFTER_SWAP_FLAG), "after swap disabled");
        assertFalse(hookPermissions.hasPermission(Hooks.AFTER_SWAP_RETURNS_DELTA_FLAG), "after swap delta disabled");
        assertFalse(hookPermissions.hasPermission(Hooks.BEFORE_DONATE_FLAG), "before donate disabled");
        assertFalse(hookPermissions.hasPermission(Hooks.AFTER_DONATE_FLAG), "after donate disabled");
    }

    function testAuthorizationDigestBindsPassportToCapitalRouter() public view {
        uint256 windowId = 1;
        uint256 paymentAmount = 1_000e18;
        uint256 minCompanyTokens = 950e18;
        uint256 deadline = block.timestamp + 1 hours;
        uint256 nonce = 42;

        bytes32 capitalRouterDigest = registry.authorizationDigest(
            windowId,
            investor,
            address(capitalRouter),
            paymentAmount,
            minCompanyTokens,
            deadline,
            nonce
        );
        bytes32 genericRouterDigest = registry.authorizationDigest(
            windowId,
            investor,
            address(swapRouter),
            paymentAmount,
            minCompanyTokens,
            deadline,
            nonce
        );

        assertNotEq(capitalRouterDigest, genericRouterDigest, "passport must bind to the approved router");
    }

    function testWindowStepCurveQuotesExactPricingExample() public {
        uint256 windowId = _createWindow(
            CapitalWindowRegistry.WindowMode.PrimaryConversion,
            treasury,
            20_000e18,
            5_000e18,
            1e18,
            1_000e18,
            1_000
        );

        uint256 paymentAmount = 1_500e18;
        uint256 expectedOutput = 1_000e18 + ((500e18 * PRICE_SCALE) / 11e17);
        (uint256 quoted, uint256 effectivePrice) = registry.quoteCompanyTokens(windowId, paymentAmount);

        assertEq(quoted, expectedOutput, "1,500 USDC should cross the 10% tranche");
        assertEq(quoted, 1_454_545454545454545454, "deck LCX output");
        assertEq(effectivePrice, 1_031250000000000000, "deck effective price");
    }

    function testPrimaryConversionWindowExecutesCustomAccountingSwap() public {
        uint256 windowId = _createWindow(
            CapitalWindowRegistry.WindowMode.PrimaryConversion,
            treasury,
            20_000e18,
            5_000e18,
            1e18,
            1_000e18,
            1_000
        );
        registry.setInvestorLimit(windowId, investor, true, 5_000e18);

        uint256 paymentAmount = 1_500e18;
        (uint256 quoted, uint256 effectivePrice) = registry.quoteCompanyTokens(windowId, paymentAmount);
        assertLt(quoted, paymentAmount, "step curve should reduce output after the first tranche");

        uint256 hookCompanyBefore = companyToken.balanceOf(hookAddress);
        _expectWindowEvents(
            windowId,
            investor,
            CapitalWindowRegistry.WindowMode.PrimaryConversion,
            paymentAmount,
            quoted,
            effectivePrice,
            paymentAmount
        );
        BalanceDelta delta = _swap(windowId, investor, paymentAmount, quoted, 1);

        assertEq(usdc.balanceOf(treasury), paymentAmount, "treasury receives payment");
        assertEq(companyToken.balanceOf(investor), quoted, "investor receives company tokens");
        assertEq(companyToken.balanceOf(hookAddress), hookCompanyBefore - quoted, "hook inventory decreases");
        assertEq(registry.windowFilled(windowId), paymentAmount, "window fill tracks payment");

        if (_paymentIsCurrency0()) {
            assertEq(delta.amount0(), -int128(int256(paymentAmount)), "payment delta");
            assertEq(delta.amount1(), int128(int256(quoted)), "company token delta");
        } else {
            assertEq(delta.amount1(), -int128(int256(paymentAmount)), "payment delta");
            assertEq(delta.amount0(), int128(int256(quoted)), "company token delta");
        }
    }

    function testSecondaryLiquidityWindowRoutesCashToEscrow() public {
        uint256 windowId = _createWindow(
            CapitalWindowRegistry.WindowMode.SecondaryLiquidity,
            sellerEscrow,
            10_000e18,
            4_000e18,
            2e18,
            0,
            0
        );
        registry.setInvestorLimit(windowId, secondInvestor, true, 4_000e18);

        uint256 paymentAmount = 2_000e18;
        (uint256 quoted, uint256 effectivePrice) = registry.quoteCompanyTokens(windowId, paymentAmount);
        _expectWindowEvents(
            windowId,
            secondInvestor,
            CapitalWindowRegistry.WindowMode.SecondaryLiquidity,
            paymentAmount,
            quoted,
            effectivePrice,
            paymentAmount
        );
        _swap(windowId, secondInvestor, paymentAmount, quoted, 11);

        assertEq(usdc.balanceOf(sellerEscrow), paymentAmount, "seller escrow receives secondary cash");
        assertEq(companyToken.balanceOf(secondInvestor), 1_000e18, "secondary buyer receives priced tokens");
    }

    function testOutsideWindowReverts() public {
        uint256 windowId = _createWindow(
            CapitalWindowRegistry.WindowMode.PrimaryConversion,
            treasury,
            10_000e18,
            5_000e18,
            1e18,
            0,
            0
        );
        registry.setWindowActive(windowId, true);
        registry.setInvestorLimit(windowId, investor, true, 5_000e18);

        vm.warp(block.timestamp + 8 days);

        (uint256 quoted,) = registry.quoteCompanyTokens(windowId, 1_000e18);
        bytes memory data = _hookData(windowId, investor, 1_000e18, quoted, 2);
        vm.expectRevert();
        _swapWithHookData(investor, 1_000e18, data);
    }

    function testOverTotalCapReverts() public {
        uint256 windowId = _createWindow(
            CapitalWindowRegistry.WindowMode.PrimaryConversion,
            treasury,
            1_000e18,
            2_000e18,
            1e18,
            0,
            0
        );
        registry.setInvestorLimit(windowId, investor, true, 2_000e18);

        (uint256 quoted,) = registry.quoteCompanyTokens(windowId, 1_100e18);
        bytes memory data = _hookData(windowId, investor, 1_100e18, quoted, 3);
        vm.expectRevert();
        _swapWithHookData(investor, 1_100e18, data);
    }

    function testPerInvestorCapReverts() public {
        uint256 windowId = _createWindow(
            CapitalWindowRegistry.WindowMode.PrimaryConversion,
            treasury,
            10_000e18,
            500e18,
            1e18,
            0,
            0
        );
        registry.setInvestorLimit(windowId, investor, true, 500e18);

        (uint256 quoted,) = registry.quoteCompanyTokens(windowId, 600e18);
        bytes memory data = _hookData(windowId, investor, 600e18, quoted, 4);
        vm.expectRevert();
        _swapWithHookData(investor, 600e18, data);
    }

    function testStaleOracleReverts() public {
        uint256 windowId = _createWindow(
            CapitalWindowRegistry.WindowMode.PrimaryConversion,
            treasury,
            10_000e18,
            5_000e18,
            1e18,
            0,
            0
        );
        registry.setInvestorLimit(windowId, investor, true, 5_000e18);

        vm.warp(block.timestamp + 2 days);

        (uint256 quoted,) = registry.quoteCompanyTokens(windowId, 1_000e18);
        bytes memory data = _hookData(windowId, investor, 1_000e18, quoted, 5);
        vm.expectRevert();
        _swapWithHookData(investor, 1_000e18, data);
    }

    function testUnapprovedInvestorReverts() public {
        uint256 windowId = _createWindow(
            CapitalWindowRegistry.WindowMode.PrimaryConversion,
            treasury,
            10_000e18,
            5_000e18,
            1e18,
            0,
            0
        );

        (uint256 quoted,) = registry.quoteCompanyTokens(windowId, 1_000e18);
        bytes memory data = _hookData(windowId, investor, 1_000e18, quoted, 6);
        vm.expectRevert();
        _swapWithHookData(investor, 1_000e18, data);
    }

    function testMissingPassportHookDataReverts() public {
        uint256 windowId = _createWindow(
            CapitalWindowRegistry.WindowMode.PrimaryConversion,
            treasury,
            10_000e18,
            5_000e18,
            1e18,
            0,
            0
        );
        registry.setInvestorLimit(windowId, investor, true, 5_000e18);

        vm.prank(investor);
        vm.expectRevert();
        capitalRouter.swapExactInput(
            key,
            SwapParams({
                zeroForOne: _paymentIsCurrency0(),
                amountSpecified: -int256(1_000e18),
                sqrtPriceLimitX96: _paymentIsCurrency0() ? MIN_PRICE_LIMIT : MAX_PRICE_LIMIT
            }),
            1_000e18,
            investor,
            ZERO_BYTES
        );
    }

    function testGenericRouterWithCapitalPassportReverts() public {
        uint256 windowId = _createWindow(
            CapitalWindowRegistry.WindowMode.PrimaryConversion,
            treasury,
            10_000e18,
            5_000e18,
            1e18,
            0,
            0
        );
        registry.setInvestorLimit(windowId, investor, true, 5_000e18);

        uint256 paymentAmount = 1_000e18;
        (uint256 quoted,) = registry.quoteCompanyTokens(windowId, paymentAmount);
        bytes memory data = _hookData(windowId, investor, paymentAmount, quoted, 14);

        vm.prank(investor);
        vm.expectRevert();
        swapRouter.swap(
            key,
            SwapParams({
                zeroForOne: _paymentIsCurrency0(),
                amountSpecified: -int256(paymentAmount),
                sqrtPriceLimitX96: _paymentIsCurrency0() ? MIN_PRICE_LIMIT : MAX_PRICE_LIMIT
            }),
            PoolSwapTest.TestSettings({takeClaims: false, settleUsingBurn: false}),
            data
        );

        assertEq(registry.windowFilled(windowId), 0, "generic router must not consume the capital window");
        assertEq(companyToken.balanceOf(investor), 0, "generic router must not deliver company tokens");
        assertEq(usdc.balanceOf(treasury), 0, "generic router must not route cash to treasury");
    }

    function testInvalidSignatureReverts() public {
        uint256 windowId = _createWindow(
            CapitalWindowRegistry.WindowMode.PrimaryConversion,
            treasury,
            10_000e18,
            5_000e18,
            1e18,
            0,
            0
        );
        registry.setInvestorLimit(windowId, investor, true, 5_000e18);

        uint256 paymentAmount = 1_000e18;
        (uint256 quoted,) = registry.quoteCompanyTokens(windowId, paymentAmount);
        bytes memory badSignature = _signature(windowId, investor, paymentAmount, quoted, block.timestamp + 1 hours, 99);
        CapitalWindowHook.HookData memory data = CapitalWindowHook.HookData({
            windowId: windowId,
            investor: investor,
            minCompanyTokens: quoted,
            deadline: block.timestamp + 1 hours,
            nonce: 100,
            signature: badSignature
        });

        vm.prank(investor);
        vm.expectRevert();
        capitalRouter.swapExactInput(
            key,
            SwapParams({
                zeroForOne: _paymentIsCurrency0(),
                amountSpecified: -int256(paymentAmount),
                sqrtPriceLimitX96: _paymentIsCurrency0() ? MIN_PRICE_LIMIT : MAX_PRICE_LIMIT
            }),
            paymentAmount,
            investor,
            abi.encode(data)
        );
    }

    function testExpiredAuthorizationReverts() public {
        uint256 windowId = _createWindow(
            CapitalWindowRegistry.WindowMode.PrimaryConversion,
            treasury,
            10_000e18,
            5_000e18,
            1e18,
            0,
            0
        );
        registry.setInvestorLimit(windowId, investor, true, 5_000e18);

        uint256 paymentAmount = 1_000e18;
        (uint256 quoted,) = registry.quoteCompanyTokens(windowId, paymentAmount);
        bytes memory data = _hookDataWithDeadline(windowId, investor, paymentAmount, quoted, block.timestamp - 1, 15);

        vm.expectRevert();
        _swapWithHookData(investor, paymentAmount, data);

        assertEq(registry.windowFilled(windowId), 0, "expired authorization must not fill the window");
        assertEq(companyToken.balanceOf(investor), 0, "expired authorization must not deliver company tokens");
        assertEq(usdc.balanceOf(treasury), 0, "expired authorization must not route cash to treasury");
    }

    function testAuthorizationReplayReverts() public {
        uint256 windowId = _createWindow(
            CapitalWindowRegistry.WindowMode.PrimaryConversion,
            treasury,
            10_000e18,
            5_000e18,
            1e18,
            0,
            0
        );
        registry.setInvestorLimit(windowId, investor, true, 5_000e18);

        uint256 paymentAmount = 1_000e18;
        (uint256 quoted,) = registry.quoteCompanyTokens(windowId, paymentAmount);
        bytes memory data = _hookData(windowId, investor, paymentAmount, quoted, 13);

        _swapWithHookData(investor, paymentAmount, data);

        vm.expectRevert();
        _swapWithHookData(investor, paymentAmount, data);
    }

    function testMinimumOutputSlippageReverts() public {
        uint256 windowId = _createWindow(
            CapitalWindowRegistry.WindowMode.PrimaryConversion,
            treasury,
            10_000e18,
            5_000e18,
            1e18,
            0,
            0
        );
        registry.setInvestorLimit(windowId, investor, true, 5_000e18);

        uint256 paymentAmount = 1_000e18;
        (uint256 quoted,) = registry.quoteCompanyTokens(windowId, paymentAmount);
        bytes memory data = _hookData(windowId, investor, paymentAmount, quoted + 1, 16);

        vm.expectRevert();
        _swapWithHookData(investor, paymentAmount, data);

        assertEq(registry.windowFilled(windowId), 0, "slippage rejection must not fill the window");
        assertEq(companyToken.balanceOf(investor), 0, "slippage rejection must not deliver company tokens");
        assertEq(usdc.balanceOf(treasury), 0, "slippage rejection must not route cash to treasury");
    }

    function testExactOutputReverts() public {
        uint256 windowId = _createWindow(
            CapitalWindowRegistry.WindowMode.PrimaryConversion,
            treasury,
            10_000e18,
            5_000e18,
            1e18,
            0,
            0
        );

        vm.prank(investor);
        vm.expectRevert();
        capitalRouter.swapExactInput(
            key,
            SwapParams({
                zeroForOne: _paymentIsCurrency0(),
                amountSpecified: 1_000e18,
                sqrtPriceLimitX96: _paymentIsCurrency0() ? MIN_PRICE_LIMIT : MAX_PRICE_LIMIT
            }),
            1_000e18,
            investor,
            abi.encode(
                CapitalWindowHook.HookData({
                    windowId: windowId,
                    investor: investor,
                    minCompanyTokens: 0,
                    deadline: block.timestamp + 1 hours,
                    nonce: 7,
                    signature: ""
                })
            )
        );
    }

    function testUnauthorizedLiquidityModificationReverts() public {
        vm.expectRevert();
        modifyLiquidityRouter.modifyLiquidity(key, LIQUIDITY_PARAMS, ZERO_BYTES);
    }

    function _createWindow(
        CapitalWindowRegistry.WindowMode mode,
        address cashRecipient,
        uint256 totalCap,
        uint256 perInvestorCap,
        uint256 basePrice,
        uint256 stepSize,
        uint16 stepPriceBps
    ) internal returns (uint256 windowId) {
        CapitalWindowRegistry.WindowConfig memory config = CapitalWindowRegistry.WindowConfig({
            mode: mode,
            paymentToken: address(usdc),
            companyToken: address(companyToken),
            cashRecipient: cashRecipient,
            oracleSubject: issuer,
            startTime: uint64(block.timestamp),
            endTime: uint64(block.timestamp + 1 days),
            totalCap: totalCap,
            perInvestorCap: perInvestorCap,
            minTicket: 100e18,
            maxTicket: 0,
            basePrice: basePrice,
            stepSize: stepSize,
            stepPriceBps: stepPriceBps,
            oracleFreshness: 1 days,
            minSolvencyRatio: 0,
            minLiquidityRatio: 100,
            active: true
        });

        windowId = registry.createWindow(config);
    }

    function _swap(uint256 windowId, address buyer, uint256 paymentAmount, uint256 minCompanyTokens, uint256 nonce)
        internal
        returns (BalanceDelta)
    {
        return _swapWithHookData(buyer, paymentAmount, _hookData(windowId, buyer, paymentAmount, minCompanyTokens, nonce));
    }

    function _hookData(
        uint256 windowId,
        address buyer,
        uint256 paymentAmount,
        uint256 minCompanyTokens,
        uint256 nonce
    ) internal view returns (bytes memory) {
        uint256 deadline = block.timestamp + 1 hours;
        return _hookDataWithDeadline(windowId, buyer, paymentAmount, minCompanyTokens, deadline, nonce);
    }

    function _hookDataWithDeadline(
        uint256 windowId,
        address buyer,
        uint256 paymentAmount,
        uint256 minCompanyTokens,
        uint256 deadline,
        uint256 nonce
    ) internal view returns (bytes memory) {
        CapitalWindowHook.HookData memory data = CapitalWindowHook.HookData({
            windowId: windowId,
            investor: buyer,
            minCompanyTokens: minCompanyTokens,
            deadline: deadline,
            nonce: nonce,
            signature: _signature(windowId, buyer, paymentAmount, minCompanyTokens, deadline, nonce)
        });
        return abi.encode(data);
    }

    function _swapWithHookData(address buyer, uint256 paymentAmount, bytes memory hookData)
        internal
        returns (BalanceDelta)
    {
        vm.prank(buyer);
        return capitalRouter.swapExactInput(
            key,
            SwapParams({
                zeroForOne: _paymentIsCurrency0(),
                amountSpecified: -int256(paymentAmount),
                sqrtPriceLimitX96: _paymentIsCurrency0() ? MIN_PRICE_LIMIT : MAX_PRICE_LIMIT
            }),
            paymentAmount,
            buyer,
            hookData
        );
    }

    function _expectWindowEvents(
        uint256 windowId,
        address buyer,
        CapitalWindowRegistry.WindowMode mode,
        uint256 paymentAmount,
        uint256 companyTokenAmount,
        uint256 effectivePrice,
        uint256 filledAfter
    ) internal {
        vm.expectEmit(true, true, true, true, address(registry));
        emit WindowConsumed(windowId, buyer, mode, paymentAmount, companyTokenAmount, filledAfter);

        vm.expectEmit(true, true, true, true, hookAddress);
        emit CapitalWindowHookSwap(
            key.toId(),
            windowId,
            buyer,
            address(capitalRouter),
            mode,
            paymentAmount,
            companyTokenAmount,
            effectivePrice
        );
    }

    function _signature(
        uint256 windowId,
        address buyer,
        uint256 paymentAmount,
        uint256 minCompanyTokens,
        uint256 deadline,
        uint256 nonce
    ) internal view returns (bytes memory) {
        bytes32 digest = registry.authorizationDigest(
            windowId, buyer, address(capitalRouter), paymentAmount, minCompanyTokens, deadline, nonce
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(AUTHORIZER_PK, digest.toEthSignedMessageHash());
        return abi.encodePacked(r, s, v);
    }

    function _paymentIsCurrency0() internal view returns (bool) {
        return Currency.unwrap(paymentCurrency) == Currency.unwrap(currency0);
    }
}
