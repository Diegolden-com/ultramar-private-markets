# Polymarket Go-Live Checklist

This checklist is the launch control sheet for running real capital on the Polymarket strategy stack.

## How To Use

- Treat each phase as a hard gate.
- Do not start the next phase until all required items in the current phase are done.
- Every item must include owner + evidence (PR, dashboard screenshot, run log, or incident doc).

## Launch Policy

- Capital safety > uptime > feature velocity.
- If any kill-switch condition triggers, stop execution first, then investigate.
- `POLYMARKET_EXECUTION_MODE` progression must be: `paper` -> `live_shadow` -> `live`.

## Phase 0: Environment and Build Readiness

- [ ] Production/staging env vars are complete and documented.
- [ ] Alembic migrations applied in target environments (`alembic upgrade head`).
- [ ] CI green on `main` for backend lint + tests.
- [ ] Reconciliation worker is enabled and running in staging.
- [ ] Runtime can execute all worker entrypoints (`ingest`, `signals`, `executor`, `reconcile`) without crashes.

Gate output:
- [ ] Sign-off: infra ready for shadow trading.

## Phase 1: Security and Key Management

- [ ] Trading private key stored in a secret manager (not `.env` checked into git).
- [ ] Least-privilege API keys for exchange and telemetry services.
- [ ] Rotation runbook exists for `POLYMARKET_PRIVATE_KEY` and API creds.
- [ ] Emergency revoke procedure tested and timed.
- [ ] Access controls in place for who can change execution mode and max capital.

Gate output:
- [ ] Sign-off: key custody and secret hygiene approved.

## Phase 2: Strategy and Data Validation (No Live Orders)

- [ ] `paper` mode run for at least 7 days continuously.
- [ ] `live_shadow` run for at least 7 days continuously.
- [ ] Snapshot parity thresholds defined and met (SDK vs fallback feeds).
- [ ] Reconciliation closes all `prepared/pending` intents within target SLA.
- [ ] Backtest/replay assumptions documented versus live observations (fees, slippage, latency).
- [ ] Risk limits verified in runtime config (`MAX_*`, `DAILY_LOSS_LIMIT_USD`, etc).

Gate output:
- [ ] Sign-off: expected edge still exists after realistic frictions.

## Phase 3: Operational Controls and SRE Baseline

- [ ] Dashboards exist for PnL, active intents, unresolved intents age, fill rates, worker health.
- [ ] Alerting exists for: worker crash loops, reconciliation backlog, stale pending orders, drawdown breaches.
- [ ] Kill-switch tested end-to-end (set mode to `paper` or stop executor path immediately).
- [ ] Incident runbook exists with severity levels and escalation chain.
- [ ] Daily operational review cadence defined (owner + schedule).

Gate output:
- [ ] Sign-off: system is operable under incident conditions.

## Phase 4: Live Canary (Tiny Capital)

- [ ] Enable `live` with strict caps:
- [ ] `MAX_CAPITAL_USD` <= canary budget.
- [ ] `MAX_POSITION_USD` and `MIN_TRADE_USD` tuned for low blast radius.
- [ ] Canary duration target (minimum 3-7 days) set before start.
- [ ] Manual review of every order intent/state event during canary.
- [ ] Zero unresolved intents older than SLA during canary.
- [ ] No critical incidents (key leak, uncontrolled order spam, stale position risk).

Gate output:
- [ ] Sign-off: canary exits cleanly with expected risk behavior.

## Phase 5: Capital Ramp Ladder

- [ ] Predefined ladder documented (example: 1x -> 2x -> 5x -> 10x).
- [ ] Advancement condition is objective (PnL stability, drawdown bounds, reconciliation health).
- [ ] Rollback condition is objective and immediate.
- [ ] Each ladder step includes a hold period and post-step review.
- [ ] Max capital hard cap is version-controlled and requires approval to raise.

Gate output:
- [ ] Sign-off: controlled scaling process is active.

## Kill Switch Conditions (Immediate Stop)

- [ ] Daily loss limit exceeded.
- [ ] Reconciliation backlog exceeds threshold (count or age).
- [ ] Duplicate/unexpected live submissions detected.
- [ ] Unhandled exception loop in executor/reconcile workers.
- [ ] Key compromise suspected.

Action on trigger:
- [ ] Switch execution mode to `paper` (or stop executor job) immediately.
- [ ] Open incident channel and preserve logs/state.
- [ ] Run postmortem before re-enabling `live`.

## Readiness Scorecard

- [ ] Phase 0 complete
- [ ] Phase 1 complete
- [ ] Phase 2 complete
- [ ] Phase 3 complete
- [ ] Phase 4 complete
- [ ] Phase 5 complete

Final decision:
- [ ] APPROVED FOR LIVE CAPITAL
- [ ] BLOCKED (reasons documented)

## Sign-Off

- Technical owner:
- Trading/risk owner:
- Security owner:
- Date:
- Evidence links:
