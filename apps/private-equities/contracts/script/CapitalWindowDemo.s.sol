// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {PoolManager} from "v4-core/src/PoolManager.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {Currency} from "v4-core/src/types/Currency.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {SwapParams} from "v4-core/src/types/PoolOperation.sol";
import {PoolSwapTest} from "v4-core/src/test/PoolSwapTest.sol";
import {TickMath} from "v4-core/src/libraries/TickMath.sol";
import {MessageHashUtils} from "openzeppelin-contracts/contracts/utils/cryptography/MessageHashUtils.sol";
import {Strings} from "openzeppelin-contracts/contracts/utils/Strings.sol";
import {AssetToken} from "../src/AssetToken.sol";
import {CapitalWindowHook} from "../src/CapitalWindowHook.sol";
import {CapitalWindowRegistry} from "../src/CapitalWindowRegistry.sol";
import {CapitalWindowRouter} from "../src/CapitalWindowRouter.sol";
import {SolvencyRegistry} from "../src/SolvencyRegistry.sol";
import {MockUSDC} from "../test/Mocks.sol";

/**
 * @dev Local, non-broadcast demo script for the Hookathon pitch.
 *
 * Run:
 *   forge script script/CapitalWindowDemo.s.sol:CapitalWindowDemo -vv
 */
