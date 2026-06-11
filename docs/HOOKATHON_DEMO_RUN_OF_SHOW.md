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
| 0:00-0:08 | Hero | "Private-market capital breaks before settlement: language, diligence, eligibility, legal limits, allocation, and reporting live in different systems." | `Port of Call` hero and sandbox/non-offer badge |
| 0:08-0:16 | Market readiness | "The Walmart lesson becomes an operating-company question: what changed inside LCX that makes equity or debt investible?" | `The market pays for administration that can absorb capital.` |
| 0:16-0:25 | Operating readiness map | "Admin work becomes underwriting evidence: daily close, margin route, current asset coverage, and reporting freshness become route-specific claims." | `Admin work becomes underwriting evidence.`, `Debt preview`, `Hook access` |
| 0:25-0:35 | Scenario simulator, Approved equity | "Why this click matters: omnichannel operations are credible enough to open primary equity, then the hook settles signed window terms." | Approved state, `Why this click matters`, and `testPrimaryConversionWindowExecutesCustomAccountingSwap` |
| 0:35-0:45 | Scenario simulator, Debt stale | "A green ratio from stale books is not credit risk proof; stale covenant data closes the debt route before settlement." | `Debt covenant preview`, stale coverage, and access blocked |
| 0:45-0:53 | Scenario simulator, Generic router | "A valid passport cannot ride the wrong route. The digest binds the passport to `CapitalWindowRouter`, so generic v4 routing reverts." | Generic router state and `InvalidAuthorization` |
| 0:53-1:01 | Pricing policy | "Most active windows should be fixed. If the issuer cannot explain the tranche logic, the curve should not exist." | Fixed baseline, step curve, and curve decision rule |
| 1:01-1:09 | Specialized Markets | "The hook turns eligibility, timing, caps, transfer boundaries, oracle freshness, and router provenance into market rules." | Specialized Markets claim |
| 1:09-1:17 | Deck capital routes | "A port can open equity, debt, secondary transfer, or conversion routes while the hook stays the market boundary." | Equity, debt, secondary transfer, conversion route cards |
| 1:17-1:25 | Pricing proof | "`testWindowStepCurveQuotesExactPricingExample` proves the `1,500 USDC -> 1,454.54 LCX` quote at `1.0312` effective." | Deck pricing graph and exact pricing test name |
| 1:25-1:33 | Deck close | "Uniswap v4 can host private-market investment ports without pretending they are public AMMs." | Pitch deck closing line |
| 1:33-1:46 | Terminal | "The local demo proves one settlement and six blocked paths. The hook is not decoration; it is the market boundary." | `Demo complete: one approved settlement, six blocked paths.` |

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
2. Show market readiness and say the transaction is intentionally not first.
3. Show the operating readiness map: admin work, margin route, current asset coverage, reporting freshness.
4. Click `Approved`, `Debt covenant preview` + `Stale oracle`, and `Generic router` in the scenario simulator.
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

**"Why show the debt route if the onchain settlement demo is equity?"**

Because the product is an investment port, not a single equity buy button. Equity proves signed custom-accounting settlement. Debt proves the same data layer can gate creditor access with covenant logic; a green ratio from stale books is not credit risk proof.

**"Why not just build escrow?"**

Escrow can hold funds, but it does not give a standard v4 settlement surface, `PoolManager`, flash accounting, hook permissions, or composable specialized-market rails.

**"Is this compliance?"**

No. It is compliance-aware infrastructure. The demo is sandbox/testnet and non-offer. Counsel, custody, transfer controls, audit, and jurisdiction review remain production gates.

## Fallbacks

- If the recording process gets messy, use `docs/HOOKATHON_VIDEO_RECORDING_KIT.md` as the capture checklist.
- If the browser demo fails, use `HOOKATHON_README.md` and the terminal script as the primary proof.
- If the terminal is too noisy, zoom into the `== Logs ==` section and the seven window markers.
- If a judge asks where v4 appears, show `CapitalWindowHook.beforeSwap`, `beforeSwapReturnDelta`, and the `PoolManager` route through `CapitalWindowRouter`.
