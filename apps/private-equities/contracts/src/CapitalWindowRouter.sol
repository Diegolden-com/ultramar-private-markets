// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IUnlockCallback} from "v4-core/src/interfaces/callback/IUnlockCallback.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {IERC20Minimal} from "v4-core/src/interfaces/external/IERC20Minimal.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {Currency} from "v4-core/src/types/Currency.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {SwapParams} from "v4-core/src/types/PoolOperation.sol";

/**
 * @title CapitalWindowRouter
 * @dev Minimal gated router for exact-input Capital Window swaps.
 */
contract CapitalWindowRouter is IUnlockCallback {
    struct SwapRequest {
        address payer;
        address recipient;
        PoolKey key;
        SwapParams params;
        uint256 amountIn;
        bytes hookData;
    }

    IPoolManager public immutable poolManager;

    error OnlyPoolManager();
    error ExactInputOnly();
    error AmountMismatch();
    error NativeCurrencyUnsupported();
    error NoOutput();

    constructor(IPoolManager _poolManager) {
        poolManager = _poolManager;
    }

    function swapExactInput(
        PoolKey calldata key,
        SwapParams calldata params,
        uint256 amountIn,
        address recipient,
        bytes calldata hookData
    ) external returns (BalanceDelta delta) {
        if (params.amountSpecified >= 0) revert ExactInputOnly();
        if (uint256(-params.amountSpecified) != amountIn) revert AmountMismatch();

        bytes memory result = poolManager.unlock(
            abi.encode(
                SwapRequest({
                    payer: msg.sender,
                    recipient: recipient,
                    key: key,
                    params: params,
                    amountIn: amountIn,
                    hookData: hookData
                })
            )
        );
        delta = abi.decode(result, (BalanceDelta));
    }

    function unlockCallback(bytes calldata rawData) external returns (bytes memory) {
        if (msg.sender != address(poolManager)) revert OnlyPoolManager();

        SwapRequest memory request = abi.decode(rawData, (SwapRequest));
        Currency inputCurrency = request.params.zeroForOne ? request.key.currency0 : request.key.currency1;
        Currency outputCurrency = request.params.zeroForOne ? request.key.currency1 : request.key.currency0;

        _settleInput(inputCurrency, request.payer, request.amountIn);

        BalanceDelta delta = poolManager.swap(request.key, request.params, request.hookData);
        int128 outputDelta = request.params.zeroForOne ? delta.amount1() : delta.amount0();
        if (outputDelta <= 0) revert NoOutput();

        poolManager.take(outputCurrency, request.recipient, uint128(outputDelta));

        return abi.encode(delta);
    }

    function _settleInput(Currency currency, address payer, uint256 amount) internal {
        address token = Currency.unwrap(currency);
        if (token == address(0)) revert NativeCurrencyUnsupported();

        poolManager.sync(currency);
        IERC20Minimal(token).transferFrom(payer, address(poolManager), amount);
        poolManager.settle();
    }
}
