# Incident Playbook

Owner: **[TBD — assign before go-live]**

## Severity Levels

| Level | Definition | Response time | Example |
|---|---|---|---|
| **SEV-1** | Capital at risk, uncontrolled execution, key compromise | Immediate (< 5 min) | Duplicate live orders, key leak |
| **SEV-2** | Degraded execution, reconciliation failure, stale data | < 30 min | Reconciliation backlog > SLA, worker crash loop |
| **SEV-3** | Non-critical anomaly, monitoring gap | < 4 hours | Parity mismatch spike, elevated latency |

## Trigger -> Action Map

### SEV-1: Kill-Switch Conditions

| Trigger | Detection | Immediate Action |
|---|---|---|
| Daily loss limit exceeded | Risk check in executor blocks trades; kill-switch fires | 1. Set `POLYMARKET_EXECUTION_MODE=paper`. 2. Restart executor. 3. Open incident channel. |
| Reconciliation backlog > threshold | `python -m backend.execution.kill_switch` returns triggered | 1. Executor auto-halts. 2. Investigate reconciliation worker logs. 3. Check Polymarket API status. |
| Duplicate/unexpected live submissions | Order intent idempotency constraint + executor dedup logging | 1. Set mode to `paper`. 2. Cancel all open orders via SDK. 3. Run intent report. |
| Key compromise suspected | External signal or unexpected API key creation events | 1. Execute emergency revoke (see RUNBOOK_KEY_ROTATION.md). 2. Set mode to `paper`. 3. Transfer funds. |
| Unhandled exception loop in workers | Scheduler error logs, health endpoint returns `degraded` | 1. Stop scheduler. 2. Check logs for root cause. 3. Fix and redeploy. |

### SEV-2: Degraded Operation

| Trigger | Detection | Action |
|---|---|---|
| Reconciliation backlog growing | Intent report shows increasing active count | 1. Check Polymarket user stream connectivity. 2. Check REST fallback. 3. Consider manual reconciliation. |
| Worker crash loop | Repeated exceptions in scheduler log | 1. Identify crashing worker. 2. Run worker standalone for stack trace. 3. Fix and redeploy. |
| Stale market data | Ingest worker logs show errors or stale timestamps | 1. Check Polymarket API and WebSocket status. 2. Verify fallback mode. 3. Halt executor if data is unreliable. |

### SEV-3: Monitoring

| Trigger | Detection | Action |
|---|---|---|
| Parity mismatch spike | Dual-run compare logs | 1. Review SDK vs legacy divergence. 2. No execution impact unless sustained. |
| Elevated latency | Slow ingest or execution cycles | 1. Check API rate limits. 2. Review system resources. |

## Incident Response Steps

1. **Detect** — Automated (kill-switch, health endpoint) or manual (log review, alert).
2. **Contain** — Set execution mode to `paper`. Stop scheduler if needed.
3. **Assess** — Run diagnostics:
   ```bash
   # Health check
   curl http://localhost:8000/health | jq .

   # Intent backlog
   python -m backend.execution.intent_report

   # Kill-switch status
   python -m backend.execution.kill_switch
   ```
4. **Fix** — Address root cause. Deploy fix.
5. **Verify** — Run health checks, confirm zero SLA breaches, confirm intent report clean.
6. **Restore** — Re-enable `live_shadow` first, then `live` after observation period.
7. **Review** — Postmortem within 48 hours. Document in incident log.

## Escalation Chain

| Role | Responsibility | Contact |
|---|---|---|
| Technical owner | First responder, triage, containment | [TBD] |
| Trading/risk owner | Capital decisions, ramp adjustments | [TBD] |
| Security owner | Key compromise, access control incidents | [TBD] |

## Post-Incident

- [ ] Incident timeline documented.
- [ ] Root cause identified.
- [ ] Fix deployed and verified.
- [ ] Kill-switch conditions updated if needed.
- [ ] Postmortem shared with all owners.
- [ ] `live` mode not re-enabled until all owners sign off.
