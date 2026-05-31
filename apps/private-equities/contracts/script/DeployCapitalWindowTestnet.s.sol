// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {MessageHashUtils} from "openzeppelin-contracts/contracts/utils/cryptography/MessageHashUtils.sol";
import {SafeCast} from "openzeppelin-contracts/contracts/utils/math/SafeCast.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {Currency} from "v4-core/src/types/Currency.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {SwapParams} from "v4-core/src/types/PoolOperation.sol";
import {TickMath} from "v4-core/src/libraries/TickMath.sol";
import {AssetToken} from "../src/AssetToken.sol";
import {CapitalWindowHook} from "../src/CapitalWindowHook.sol";
import {CapitalWindowRegistry} from "../src/CapitalWindowRegistry.sol";
import {CapitalWindowRouter} from "../src/CapitalWindowRouter.sol";
import {SolvencyRegistry} from "../src/SolvencyRegistry.sol";
import {MockUSDC} from "../test/Mocks.sol";

/**
 * @dev Broadcast script for an optional public-testnet Hookathon deployment.
 *
 * This is intentionally separate from `CapitalWindowDemo.s.sol`: the local demo
 * uses `vm.etch`, while a real v4 hook must be deployed to an address whose
 * low bits encode the callback permissions.
 *
 * Example:
 *   DEPLOYER_PRIVATE_KEY=... BASE_SEPOLIA_RPC_URL=... \
 *   forge script script/DeployCapitalWindowTestnet.s.sol:DeployCapitalWindowTestnet \
 *     --rpc-url base_sepolia --broadcast -vv
 */
