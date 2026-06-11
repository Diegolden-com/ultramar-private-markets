# Hookathon Atrium alignment: Ultramar Port of Call

Purpose: map the logged-in Atrium Learn course outline and public Uniswap v4 material to the exact repo evidence in the Hookathon package.

This is an internal judge-prep document. The public submission should cite the public Atrium course page and Uniswap docs/whitepaper, while this file preserves the working alignment from the Safari session.

## Course-to-demo map

| Atrium module | What the course is pushing toward | Ultramar Port of Call evidence |
| --- | --- | --- |
| Course Introduction | A capstone-worthy v4 hook should be understandable, memorable, and investor-presentable. | The use case is "Abloh for capital": local-business discovery, translated diligence, passport stamp, and a capital window. See `docs/HOOKATHON_USECASE_ULTRAMAR_PORT_OF_CALL.md` and `/hookathon/port-of-call`. |
| Intro to v4 | Use v4 as the settlement substrate, not as a logo. | `CapitalWindowRouter` routes through `PoolManager`; `CapitalWindowHook` is installed as the pool hook; the docs explain singleton settlement and flash-accounting deltas. |
| Uniswap Math | Know which price mechanism the hook is changing. | The demo intentionally replaces public AMM price discovery with a deterministic capital-window conversion curve. The approved demo settles `1500.00` USDC into `1454.54` LCX at `1.0312` USDC/LCX. |
| Dynamic Fees | Dynamic fees are useful when fees are the product lever; they are not mandatory. | This demo does not use dynamic fees. That restraint matters: the permission bitmap only includes `beforeSwap`, `beforeSwapReturnDelta`, `beforeAddLiquidity`, and `beforeRemoveLiquidity`. |
| Liquidity Operators | Hooks can control who supplies/removes liquidity and under what conditions. | Public LP behavior is blocked. Issuer/escrow inventory is consumed through controlled equity windows and future debt/secondary routes instead of passive public LP deposits. |
| Return Delta Hooks | Return deltas and custom accounting are the strongest technical signal. | `beforeSwapReturnDelta` is the core mechanism: it consumes exact input, credits controlled output, and returns a custom accounting delta for the capital-window curve. |
| Periphery: Swap & Bridge | A real hook needs a believable periphery path. | `CapitalWindowRouter` is the periphery adapter. It packages exact-input settlement, `hookData`, and the v4 `unlock` flow. Bridging is deliberately outside the demo scope. |
| Uniswap v4 Routers | Router assumptions are part of hook security. | The passport digest is bound to `CapitalWindowRouter`; `testGenericRouterWithCapitalPassportReverts` proves a generic router cannot reuse a valid passport. |
| Hook Security | Show adversarial thinking, not only the happy path. | The suite covers hook permission bits, missing passport, invalid signature, expired authorization, replay, stale oracle, min-output slippage, exact-output rejection, generic-router rejection, cap enforcement, and public LP blocking. |
| Capstone | Package the idea so judges can run it and remember it. | `HOOKATHON_README.md`, `docs/HOOKATHON_SUBMISSION_PACKET.md`, `docs/HOOKATHON_TALLY_FINAL_PACKET.md`, `docs/HOOKATHON_SUBMIT_NOW.md`, `docs/HOOKATHON_WINNING_SCORECARD.md`, and `docs/HOOKATHON_DEMO_RUN_OF_SHOW.md` give the story, commands, final Tally path, rubric proof, and recording path. |

## Design conclusion

The strongest Hookathon angle is not "private equity on Uniswap." It is:

> A travel-like investor experience where a v4 return-delta hook turns eligibility, diligence, oracle freshness, caps, and settlement into one auditable market boundary.

That maps cleanly to the course arc:

1. v4 architecture gives the settlement surface.
2. return deltas let the hook own the execution curve.
3. router/periphery design makes the product path real.
4. hook security makes the demo defensible.
5. the Abloh-like product metaphor makes the capstone memorable.

## What to emphasize in the video

- Start with the product metaphor first: "travel to a capital port."
- Move quickly to the v4 boundary: "the passport becomes `hookData`."
- Show one approved exact-input swap.
- Show one blocked generic-router or replay attempt.
- Close on the phrase: "The hook is the market boundary."

## What not to overclaim

- Do not claim LCX is publicly investable.
- Do not claim the hook creates legal compliance by itself.
- Do not imply dynamic fees, bridge logic, or production custody are already built.
- Do not frame this as a normal AMM with a permission list.

## Source basis

- Safari Atrium Learn session opened on the logged-in course outline: `https://learn.atrium.academy/course/9a4ba933-4bee-42fe-871c-6c28b5ca9ffd/intro`
- Public Atrium Uniswap course page: https://atrium.academy/uniswap/course
- Uniswap v4 whitepaper: https://app.uniswap.org/whitepaper-v4.pdf
- Uniswap v4 architecture docs: https://developers.uniswap.org/docs/protocols/v4/concepts/architecture
- Uniswap v4 custom accounting docs: https://developers.uniswap.org/docs/protocols/v4/guides/custom-accounting
