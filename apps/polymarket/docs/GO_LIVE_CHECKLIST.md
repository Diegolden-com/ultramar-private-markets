# Polymarket Go-Live Checklist

This checklist is the launch control sheet for running real capital on the Polymarket strategy stack.

## How To Use

- Treat each phase as a hard gate.
- Do not start the next phase until all required items in the current phase are done.
- Every item must include owner + evidence (PR, dashboard screenshot, run log, or incident doc).

## Prefill Snapshot (2026-02-26)

- Original snapshot commit: `386b430`
- Go-live staging run: `c904b56`..`ba7e140` (stages A-E)
- Interpretation:
  - `[x]` implemented in code/docs in this repo with passing tests.
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
- [x] Reconciliation SLA threshold configurable (`POLYMARKET_RECONCILE_SLA_SECONDS=300`).
- [x] Deterministic intent backlog report available (`python -m backend.execution.intent_report`).
- [x] Reconciliation returns backlog age metrics (`remaining_active`, `max_age_seconds`).
- [ ] Reconciliation closes all `prepared/pending` intents within target SLA (verify in staging).
- [ ] Backtest/replay assumptions documented versus live observations (fees, slippage, latency).
- [x] Risk limits verified in runtime config (`MAX_*`, `DAILY_LOSS_LIMIT_USD`, etc).

Gate output:
- [ ] Sign-off: expected edge still exists after realistic frictions.

## Phase 3: Operational Controls and SRE Baseline

- [ ] Dashboards exist for PnL, active intents, unresolved intents age, fill rates, worker health.
- [ ] Alerting exists for: worker crash loops, reconciliation backlog, stale pending orders, drawdown breaches.
- [x] Kill-switch implemented: executor auto-halts on backlog count/age breach (`kill_switch.py`).
- [x] Kill-switch CLI: `python -m backend.execution.kill_switch` for manual checks.
- [x] Kill-switch config: `POLYMARKET_KILL_SWITCH_MAX_BACKLOG=50`, `POLYMARKET_KILL_SWITCH_MAX_AGE_SECONDS=600`.
- [ ] Kill-switch tested end-to-end in staging.
- [x] Incident runbook with severity levels, trigger->action map, escalation chain (`docs/RUNBOOK_INCIDENTS.md`).
- [ ] Daily operational review cadence defined (owner + schedule).

Gate output:
- [ ] Sign-off: system is operable under incident conditions (requires dashboard + alert setup + staging test).

## Phase 4: Live Canary (Tiny Capital)

- [x] Canary profile defined: `max_capital=500`, `max_position=100`, `daily_loss=50` (`canary.py`).
- [x] Profile validation: `validate_settings_against_profile("canary", ...)` enforces caps.
- [ ] Enable `live` with canary profile caps applied.
- [ ] Canary duration target: minimum 7 days (`hold_days=7` in profile).
- [ ] Manual review of every order intent/state event during canary.
- [ ] Zero unresolved intents older than SLA during canary.
- [ ] No critical incidents (key leak, uncontrolled order spam, stale position risk).

Gate output:
- [ ] Sign-off: canary exits cleanly with expected risk behavior.

## Phase 5: Capital Ramp Ladder

- [x] Predefined ladder documented: canary -> 2x -> 5x -> 10x (`canary.py` RAMP_LADDER).
- [x] Advancement criteria are objective per step (PnL stability, drawdown bounds, reconciliation health).
- [x] Rollback criteria are objective and immediate per step.
- [x] Each step includes a hold period (7-14 days) and post-step review.
- [x] Max capital hard cap is version-controlled in `canary.py` (requires PR to change).
- [x] Runtime validation: `validate_settings_against_profile()` catches config exceeding profile caps.
- [x] CLI: `python -m backend.execution.canary` prints full ramp ladder for audit.

Gate output:
- [ ] Sign-off: controlled scaling process is active (requires canary completion first).

## Kill Switch Conditions (Immediate Stop)

- [x] Daily loss limit exceeded (risk check + kill-switch guard).
- [x] Reconciliation backlog exceeds threshold (count or age) — auto-halt in executor.
- [x] Duplicate/unexpected live submissions detected (idempotency constraint).
- [x] Unhandled exception loop — scheduler catches + logs; incident runbook covers response.
- [x] Key compromise — emergency revoke procedure in `RUNBOOK_KEY_ROTATION.md`.

Action on trigger:
- [x] Switch execution mode to `paper` (or stop executor job) immediately.
- [x] Open incident channel and preserve logs/state (documented in `RUNBOOK_INCIDENTS.md`).
- [x] Run postmortem before re-enabling `live` (documented in `RUNBOOK_INCIDENTS.md`).

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
  - `c904b56` Stage A: CI + migration checks + startup health migration verification
  - `7e899b1` Stage B: live preflight guards + key rotation runbook
  - `953d036` Stage C: intent backlog report + SLA metrics + reconciliation age tracking
  - `6636f50` Stage D: kill-switch + incident playbook
  - `ba7e140` Stage E: canary profiles + ramp ladder + profile validation