contract CapitalWindowDemo is Script {
    using MessageHashUtils for bytes32;
    using Strings for uint256;

    uint256 private constant AUTHORIZER_PK = 0xA11CE;
    uint256 private constant TOKEN_SCALE = 1e18;
    uint256 private constant PRICE_SCALE = 1e18;
    uint160 private constant SQRT_PRICE_1_1 = 79228162514264337593543950336;
    uint160 private constant MIN_PRICE_LIMIT = TickMath.MIN_SQRT_PRICE + 1;
    uint160 private constant MAX_PRICE_LIMIT = TickMath.MAX_SQRT_PRICE - 1;

    MockUSDC private usdc;
    AssetToken private companyToken;
    SolvencyRegistry private solvency;
    CapitalWindowRegistry private registry;
    CapitalWindowHook private hook;
    CapitalWindowRouter private capitalRouter;
    PoolSwapTest private genericSwapRouter;
    IPoolManager private manager;
    PoolKey private key;
    Currency private paymentCurrency;
    Currency private companyCurrency;

    address private hookAddress;
    address private admin = address(0xA11CEAD);
    address private authorizer;
    address private issuer = address(0x1111);
    address private treasury = address(0x2222);
    address private investor = address(0x4444);
    address private secondInvestor = address(0x5555);

    function run() external {
        vm.warp(1_000_000);
        authorizer = vm.addr(AUTHORIZER_PK);

        _deployLocalV4Window();

        console2.log("Ultramar Port of Call / local v4 hook demo");
        console2.log("PoolManager", address(manager));
        console2.log("CapitalWindowHook", hookAddress);
        console2.log("CapitalWindowRouter", address(capitalRouter));
        console2.log("Demo investor", investor);

        _runApprovedWindow();
        _runMissingPassportRevert();
        _runGenericRouterRevert();
        _runExpiredAuthorizationRevert();
        _runMinimumOutputSlippageRevert();
        _runReplayRevert();
        _runStaleOracleRevert();

        console2.log("Demo complete: one approved settlement, six blocked paths.");
    }

    function _deployLocalV4Window() internal {
        manager = new PoolManager(admin);
        usdc = new MockUSDC();
        companyToken = new AssetToken("Lavanderias CX", "LCX", admin, address(usdc));
        solvency = new SolvencyRegistry(admin);
        registry = new CapitalWindowRegistry(admin, solvency);
        capitalRouter = new CapitalWindowRouter(manager);
        genericSwapRouter = new PoolSwapTest(manager);

        hookAddress = address(
            uint160(
                Hooks.BEFORE_ADD_LIQUIDITY_FLAG | Hooks.BEFORE_REMOVE_LIQUIDITY_FLAG | Hooks.BEFORE_SWAP_FLAG
                    | Hooks.BEFORE_SWAP_RETURNS_DELTA_FLAG
            )
        );
        address implementation = address(new CapitalWindowHook(manager, registry));
        vm.etch(hookAddress, implementation.code);
        hook = CapitalWindowHook(hookAddress);

        vm.startPrank(admin);
        registry.grantRole(registry.HOOK_ROLE(), hookAddress);
        registry.grantRole(registry.AUTHORIZER_ROLE(), authorizer);

        companyToken.updateWhitelist(hookAddress, true);
        companyToken.updateWhitelist(address(manager), true);
        companyToken.updateWhitelist(investor, true);
        companyToken.updateWhitelist(secondInvestor, true);

        companyToken.mint(admin, 2_000_000e18);
        companyToken.transfer(hookAddress, 1_500_000e18);
        vm.stopPrank();

        usdc.mint(investor, 100_000e18);
        usdc.mint(secondInvestor, 100_000e18);

        vm.prank(investor);
        usdc.approve(address(capitalRouter), type(uint256).max);
        vm.prank(secondInvestor);
        usdc.approve(address(capitalRouter), type(uint256).max);

        paymentCurrency = Currency.wrap(address(usdc));
        companyCurrency = Currency.wrap(address(companyToken));
        (Currency currency0, Currency currency1) = Currency.unwrap(paymentCurrency) < Currency.unwrap(companyCurrency)
            ? (paymentCurrency, companyCurrency)
            : (companyCurrency, paymentCurrency);

        key = PoolKey({
            currency0: currency0, currency1: currency1, fee: 3000, tickSpacing: 60, hooks: IHooks(hookAddress)
        });
        manager.initialize(key, SQRT_PRICE_1_1);

        vm.prank(admin);
        solvency.publishSolvency(issuer, 150, 250, block.timestamp);
    }

    function _runApprovedWindow() internal {
        uint256 windowId = _createWindow(20_000e18, 5_000e18, 1e18, 1_000e18, 1_000, 1 days);
        vm.prank(admin);
        registry.setInvestorLimit(windowId, investor, true, 5_000e18);

        uint256 paymentAmount = 1_500e18;
        (uint256 quoted, uint256 effectivePrice) = registry.quoteCompanyTokens(windowId, paymentAmount);
        bytes memory data = _hookData(windowId, investor, paymentAmount, quoted, 1);

        console2.log("APPROVED window", windowId);
        console2.log("  exact input USDC", _formatTokenAmount(paymentAmount));
        console2.log("  quoted LCX output", _formatTokenAmount(quoted));
        console2.log("  effective price USDC/LCX", _formatPrice(effectivePrice));

        _swapWithHookData(investor, paymentAmount, data);

        require(usdc.balanceOf(treasury) == paymentAmount, "treasury payment mismatch");
        require(companyToken.balanceOf(investor) == quoted, "investor output mismatch");
        require(registry.windowFilled(windowId) == paymentAmount, "window fill mismatch");

        console2.log("  settled: treasury received USDC and investor received LCX");
        console2.log("  treasury USDC balance", _formatTokenAmount(usdc.balanceOf(treasury)));
        console2.log("  investor LCX balance", _formatTokenAmount(companyToken.balanceOf(investor)));
    }

    function _runMissingPassportRevert() internal {
        uint256 windowId = _createWindow(10_000e18, 5_000e18, 1e18, 0, 0, 1 days);
        vm.prank(admin);
        registry.setInvestorLimit(windowId, secondInvestor, true, 5_000e18);

        console2.log("MISSING PASSPORT window", windowId);
        vm.prank(secondInvestor);
        try capitalRouter.swapExactInput(
            key,
            SwapParams({
                zeroForOne: _paymentIsCurrency0(),
                amountSpecified: -int256(1_000e18),
                sqrtPriceLimitX96: _paymentIsCurrency0() ? MIN_PRICE_LIMIT : MAX_PRICE_LIMIT
            }),
            1_000e18,
            secondInvestor,
            ""
        ) returns (
            BalanceDelta
        ) {
            revert("missing passport swap unexpectedly succeeded");
        } catch {
            console2.log("  blocked: hookData passport is required");
        }
    }

    function _runReplayRevert() internal {
        uint256 windowId = _createWindow(10_000e18, 5_000e18, 1e18, 0, 0, 1 days);
        vm.prank(admin);
        registry.setInvestorLimit(windowId, secondInvestor, true, 5_000e18);

        uint256 paymentAmount = 1_000e18;
        (uint256 quoted,) = registry.quoteCompanyTokens(windowId, paymentAmount);
        bytes memory data = _hookData(windowId, secondInvestor, paymentAmount, quoted, 13);

        console2.log("REPLAY window", windowId);
        _swapWithHookData(secondInvestor, paymentAmount, data);

        vm.prank(secondInvestor);
        try capitalRouter.swapExactInput(
            key,
            SwapParams({
                zeroForOne: _paymentIsCurrency0(),
                amountSpecified: -int256(paymentAmount),
                sqrtPriceLimitX96: _paymentIsCurrency0() ? MIN_PRICE_LIMIT : MAX_PRICE_LIMIT
            }),
            paymentAmount,
            secondInvestor,
            data
        ) returns (
            BalanceDelta
        ) {
            revert("replayed authorization unexpectedly succeeded");
        } catch {
            console2.log("  blocked: authorization nonce was already consumed");
        }
    }

    function _runGenericRouterRevert() internal {
        uint256 windowId = _createWindow(10_000e18, 5_000e18, 1e18, 0, 0, 1 days);
        vm.prank(admin);
        registry.setInvestorLimit(windowId, secondInvestor, true, 5_000e18);

        uint256 paymentAmount = 1_000e18;
        (uint256 quoted,) = registry.quoteCompanyTokens(windowId, paymentAmount);
        bytes memory data = _hookData(windowId, secondInvestor, paymentAmount, quoted, 31);

        console2.log("GENERIC ROUTER window", windowId);
        vm.prank(secondInvestor);
        try genericSwapRouter.swap(
            key,
            SwapParams({
                zeroForOne: _paymentIsCurrency0(),
                amountSpecified: -int256(paymentAmount),
                sqrtPriceLimitX96: _paymentIsCurrency0() ? MIN_PRICE_LIMIT : MAX_PRICE_LIMIT
            }),
            PoolSwapTest.TestSettings({takeClaims: false, settleUsingBurn: false}),
            data
        ) returns (
            BalanceDelta
        ) {
            revert("generic router swap unexpectedly succeeded");
        } catch {
            console2.log("  blocked: passport is bound to CapitalWindowRouter");
        }

        _requireNoFillOrSecondInvestorOutput(windowId, "generic router");
    }

    function _runExpiredAuthorizationRevert() internal {
        uint256 windowId = _createWindow(10_000e18, 5_000e18, 1e18, 0, 0, 1 days);
        vm.prank(admin);
        registry.setInvestorLimit(windowId, secondInvestor, true, 5_000e18);

        uint256 paymentAmount = 1_000e18;
        (uint256 quoted,) = registry.quoteCompanyTokens(windowId, paymentAmount);
        bytes memory data =
            _hookDataWithDeadline(windowId, secondInvestor, paymentAmount, quoted, block.timestamp - 1, 32);

        console2.log("EXPIRED AUTHORIZATION window", windowId);
        vm.prank(secondInvestor);
        try capitalRouter.swapExactInput(
            key,
            SwapParams({
                zeroForOne: _paymentIsCurrency0(),
                amountSpecified: -int256(paymentAmount),
                sqrtPriceLimitX96: _paymentIsCurrency0() ? MIN_PRICE_LIMIT : MAX_PRICE_LIMIT
            }),
            paymentAmount,
            secondInvestor,
            data
        ) returns (
            BalanceDelta
        ) {
            revert("expired authorization swap unexpectedly succeeded");
        } catch {
            console2.log("  blocked: signed passport deadline expired");
        }

        _requireNoFillOrSecondInvestorOutput(windowId, "expired authorization");
    }

    function _runMinimumOutputSlippageRevert() internal {
        uint256 windowId = _createWindow(10_000e18, 5_000e18, 1e18, 0, 0, 1 days);
        vm.prank(admin);
        registry.setInvestorLimit(windowId, secondInvestor, true, 5_000e18);

        uint256 paymentAmount = 1_000e18;
        (uint256 quoted,) = registry.quoteCompanyTokens(windowId, paymentAmount);
        bytes memory data = _hookData(windowId, secondInvestor, paymentAmount, quoted + 1, 33);

        console2.log("MIN OUTPUT window", windowId);
        vm.prank(secondInvestor);
        try capitalRouter.swapExactInput(
            key,
            SwapParams({
                zeroForOne: _paymentIsCurrency0(),
                amountSpecified: -int256(paymentAmount),
                sqrtPriceLimitX96: _paymentIsCurrency0() ? MIN_PRICE_LIMIT : MAX_PRICE_LIMIT
            }),
            paymentAmount,
            secondInvestor,
            data
        ) returns (
            BalanceDelta
        ) {
            revert("minimum output swap unexpectedly succeeded");
        } catch {
            console2.log("  blocked: signed minimum output exceeds quote");
        }

        _requireNoFillOrSecondInvestorOutput(windowId, "minimum output");
    }

    function _runStaleOracleRevert() internal {
        vm.warp(block.timestamp + 2 days);

        uint256 windowId = _createWindow(10_000e18, 5_000e18, 1e18, 0, 0, 1 days);
        vm.prank(admin);
        registry.setInvestorLimit(windowId, investor, true, 5_000e18);

        uint256 paymentAmount = 1_000e18;
        (uint256 quoted,) = registry.quoteCompanyTokens(windowId, paymentAmount);
        bytes memory data = _hookData(windowId, investor, paymentAmount, quoted, 21);

        console2.log("STALE ORACLE window", windowId);
        vm.prank(investor);
        try capitalRouter.swapExactInput(
            key,
            SwapParams({
                zeroForOne: _paymentIsCurrency0(),
                amountSpecified: -int256(paymentAmount),
                sqrtPriceLimitX96: _paymentIsCurrency0() ? MIN_PRICE_LIMIT : MAX_PRICE_LIMIT
            }),
            paymentAmount,
            investor,
            data
        ) returns (
            BalanceDelta
        ) {
            revert("stale oracle swap unexpectedly succeeded");
        } catch {
            console2.log("  blocked: issuer proof is stale");
        }
    }

    function _createWindow(
        uint256 totalCap,
        uint256 perInvestorCap,
        uint256 basePrice,
        uint256 stepSize,
        uint16 stepPriceBps,
        uint64 oracleFreshness
    ) internal returns (uint256 windowId) {
        CapitalWindowRegistry.WindowConfig memory config = CapitalWindowRegistry.WindowConfig({
            mode: CapitalWindowRegistry.WindowMode.PrimaryConversion,
            paymentToken: address(usdc),
            companyToken: address(companyToken),
            cashRecipient: treasury,
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
            oracleFreshness: oracleFreshness,
            minSolvencyRatio: 0,
            minLiquidityRatio: 100,
            active: true
        });

        vm.prank(admin);
        windowId = registry.createWindow(config);
    }

    function _hookData(uint256 windowId, address buyer, uint256 paymentAmount, uint256 minCompanyTokens, uint256 nonce)
        internal
        view
        returns (bytes memory)
    {
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

    function _requireNoFillOrSecondInvestorOutput(uint256 windowId, string memory label) internal view {
        require(registry.windowFilled(windowId) == 0, string.concat(label, " filled the window"));
        require(companyToken.balanceOf(secondInvestor) == 0, string.concat(label, " delivered LCX"));
    }

    function _paymentIsCurrency0() internal view returns (bool) {
        return Currency.unwrap(paymentCurrency) == Currency.unwrap(key.currency0);
    }

    function _formatTokenAmount(uint256 amount) internal pure returns (string memory) {
        return _formatScaled(amount, TOKEN_SCALE, 2);
    }

    function _formatPrice(uint256 amount) internal pure returns (string memory) {
        return _formatScaled(amount, PRICE_SCALE, 4);
    }

    function _formatScaled(uint256 amount, uint256 scale, uint256 decimals) internal pure returns (string memory) {
        uint256 whole = amount / scale;
        uint256 fractional = ((amount % scale) * (10 ** decimals)) / scale;
        string memory paddedFractional = fractional.toString();

        while (bytes(paddedFractional).length < decimals) {
            paddedFractional = string.concat("0", paddedFractional);
        }

        return string.concat(whole.toString(), ".", paddedFractional);
    }
}
