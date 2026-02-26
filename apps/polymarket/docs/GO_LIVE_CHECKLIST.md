# Polymarket Go-Live Checklist

This checklist is the launch control sheet for running real capital on the Polymarket strategy stack.

## How To Use

- Treat each phase as a hard gate.
- Do not start the next phase until all required items in the current phase are done.
- Every item must include owner + evidence (PR, dashboard screenshot, run log, or incident doc).

## Prefill Snapshot (2026-02-26)

- Snapshot commit: `386b430`
- Interpretation:
  - `[x]` implemented in code/docs in this repo.
  - `[ ]` not yet validated in operations/staging/prod, or not done.

## Launch Policy

- Capital safety > uptime > feature velocity.
- If any kill-switch condition triggers, stop execution first, then investigate.
- `POLYMARKET_EXECUTION_MODE` progression must be: `paper` -> `live_shadow` -> `live`.

## Phase 0: Environment and Build Readiness

- [x] Production/staging env vars are complete and documented.
- [x] Alembic migration check enforced in CI (`alembic check` catches model/migration drift).
- [x] Startup health checks verify DB is at expected Alembic head (`0002_order_intents`).
- [x] CI green on `main` for backend lint + tests (`polymarket-ci.yml`: ruff + pytest + alembic check).
- [ ] Alembic migrations applied in target environments (`alembic upgrade head`).
- [ ] Reconciliation worker is enabled and running in staging.
- [x] Runtime can execute all worker entrypoints (`ingest`, `signals`, `executor`, `reconcile`) without crashes.

Gate output:
- [ ] Sign-off: infra ready for shadow trading.

## Phase 1: Security and Key Management

- [ ] Trading private key stored in a secret manager (not `.env` checked into git).
- [ ] Least-privilege API keys for exchange and telemetry services.
- [x] Live-mode preflight guards block test/example keys and require L2 creds (`factory.py`).
- [x] Rotation runbook exists for `POLYMARKET_PRIVATE_KEY` and API creds (`docs/RUNBOOK_KEY_ROTATION.md`).
- [x] Emergency revoke procedure documented with 5-minute target (`RUNBOOK_KEY_ROTATION.md`).
- [ ] Emergency revoke procedure tested and timed in staging.
- [x] Access controls documented — who can change execution mode and raise capital (`RUNBOOK_KEY_ROTATION.md`).

Gate output:
- [ ] Sign-off: key custody and secret hygiene approved (requires secret manager setup + revoke test).

## Phase 2: Strategy and Data Validation (No Live Orders)

- [ ] `paper` mode run for at least 7 days continuously.
- [ ] `live_shadow` run for at least 7 days continuously.
- [ ] Snapshot parity thresholds defined and met (SDK vs fallback feeds).
- [ ] Reconciliation closes all `prepared/pending` intents within target SLA.
- [ ] Backtest/replay assumptions documented versus live observations (fees, slippage, latency).
- [x] Risk limits verified in runtime config (`MAX_*`, `DAILY_LOSS_LIMIT_USD`, etc).

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

- [x] Daily loss limit exceeded.
- [ ] Reconciliation backlog exceeds threshold (count or age).
- [x] Duplicate/unexpected live submissions detected.
- [ ] Unhandled exception loop in executor/reconcile workers.
- [ ] Key compromise suspected.

Action on trigger:
- [x] Switch execution mode to `paper` (or stop executor job) immediately.
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
- [x] BLOCKED (reasons documented)

## Sign-Off

- Technical owner:
- Trading/risk owner:
- Security owner:
- Date: 2026-02-26 (prefill snapshot)
- Evidence links:
  - `9011a47` SDK-first market data gateway
  - `ff689ed` trading gateway contract + SDK adapter
  - `71a790f` execution mode factory (`paper`, `live_shadow`, `live`)
  - `fe457f5` L2 bootstrap + startup health checks
  - `8b21261` order intents/state events + idempotency persistence
  - `59d8b4b` reconciliation worker (user stream + REST fallback)
