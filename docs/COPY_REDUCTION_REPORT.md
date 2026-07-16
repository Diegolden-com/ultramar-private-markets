# Visible Copy Reduction Report

## Result

The marketing and product target decreased from **9,854** to **1,927** visible words: **80.44% reduction**.

Legal and compliance routes are excluded from the 80% target, as allowed by the brief. They remain unchanged at 578 words. Across every observed route including those exclusions, the count decreased from 10,432 to 2,505 words (75.99%).

- Base: `main@b9b810b`
- Branch: `codex/copy-reduction`
- Baseline: [COPY_BASELINE.json](./COPY_BASELINE.json)
- Final: [COPY_AFTER.json](./COPY_AFTER.json)
- Measurement script: [measure-visible-copy.mjs](../scripts/measure-visible-copy.mjs)

## Reproduction

1. Start the canonical app with `yarn dev:ultramar`.
2. Run `node scripts/measure-visible-copy.mjs /tmp/copy-report.json`.
3. If Playwright browsers are stored outside the version expected by the package, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to the installed Chromium binary.

Both captures used Chromium at **1440×900** against `http://localhost:3000`. The script loads the XML sitemap, adds public auxiliary routes and the controlled portfolio, and visits all dynamic asset, research, and press URLs exposed by the sitemap.

The counter includes rendered text nodes inside `main`. It excludes repeated `header`, `footer`, and semantic `nav` content; scripts and styles; `aria-hidden` content; hidden or zero-opacity nodes; and nodes without a rendered box. The same Unicode word tokenizer and route set were used before and after. Nothing is hidden for the purpose of reduction.

† Excluded only from the 80% calculation: `/legal`, `/compliance`, and `/private-equities/legal`.

## Route table

| Route | Before | After | Reduction | In target |
| --- | ---: | ---: | ---: | :---: |
| `/` | 586 | 31 | 94.7% | Yes |
| `/research` | 221 | 55 | 75.1% | Yes |
| `/press` | 475 | 66 | 86.1% | Yes |
| `/compliance` | 252 | 252 | 0.0% | No † |
| `/legal` | 168 | 168 | 0.0% | No † |
| `/sitemap` | 234 | 21 | 91.0% | Yes |
| `/private-equities` | 579 | 78 | 86.5% | Yes |
| `/arbitrage-hedge-fund` | 539 | 82 | 84.8% | Yes |
| `/private-equities/assets` | 541 | 158 | 70.8% | Yes |
| `/private-equities/deals` | 139 | 54 | 61.2% | Yes |
| `/private-equities/oracle` | 65 | 20 | 69.2% | Yes |
| `/private-equities/market` | 90 | 46 | 48.9% | Yes |
| `/private-equities/legal` | 158 | 158 | 0.0% | No † |
| `/private-equities/assets/lcx` | 190 | 126 | 33.7% | Yes |
| `/private-equities/assets/NXS.LOG` | 137 | 95 | 30.7% | Yes |
| `/private-equities/assets/VRX.RE` | 138 | 97 | 29.7% | Yes |
| `/private-equities/assets/AGR.YLD` | 133 | 91 | 31.6% | Yes |
| `/arbitrage-hedge-fund/dashboard` | 414 | 105 | 74.6% | Yes |
| `/arbitrage-hedge-fund/signals` | 211 | 93 | 55.9% | Yes |
| `/arbitrage-hedge-fund/risk` | 278 | 91 | 67.3% | Yes |
| `/arbitrage-hedge-fund/research` | 84 | 27 | 67.9% | Yes |
| `/research/polymarket-arbitrage-explainer` | 311 | 40 | 87.1% | Yes |
| `/research/tokenized-private-equity-primer` | 319 | 39 | 87.8% | Yes |
| `/research/issuer-oracle-operating-data` | 310 | 34 | 89.0% | Yes |
| `/research/event-market-risk-controls` | 268 | 38 | 85.8% | Yes |
| `/press/capital-windows-uniswap-v4-custom-accounting` | 1,003 | 56 | 94.4% | Yes |
| `/press/why-capital-markets-need-onchain-instruments-now` | 462 | 47 | 89.8% | Yes |
| `/press/private-secondaries-need-transparent-rails` | 410 | 38 | 90.7% | Yes |
| `/press/ai-compliance-is-the-disclosure-layer-for-tokenized-equity` | 437 | 43 | 90.2% | Yes |
| `/press/retail-access-to-private-companies-should-not-wait-for-ipo` | 423 | 44 | 89.6% | Yes |
| `/api` | 179 | 34 | 81.0% | Yes |
| `/system-status` | 119 | 28 | 76.5% | Yes |
| `/auth/login` | 79 | 11 | 86.1% | Yes |
| `/auth/sign-up` | 76 | 12 | 84.2% | Yes |
| `/auth/sign-up-success` | 72 | 19 | 73.6% | Yes |
| `/auth/forgot-password` | 74 | 11 | 85.1% | Yes |
| `/auth/update-password` | 76 | 12 | 84.2% | Yes |
| `/auth/error` | 76 | 23 | 69.7% | Yes |
| `/private-equities/portfolio` | 106 | 62 | 41.5% | Yes |

| **Target total** | **9,854** | **1,927** | **80.44%** | **Yes** |
| **All observed routes** | **10,432** | **2,505** | **75.99%** | — |

## Visual QA

The following routes were rendered and captured at 1440×900 and 390×844: `/`, `/private-equities`, `/private-equities/assets`, `/private-equities/assets/lcx`, `/arbitrage-hedge-fund`, `/arbitrage-hedge-fund/dashboard`, `/arbitrage-hedge-fund/signals`, `/arbitrage-hedge-fund/risk`, `/research`, `/press`, `/auth/login`, and `/sitemap`.

All 24 checks returned HTTP 200, contained `main` and `h1`, produced no browser console/page errors, and had no body-level horizontal overflow. Manual contact-sheet review confirmed that headings, metrics, filters, tables, CTA, product tabs, desktop navigation, mobile menu, and mobile quick actions remain legible.
