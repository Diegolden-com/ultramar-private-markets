// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {MessageHashUtils} from "openzeppelin-contracts/contracts/utils/cryptography/MessageHashUtils.sol";
import {SafeCast} from "openzeppelin-contracts/contracts/utils/math/SafeCast.sol";
import {IERC20Minimal} from "v4-core/src/interfaces/external/IERC20Minimal.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {Currency} from "v4-core/src/types/Currency.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {SwapParams} from "v4-core/src/types/PoolOperation.sol";
import {TickMath} from "v4-core/src/libraries/TickMath.sol";
import {CapitalWindowHook} from "../src/CapitalWindowHook.sol";
import {CapitalWindowRegistry} from "../src/CapitalWindowRegistry.sol";
import {CapitalWindowRouter} from "../src/CapitalWindowRouter.sol";

/**
 * @dev Executes one approved testnet Capital Window swap after deployment.
 *
 * Required env:
 *   DEPLOYER_PRIVATE_KEY or CAPITAL_WINDOW_INVESTOR_PRIVATE_KEY
 *   CAPITAL_WINDOW_USDC
 *   CAPITAL_WINDOW_LCX
 *   CAPITAL_WINDOW_REGISTRY
 *   CAPITAL_WINDOW_ROUTER
 *   CAPITAL_WINDOW_HOOK
 *   CAPITAL_WINDOW_WINDOW_ID
 *
 * Optional env:
 *   CAPITAL_WINDOW_AUTHORIZER_PRIVATE_KEY
 *   CAPITAL_WINDOW_AMOUNT_IN
 *   CAPITAL_WINDOW_AUTH_NONCE
 *   CAPITAL_WINDOW_AUTH_DEADLINE
 *   CAPITAL_WINDOW_RECIPIENT
 *   CAPITAL_WINDOW_POOL_MANAGER
 */