contract DeployCapitalWindowTestnet is Script {
    using MessageHashUtils for bytes32;
    using Hooks for IHooks;
    using SafeCast for uint256;

    address private constant CREATE2_DEPLOYER = 0x4e59b44847b379578588920cA78FbF26c0B4956C;
    uint160 private constant HOOK_MASK = uint160((1 << 14) - 1);
    uint160 private constant CAPITAL_WINDOW_FLAGS = uint160(
        Hooks.BEFORE_ADD_LIQUIDITY_FLAG | Hooks.BEFORE_REMOVE_LIQUIDITY_FLAG | Hooks.BEFORE_SWAP_FLAG
            | Hooks.BEFORE_SWAP_RETURNS_DELTA_FLAG
    );
    uint160 private constant SQRT_PRICE_1_1 = 79228162514264337593543950336;
    uint160 private constant MIN_PRICE_LIMIT = TickMath.MIN_SQRT_PRICE + 1;
    uint160 private constant MAX_PRICE_LIMIT = TickMath.MAX_SQRT_PRICE - 1;

    error UnsupportedChain(uint256 chainId);
    error HookSaltNotFound(uint256 attempts);
    error HookAddressMismatch(address expected, address actual);
    error SmokeSwapRequiresDeployerInvestor(address admin, address demoInvestor);

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        uint256 authorizerPrivateKey = vm.envOr("CAPITAL_WINDOW_AUTHORIZER_PRIVATE_KEY", deployerPrivateKey);
        address admin = vm.addr(deployerPrivateKey);
        address poolManagerAddress = vm.envOr("CAPITAL_WINDOW_POOL_MANAGER", _defaultPoolManager(block.chainid));
        address treasury = vm.envOr("CAPITAL_WINDOW_TREASURY", admin);
        address issuer = vm.envOr("CAPITAL_WINDOW_ISSUER", admin);
        address authorizer = vm.envOr("CAPITAL_WINDOW_AUTHORIZER", vm.addr(authorizerPrivateKey));
        address demoInvestor = vm.envOr("CAPITAL_WINDOW_DEMO_INVESTOR", admin);
        bool runSmokeSwap = vm.envOr("CAPITAL_WINDOW_RUN_SMOKE_SWAP", false);

        IPoolManager manager = IPoolManager(poolManagerAddress);

        vm.startBroadcast(deployerPrivateKey);

        MockUSDC usdc = new MockUSDC();
        AssetToken companyToken = new AssetToken("Lavanderias CX", "LCX", admin, address(usdc));
        SolvencyRegistry solvency = new SolvencyRegistry(admin);
        CapitalWindowRegistry registry = new CapitalWindowRegistry(admin, solvency);
        CapitalWindowRouter router = new CapitalWindowRouter(manager);

        bytes memory constructorArgs = abi.encode(manager, registry);
        (address expectedHook, bytes32 salt) = _mineHookAddress(
            abi.encodePacked(type(CapitalWindowHook).creationCode, constructorArgs), CAPITAL_WINDOW_FLAGS
        );

        CapitalWindowHook hook = new CapitalWindowHook{salt: salt}(manager, registry);
        if (address(hook) != expectedHook) revert HookAddressMismatch(expectedHook, address(hook));

        IHooks(address(hook)).validateHookPermissions(_capitalWindowPermissions());
        registry.grantRole(registry.HOOK_ROLE(), address(hook));
        if (authorizer != admin) {
            registry.grantRole(registry.AUTHORIZER_ROLE(), authorizer);
        }

        companyToken.updateWhitelist(address(hook), true);
        companyToken.updateWhitelist(poolManagerAddress, true);
        companyToken.updateWhitelist(demoInvestor, true);

        companyToken.mint(admin, 2_000_000e18);
        require(companyToken.transfer(address(hook), 1_500_000e18), "hook inventory transfer failed");
        usdc.mint(demoInvestor, 100_000e18);
        if (demoInvestor == admin) {
            usdc.approve(address(router), type(uint256).max);
        }

        solvency.publishSolvency(issuer, 150, 250, block.timestamp);

        Currency paymentCurrency = Currency.wrap(address(usdc));
        Currency companyCurrency = Currency.wrap(address(companyToken));
        (Currency currency0, Currency currency1) = Currency.unwrap(paymentCurrency) < Currency.unwrap(companyCurrency)
            ? (paymentCurrency, companyCurrency)
            : (companyCurrency, paymentCurrency);

        PoolKey memory key = PoolKey({
            currency0: currency0, currency1: currency1, fee: 3000, tickSpacing: 60, hooks: IHooks(address(hook))
        });
        manager.initialize(key, SQRT_PRICE_1_1);

        uint256 windowId = registry.createWindow(
            CapitalWindowRegistry.WindowConfig({
                mode: CapitalWindowRegistry.WindowMode.PrimaryConversion,
                paymentToken: address(usdc),
                companyToken: address(companyToken),
                cashRecipient: treasury,
                oracleSubject: issuer,
                startTime: uint64(block.timestamp),
                endTime: uint64(block.timestamp + 7 days),
                totalCap: 20_000e18,
                perInvestorCap: 5_000e18,
                minTicket: 1e18,
                maxTicket: 5_000e18,
                basePrice: 1e18,
                stepSize: 1_000e18,
                stepPriceBps: 1_000,
                oracleFreshness: 1 days,
                minSolvencyRatio: 100,
                minLiquidityRatio: 100,
                active: true
            })
        );
        registry.setInvestorLimit(windowId, demoInvestor, true, 5_000e18);

        if (runSmokeSwap) {
            if (demoInvestor != admin) revert SmokeSwapRequiresDeployerInvestor(admin, demoInvestor);
            _runSmokeSwap(
                registry, router, key, address(usdc), address(companyToken), windowId, admin, authorizerPrivateKey
            );
        }

        vm.stopBroadcast();

        console2.log("Ultramar Port of Call testnet deployment");
        console2.log("chain id", block.chainid);
        console2.log("admin", admin);
        console2.log("PoolManager", poolManagerAddress);
        console2.log("Mock USDC", address(usdc));
        console2.log("LCX token", address(companyToken));
        console2.log("SolvencyRegistry", address(solvency));
        console2.log("CapitalWindowRegistry", address(registry));
        console2.log("CapitalWindowRouter", address(router));
        console2.log("CapitalWindowHook", address(hook));
        console2.log("Window id", windowId);
        console2.log("Demo investor", demoInvestor);
        console2.log("Hook salt:");
        console2.logBytes32(salt);
        if (runSmokeSwap) {
            console2.log("Smoke swap: approved exact-input swap executed in this simulation/broadcast");
            console2.log("Demo investor LCX balance", companyToken.balanceOf(demoInvestor));
            console2.log("Treasury USDC balance", usdc.balanceOf(treasury));
        }
        if (demoInvestor != admin) {
            console2.log("Demo investor must approve CapitalWindowRouter before swapping.");
        }
    }

    function _runSmokeSwap(
        CapitalWindowRegistry registry,
        CapitalWindowRouter router,
        PoolKey memory key,
        address usdc,
        address lcx,
        uint256 windowId,
        address investor,
        uint256 authorizerPrivateKey
    ) internal {
        uint256 amountIn = 1_500e18;
        (uint256 quoted, uint256 effectivePrice) = registry.quoteCompanyTokens(windowId, amountIn);
        bytes memory hookData =
            _hookData(registry, address(router), windowId, investor, amountIn, quoted, 1, authorizerPrivateKey);
        bool paymentIsCurrency0 = Currency.unwrap(key.currency0) == usdc;

        BalanceDelta delta = router.swapExactInput(
            key,
            SwapParams({
                zeroForOne: paymentIsCurrency0,
                amountSpecified: -amountIn.toInt256(),
                sqrtPriceLimitX96: paymentIsCurrency0 ? MIN_PRICE_LIMIT : MAX_PRICE_LIMIT
            }),
            amountIn,
            investor,
            hookData
        );

        console2.log("Smoke swap exact input USDC", amountIn);
        console2.log("Smoke swap quoted LCX output", quoted);
        console2.log("Smoke swap effective price", effectivePrice);
        console2.log("Smoke swap delta amount0");
        console2.logInt(delta.amount0());
        console2.log("Smoke swap delta amount1");
        console2.logInt(delta.amount1());
        console2.log("Smoke swap LCX token", lcx);
    }

    function _hookData(
        CapitalWindowRegistry registry,
        address router,
        uint256 windowId,
        address investor,
        uint256 amountIn,
        uint256 minCompanyTokens,
        uint256 nonce,
        uint256 authorizerPrivateKey
    ) internal view returns (bytes memory) {
        uint256 deadline = block.timestamp + 1 hours;
        bytes32 digest =
            registry.authorizationDigest(windowId, investor, router, amountIn, minCompanyTokens, deadline, nonce);
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

    function _mineHookAddress(bytes memory bytecode, uint160 flags)
        internal
        pure
        returns (address hookAddress, bytes32 salt)
    {
        bytes32 bytecodeHash = keccak256(bytecode);
        uint256 maxAttempts = 1_000_000;

        for (uint256 i = 0; i < maxAttempts; i++) {
            salt = bytes32(i);
            hookAddress = _computeCreate2Address(CREATE2_DEPLOYER, salt, bytecodeHash);
            if (uint160(hookAddress) & HOOK_MASK == flags) {
                return (hookAddress, salt);
            }
        }

        revert HookSaltNotFound(maxAttempts);
    }

    function _computeCreate2Address(address deployer, bytes32 salt, bytes32 bytecodeHash)
        internal
        pure
        returns (address)
    {
        bytes32 digest = keccak256(abi.encodePacked(bytes1(0xff), deployer, salt, bytecodeHash));
        return address(uint160(uint256(digest)));
    }

    function _defaultPoolManager(uint256 chainId) internal pure returns (address) {
        if (chainId == 11155111) return 0xE03A1074c86CFeDd5C142C4F04F1a1536e203543; // Sepolia
        if (chainId == 84532) return 0x05E73354cFDd6745C338b50BcFDfA3Aa6fA03408; // Base Sepolia
        if (chainId == 1301) return 0x00B036B58a818B1BC34d502D3fE730Db729e62AC; // Unichain Sepolia
        if (chainId == 421614) return 0xFB3e0C6F74eB1a21CC1Da29aeC80D2Dfe6C9a317; // Arbitrum Sepolia
        revert UnsupportedChain(chainId);
    }

    function _capitalWindowPermissions() internal pure returns (Hooks.Permissions memory) {
        return Hooks.Permissions({
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
        });
    }
}
