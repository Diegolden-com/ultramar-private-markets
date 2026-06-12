# Hookathon testnet deployment runbook

Purpose: make the optional public-testnet path executable without weakening the local demo. The local proof remains `CapitalWindowDemo.s.sol`; this runbook is only for a broadcast deployment when the Hookathon rules or judges want public explorer links.

## Recommended chain

Use **Base Sepolia** first. It is a public testnet with official Uniswap v4 deployments and a familiar explorer.

Fallbacks:

- Sepolia
- Unichain Sepolia
- Arbitrum Sepolia

The deployment script reads the official `PoolManager` address from `block.chainid` for those networks, with `CAPITAL_WINDOW_POOL_MANAGER` available as an explicit override.

## Official v4 addresses checked

As of May 31, 2026, the Uniswap deployments page lists:

| Network | Chain id | PoolManager |
| --- | ---: | --- |
| Sepolia | 11155111 | `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543` |
| Base Sepolia | 84532 | `0x05E73354cFDd6745C338b50BcFDfA3Aa6fA03408` |
| Unichain Sepolia | 1301 | `0x00B036B58a818B1BC34d502D3fE730Db729e62AC` |
| Arbitrum Sepolia | 421614 | `0xFB3e0C6F74eB1a21CC1Da29aeC80D2Dfe6C9a317` |

Source: https://developers.uniswap.org/docs/protocols/v4/deployments

## Why this differs from the local demo

The local demo uses `vm.etch` to put the hook bytecode at `0x...0A88`, which is perfect for deterministic tests.

A real v4 hook cannot do that. Uniswap v4 reads callback permissions from the hook address bits, so the broadcast script mines a CREATE2 salt and deploys `CapitalWindowHook` to an address ending in the required permission mask:

- `beforeAddLiquidity`
- `beforeRemoveLiquidity`
- `beforeSwap`
- `beforeSwapReturnDelta`

Source: https://developers.uniswap.org/docs/protocols/v4/guides/hooks/hook-deployment

## Environment

From `apps/private-equities/contracts`:

```bash
export DEPLOYER_PRIVATE_KEY=...
export BASE_SEPOLIA_RPC_URL=...
```

Optional:

```bash
export CAPITAL_WINDOW_TREASURY=0x...
export CAPITAL_WINDOW_ISSUER=0x...
export CAPITAL_WINDOW_AUTHORIZER=0x...
export CAPITAL_WINDOW_DEMO_INVESTOR=0x...
export CAPITAL_WINDOW_POOL_MANAGER=0x...
```

If `CAPITAL_WINDOW_DEMO_INVESTOR` is omitted, the deployer is the demo investor and the script approves `CapitalWindowRouter` for the mock USDC. If it is set to another wallet, that wallet must approve the router before a live testnet swap.

## Dry run

Deployment-only simulation:

```bash
cd apps/private-equities/contracts
forge script script/DeployCapitalWindowTestnet.s.sol:DeployCapitalWindowTestnet \
  --rpc-url base_sepolia \
  -vv
```

End-to-end deployment plus approved smoke swap simulation:

```bash
corepack yarn hookathon:testnet:e2e
```

Compact proof artifact for judges:

```bash
corepack yarn hookathon:testnet:proof
```

This writes `artifacts/hookathon/testnet-dry-run-latest.md` and validates the official Base Sepolia `PoolManager`, hook permission mask, window id, smoke-swap quote, effective price, deltas, and absence of broadcast markers.

Published proof report:

```text
https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/testnet-dry-run-latest.md
```

The equivalent contracts-workspace command is:

```bash
cd apps/private-equities/contracts
DEPLOYER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
CAPITAL_WINDOW_RUN_SMOKE_SWAP=true \
forge script script/DeployCapitalWindowTestnet.s.sol:DeployCapitalWindowTestnet \
  --rpc-url https://sepolia.base.org \
  -vv
```

Verified locally on May 31, 2026 against Base Sepolia RPC without `--broadcast`. The simulation mined and deployed a hook address ending in the required `0xa88` permission mask:

```text
CapitalWindowHook 0xf4e79FfC08cf1c4325DDCD1d1f38e10E37900a88
Window id 1
SIMULATION COMPLETE
```

The end-to-end simulation also executed one approved exact-input swap through the official Base Sepolia `PoolManager`:

```text
Smoke swap exact input USDC 1500000000000000000000
Smoke swap quoted LCX output 1454545454545454545454
Smoke swap effective price 1031250000000000000
Smoke swap delta amount0 -1500000000000000000000
Smoke swap delta amount1 1454545454545454545454
Smoke swap: approved exact-input swap executed in this simulation/broadcast
```

That output is dry-run evidence only; it is not an explorer-verifiable deployment.

## Broadcast

```bash
cd apps/private-equities/contracts
forge script script/DeployCapitalWindowTestnet.s.sol:DeployCapitalWindowTestnet \
  --rpc-url base_sepolia \
  --broadcast \
  -vv
```

To include the smoke swap in the same broadcast, add `CAPITAL_WINDOW_RUN_SMOKE_SWAP=true`. For final submission evidence, a separate swap broadcast with `ExecuteCapitalWindowTestnetSwap` is easier to explain because it gives judges a distinct execution transaction after deployment.

The script deploys:

- mock USDC
- LCX restricted `AssetToken`
- `SolvencyRegistry`
- `CapitalWindowRegistry`
- `CapitalWindowRouter`
- mined-address `CapitalWindowHook`
- initialized mock USDC / restricted LCX sandbox v4 pool
- one primary conversion window
- one eligible demo investor limit

## Execute one approved swap

After broadcast, export the addresses printed by the deployment script:

```bash
export CAPITAL_WINDOW_USDC=0x...
export CAPITAL_WINDOW_LCX=0x...
export CAPITAL_WINDOW_REGISTRY=0x...
export CAPITAL_WINDOW_ROUTER=0x...
export CAPITAL_WINDOW_HOOK=0x...
export CAPITAL_WINDOW_WINDOW_ID=1
```

Then execute one approved exact-input swap:

```bash
cd apps/private-equities/contracts
forge script script/ExecuteCapitalWindowTestnetSwap.s.sol:ExecuteCapitalWindowTestnetSwap \
  --rpc-url base_sepolia \
  --broadcast \
  -vv
```

Defaults:

- investor private key: `CAPITAL_WINDOW_INVESTOR_PRIVATE_KEY`, or `DEPLOYER_PRIVATE_KEY` if omitted
- authorizer private key: `CAPITAL_WINDOW_AUTHORIZER_PRIVATE_KEY`, or the investor key if omitted
- amount in: `1500e18` mock USDC
- nonce: `1`
- recipient: investor wallet

If you already used nonce `1` in the same window, set a new `CAPITAL_WINDOW_AUTH_NONCE` before executing again.

## Submission evidence to capture

After broadcast, save these from the script output:

- `Mock USDC`
- `restricted LCX sandbox AssetToken`
- `SolvencyRegistry`
- `CapitalWindowRegistry`
- `CapitalWindowRouter`
- `CapitalWindowHook`
- `Window id`
- `Hook salt`
- approved swap transaction hash from `ExecuteCapitalWindowTestnetSwap`

Add the explorer links to `docs/HOOKATHON_SUBMISSION_FORM.md` before sending the final form.

## Guardrails

- Keep the submission language as sandbox/testnet and non-offer.
- Do not use real USDC or real investor funds.
- Do not imply LCX is publicly available.
- If deployment fails because the official v4 addresses changed, re-check the Uniswap deployments page and set `CAPITAL_WINDOW_POOL_MANAGER` explicitly.
