// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {CapitalWindowRegistry} from "./CapitalWindowRegistry.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {IERC20Minimal} from "v4-core/src/interfaces/external/IERC20Minimal.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {PoolId} from "v4-core/src/types/PoolId.sol";
import {Currency} from "v4-core/src/types/Currency.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {BeforeSwapDelta, toBeforeSwapDelta} from "v4-core/src/types/BeforeSwapDelta.sol";
import {ModifyLiquidityParams, SwapParams} from "v4-core/src/types/PoolOperation.sol";

/**
 * @title CapitalWindowHook
 * @dev Uniswap v4 custom-accounting hook that turns approved capital windows into token conversion rails.
 */
contract CapitalWindowHook is IHooks {
    struct HookData {
        uint256 windowId;
        address investor;
        uint256 minCompanyTokens;
        uint256 deadline;
        uint256 nonce;
        bytes signature;
    }

    IPoolManager public immutable poolManager;
    CapitalWindowRegistry public immutable registry;

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

    error OnlyPoolManager();
    error MissingHookData();
    error ExactInputOnly();
    error NativeCurrencyUnsupported();
    error AmountTooLarge();
    error UnauthorizedLiquidity();
    error HookNotImplemented();

    constructor(IPoolManager _poolManager, CapitalWindowRegistry _registry) {
        poolManager = _poolManager;
        registry = _registry;
    }

    modifier onlyPoolManager() {
        if (msg.sender != address(poolManager)) revert OnlyPoolManager();
        _;
    }

    function beforeSwap(address sender, PoolKey calldata key, SwapParams calldata params, bytes calldata hookData)
        external
        override
        onlyPoolManager
        returns (bytes4, BeforeSwapDelta, uint24)
    {
        if (params.amountSpecified >= 0) revert ExactInputOnly();
        if (hookData.length == 0) revert MissingHookData();

        HookData memory data = abi.decode(hookData, (HookData));
        (Currency inputCurrency, Currency outputCurrency) =
            params.zeroForOne ? (key.currency0, key.currency1) : (key.currency1, key.currency0);

        address paymentToken = Currency.unwrap(inputCurrency);
        address companyToken = Currency.unwrap(outputCurrency);
        if (paymentToken == address(0) || companyToken == address(0)) revert NativeCurrencyUnsupported();

        uint256 paymentAmount = uint256(-params.amountSpecified);

        CapitalWindowRegistry.ExecutionResult memory result = registry.consumeWindow(
            data.windowId,
            data.investor,
            sender,
            paymentToken,
            companyToken,
            paymentAmount,
            data.minCompanyTokens,
            data.deadline,
            data.nonce,
            data.signature
        );

        poolManager.take(inputCurrency, result.cashRecipient, paymentAmount);
        _settle(outputCurrency, result.companyTokenAmount);

        emit CapitalWindowHookSwap(
            key.toId(),
            data.windowId,
            data.investor,
            sender,
            result.mode,
            paymentAmount,
            result.companyTokenAmount,
            result.effectivePrice
        );

        return (
            IHooks.beforeSwap.selector,
            toBeforeSwapDelta(_toInt128(paymentAmount), -_toInt128(result.companyTokenAmount)),
            0
        );
    }

    function beforeAddLiquidity(
        address,
        PoolKey calldata,
        ModifyLiquidityParams calldata,
        bytes calldata
    ) external pure override returns (bytes4) {
        revert UnauthorizedLiquidity();
    }

    function beforeRemoveLiquidity(
        address,
        PoolKey calldata,
        ModifyLiquidityParams calldata,
        bytes calldata
    ) external pure override returns (bytes4) {
        revert UnauthorizedLiquidity();
    }

    function beforeInitialize(address, PoolKey calldata, uint160) external pure override returns (bytes4) {
        revert HookNotImplemented();
    }

    function afterInitialize(address, PoolKey calldata, uint160, int24) external pure override returns (bytes4) {
        revert HookNotImplemented();
    }

    function afterAddLiquidity(
        address,
        PoolKey calldata,
        ModifyLiquidityParams calldata,
        BalanceDelta,
        BalanceDelta,
        bytes calldata
    ) external pure override returns (bytes4, BalanceDelta) {
        revert HookNotImplemented();
    }

    function afterRemoveLiquidity(
        address,
        PoolKey calldata,
        ModifyLiquidityParams calldata,
        BalanceDelta,
        BalanceDelta,
        bytes calldata
    ) external pure override returns (bytes4, BalanceDelta) {
        revert HookNotImplemented();
    }

    function afterSwap(
        address,
        PoolKey calldata,
        SwapParams calldata,
        BalanceDelta,
        bytes calldata
    ) external pure override returns (bytes4, int128) {
        revert HookNotImplemented();
    }

    function beforeDonate(address, PoolKey calldata, uint256, uint256, bytes calldata)
        external
        pure
        override
        returns (bytes4)
    {
        revert HookNotImplemented();
    }

    function afterDonate(address, PoolKey calldata, uint256, uint256, bytes calldata)
        external
        pure
        override
        returns (bytes4)
    {
        revert HookNotImplemented();
    }

    function _settle(Currency currency, uint256 amount) internal {
        poolManager.sync(currency);
        IERC20Minimal(Currency.unwrap(currency)).transfer(address(poolManager), amount);
        poolManager.settle();
    }

    function _toInt128(uint256 amount) internal pure returns (int128) {
        if (amount > uint256(uint128(type(int128).max))) revert AmountTooLarge();
        return int128(uint128(amount));
    }
}
