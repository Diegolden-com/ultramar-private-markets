# Hookathon demo run-of-show: Ultramar Port of Call

Use this as the recording and live-demo checklist. The goal is to make the product memorable first, then prove the hook is real.

## Setup

Terminal 1:

```bash
corepack yarn workspace @ultramar/ultramar dev
```

Browser:

```text
http://localhost:3000/hookathon/port-of-call
```

Terminal 2:

```bash
corepack yarn hookathon:check
```

Clean terminal proof for video:

```bash
corepack yarn hookathon:video:proof
```

If time is short, run only:

```bash
cd apps/private-equities/contracts
forge script script/CapitalWindowDemo.s.sol:CapitalWindowDemo -vv
```

## Captioned review cut

| Time | Screen | Say | Must show |
| --- | --- | --- | --- |
| 0:00-0:09 | Hero | "Private-market capital breaks before settlement: language, diligence, eligibility, legal limits, allocation, and reporting live in different systems." | `Port of Call` hero and sandbox/non-offer badge |
| 0:09-0:18 | Travel feed | "This is Ablo for capital. The investor travels to Mexico City and enters Lavanderias CX before any transaction exists." | Mexico City / Lavanderias CX port |
| 0:18-0:28 | Passport + quote | "Diligence and eligibility produce a signed passport: window id, investor, minimum output, deadline, nonce, and signature." | Passport checks and `1,454.54 LCX` expected output |
| 0:28-0:38 | Scenario simulator, Approved | "Approved exact-input flow settles through `CapitalWindowRouter`; v4 custom accounting returns LCX from an asset-class-specific capital-window curve." | Approved state and `testPrimaryConversionWindowExecutesCustomAccountingSwap` |
| 0:38-0:47 | Scenario simulator, Generic router | "A valid passport cannot ride the wrong route. The digest binds the passport to `CapitalWindowRouter`, so generic v4 routing reverts." | Generic router state and `InvalidAuthorization` |
| 0:47-0:55 | Scenario simulator, Replay | "The same passport cannot settle twice; nonce consumption makes replay an explicit failure." | Replay state and consumed nonce failure |
| 0:55-1:05 | Specialized Markets | "The hook turns eligibility, timing, caps, transfer boundaries, oracle freshness, and router provenance into market rules." | Specialized Markets claim |
| 1:05-1:13 | Pricing proof | "Most active windows should be fixed. The step curve is only for signed tranche logic; `testWindowStepCurveQuotesExactPricingExample` proves the `1,500 USDC -> 1,454.54 LCX` quote at `1.0312` effective." | Deck pricing graph and exact pricing test name |
| 1:13-1:21 | Deck close | "Uniswap v4 can host private-market investment ports without pretending they are public AMMs." | Pitch deck closing line |
| 1:21-1:36 | Terminal | "The local demo proves one settlement and six blocked paths. The hook is not decoration; it is the market boundary." | `Demo complete: one approved settlement, six blocked paths.` |

## Terminal markers

The terminal demo should contain these exact markers:

```text
APPROVED window 1
  exact input USDC 1500.00
  quoted LCX output 1454.54
  effective price USDC/LCX 1.0312
MISSING PASSPORT window 2
  blocked: hookData passport is required
GENERIC ROUTER window 3
  blocked: passport is bound to CapitalWindowRouter
EXPIRED AUTHORIZATION window 4
  blocked: signed passport deadline expired
MIN OUTPUT window 5
  blocked: signed minimum output exceeds quote
REPLAY window 6
  blocked: authorization nonce was already consumed
STALE ORACLE window 7
  blocked: issuer proof is stale
Demo complete: one approved settlement, six blocked paths.
```

## Five-minute judge walkthrough

1. Open `/hookathon/port-of-call`.
2. Show the travel feed and say the transaction is intentionally not first.
3. Show the passport checklist and quote.
4. Click `Approved`, `Generic router`, `Replay`, and `Stale oracle` in the scenario simulator.
5. Run `corepack yarn hookathon:check`.
6. Point judges to:
   - `testHookAddressEncodesOnlyCapitalWindowPermissions`
   - `testAuthorizationDigestBindsPassportToCapitalRouter`
   - `testPrimaryConversionWindowExecutesCustomAccountingSwap`
   - `testGenericRouterWithCapitalPassportReverts`
   - `testExpiredAuthorizationReverts`
   - `testMinimumOutputSlippageReverts`
   - `testAuthorizationReplayReverts`
   - `testStaleOracleReverts`

## Objection responses

**"Is this just a permissioned pool?"**

No. The hook replaces AMM price discovery with a windowed custom-accounting curve and rejects generic routing, missing passports, stale issuer proofs, expired signatures, replayed signatures, minimum-output failures, exact-output swaps, and public LP changes.

**"How does this fit Yield-Protected AMM?"**

The protected side is the liquidity/inventory side. Public LP deposits are blocked, issuer or escrow inventory is consumed only inside signed and capped windows, and the hook prevents stale issuer proofs or generic routers from turning private-market inventory into toxic public AMM exposure.

**"How does this fit Specialized Markets?"**

Private operating-business capital is not a generic continuous AMM market. Eligibility, timing, ticket size, caps, transfer policy, issuer proof freshness, and router provenance are part of the market structure, and the hook enforces them at settlement.

**"Why not just build escrow?"**

Escrow can hold funds, but it does not give a standard v4 settlement surface, `PoolManager`, flash accounting, hook permissions, or composable specialized-market rails.

**"Is this compliance?"**

No. It is compliance-aware infrastructure. The demo is sandbox/testnet and non-offer. Counsel, custody, transfer controls, audit, and jurisdiction review remain production gates.

## Fallbacks

- If the recording process gets messy, use `docs/HOOKATHON_VIDEO_RECORDING_KIT.md` as the capture checklist.
- If the browser demo fails, use `HOOKATHON_README.md` and the terminal script as the primary proof.
- If the terminal is too noisy, zoom into the `== Logs ==` section and the seven window markers.
- If a judge asks where v4 appears, show `CapitalWindowHook.beforeSwap`, `beforeSwapReturnDelta`, and the `PoolManager` route through `CapitalWindowRouter`.