contract ExecuteCapitalWindowTestnetSwap is Script {
    using MessageHashUtils for bytes32;
    using SafeCast for uint256;

    uint160 private constant MIN_PRICE_LIMIT = TickMath.MIN_SQRT_PRICE + 1;
    uint160 private constant MAX_PRICE_LIMIT = TickMath.MAX_SQRT_PRICE - 1;

    error UnsupportedChain(uint256 chainId);

    function run() external {
        uint256 investorPrivateKey = vm.envOr("CAPITAL_WINDOW_INVESTOR_PRIVATE_KEY", vm.envUint("DEPLOYER_PRIVATE_KEY"));
        uint256 authorizerPrivateKey = vm.envOr("CAPITAL_WINDOW_AUTHORIZER_PRIVATE_KEY", investorPrivateKey);

        address investor = vm.addr(investorPrivateKey);
        address authorizer = vm.addr(authorizerPrivateKey);
        address recipient = vm.envOr("CAPITAL_WINDOW_RECIPIENT", investor);
        address poolManager = vm.envOr("CAPITAL_WINDOW_POOL_MANAGER", _defaultPoolManager(block.chainid));
        address usdc = vm.envAddress("CAPITAL_WINDOW_USDC");
        address lcx = vm.envAddress("CAPITAL_WINDOW_LCX");
        CapitalWindowRegistry registry = CapitalWindowRegistry(vm.envAddress("CAPITAL_WINDOW_REGISTRY"));
        CapitalWindowRouter router = CapitalWindowRouter(vm.envAddress("CAPITAL_WINDOW_ROUTER"));
        address hook = vm.envAddress("CAPITAL_WINDOW_HOOK");
        uint256 windowId = vm.envUint("CAPITAL_WINDOW_WINDOW_ID");
        uint256 amountIn = vm.envOr("CAPITAL_WINDOW_AMOUNT_IN", uint256(1_500e18));
        uint256 nonce = vm.envOr("CAPITAL_WINDOW_AUTH_NONCE", uint256(1));
        uint256 deadline = vm.envOr("CAPITAL_WINDOW_AUTH_DEADLINE", block.timestamp + 1 hours);

        (uint256 quoted, uint256 effectivePrice) = registry.quoteCompanyTokens(windowId, amountIn);
        bytes memory hookData = _hookData(
            registry, address(router), windowId, investor, amountIn, quoted, deadline, nonce, authorizerPrivateKey
        );

        PoolKey memory key = _poolKey(usdc, lcx, hook);
        bool paymentIsCurrency0 = Currency.unwrap(key.currency0) == usdc;
        SwapParams memory params = SwapParams({
            zeroForOne: paymentIsCurrency0,
            amountSpecified: _exactInputAmount(amountIn),
            sqrtPriceLimitX96: paymentIsCurrency0 ? MIN_PRICE_LIMIT : MAX_PRICE_LIMIT
        });

        vm.startBroadcast(investorPrivateKey);
        require(IERC20Minimal(usdc).approve(address(router), amountIn), "USDC approval failed");
        BalanceDelta delta = router.swapExactInput(key, params, amountIn, recipient, hookData);
        vm.stopBroadcast();

        console2.log("Ultramar Port of Call testnet swap");
        console2.log("chain id", block.chainid);
        console2.log("PoolManager", poolManager);
        console2.log("CapitalWindowRegistry", address(registry));
        console2.log("CapitalWindowRouter", address(router));
        console2.log("CapitalWindowHook", hook);
        console2.log("Window id", windowId);
        console2.log("Investor", investor);
        console2.log("Recipient", recipient);
        console2.log("Authorizer", authorizer);
        console2.log("Exact input USDC", amountIn);
        console2.log("Quoted LCX output", quoted);
        console2.log("Effective price", effectivePrice);
        console2.log("Delta amount0");
        console2.logInt(delta.amount0());
        console2.log("Delta amount1");
        console2.logInt(delta.amount1());
        console2.log("Recipient LCX balance", IERC20Minimal(lcx).balanceOf(recipient));
    }

    function _hookData(
        CapitalWindowRegistry registry,
        address router,
        uint256 windowId,
        address investor,
        uint256 amountIn,
        uint256 minCompanyTokens,
        uint256 deadline,
        uint256 nonce,
        uint256 authorizerPrivateKey
    ) internal view returns (bytes memory) {
        bytes32 digest = registry.authorizationDigest(
            windowId, investor, router, amountIn, minCompanyTokens, deadline, nonce
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(authorizerPrivateKey, digest.toEthSignedMessageHash());

        return abi.encode(
            CapitalWindowHook.HookData({
                windowId: windowId,
                investor: investor,
                minCompanyTokens: minCompanyTokens,
                deadline: deadline,
                nonce: nonce,
                signature: abi.encodePacked(r, s, v)
            })
        );
    }

    function _poolKey(address usdc, address lcx, address hook) internal pure returns (PoolKey memory key) {
        Currency paymentCurrency = Currency.wrap(usdc);
        Currency companyCurrency = Currency.wrap(lcx);
        (Currency currency0, Currency currency1) =
            usdc < lcx ? (paymentCurrency, companyCurrency) : (companyCurrency, paymentCurrency);

        key = PoolKey({currency0: currency0, currency1: currency1, fee: 3000, tickSpacing: 60, hooks: IHooks(hook)});
    }

    function _exactInputAmount(uint256 amountIn) internal pure returns (int256) {
        return -amountIn.toInt256();
    }

    function _defaultPoolManager(uint256 chainId) internal pure returns (address) {
        if (chainId == 11155111) return 0xE03A1074c86CFeDd5C142C4F04F1a1536e203543; // Sepolia
        if (chainId == 84532) return 0x05E73354cFDd6745C338b50BcFDfA3Aa6fA03408; // Base Sepolia
        if (chainId == 1301) return 0x00B036B58a818B1BC34d502D3fE730Db729e62AC; // Unichain Sepolia
        if (chainId == 421614) return 0xFB3e0C6F74eB1a21CC1Da29aeC80D2Dfe6C9a317; // Arbitrum Sepolia
        revert UnsupportedChain(chainId);
    }
}
