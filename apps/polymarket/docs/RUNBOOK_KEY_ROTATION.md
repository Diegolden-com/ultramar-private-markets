# Key Rotation and Revocation Runbook

Owner: **[TBD — assign before go-live]**

## Secrets Inventory

| Secret | Env Var | Storage | Rotation cadence |
|---|---|---|---|
| Trading private key | `POLYMARKET_PRIVATE_KEY` | Secret manager (never `.env` in prod) | On compromise or quarterly |
| L2 API key | `POLYMARKET_API_KEY` | Secret manager | On compromise or quarterly |
| L2 API secret | `POLYMARKET_API_SECRET` | Secret manager | With API key |
| L2 API passphrase | `POLYMARKET_API_PASSPHRASE` | Secret manager | With API key |
| Database URL | `DATABASE_URL` | Secret manager | On compromise |

## Pre-Rotation Checklist

1. Confirm no active live orders are in `pending` or `prepared` state.
   ```bash
   python -m backend.execution.intent_report
   ```
2. Set execution mode to `paper` to halt new order submissions.
3. Wait for current reconciliation cycle to complete.

## Rotation: Private Key (`POLYMARKET_PRIVATE_KEY`)

1. Generate new key in a secure environment (hardware wallet or airgapped machine).
2. Fund the new wallet address on Polygon with enough MATIC for gas.
3. Transfer USDC allowance to the new address on Polymarket contracts.
4. Update `POLYMARKET_PRIVATE_KEY` in the secret manager.
5. Restart executor and reconciliation workers.
6. Run startup health check to verify L2 bootstrap:
   ```bash
   curl http://localhost:8000/health | jq .
   ```
7. Confirm `execution_gateway` check is `ok` before re-enabling `live_shadow` or `live`.

## Rotation: L2 API Credentials

1. Derive or create new API keys via `py-clob-client`:
   ```python
   from py_clob_client.client import ClobClient
   client = ClobClient(host="https://clob.polymarket.com", chain_id=137, key=PRIVATE_KEY)
   new_creds = client.create_api_key()
   ```
2. Update `POLYMARKET_API_KEY`, `POLYMARKET_API_SECRET`, `POLYMARKET_API_PASSPHRASE` in secret manager.
3. Restart workers.
4. Verify via startup health check.

## Emergency Revocation

**Target: complete within 5 minutes of compromise detection.**

1. **Immediately** set `POLYMARKET_EXECUTION_MODE=paper` and restart executor.
2. Cancel all open orders on Polymarket via the SDK:
   ```python
   client.cancel_all()
   ```
3. Revoke L2 API keys:
   ```python
   client.delete_api_key()
   ```
4. If private key is compromised, transfer remaining funds from the wallet to a secure address.
5. Open incident channel — see `RUNBOOK_INCIDENTS.md`.
6. Do not re-enable `live` until new keys are provisioned and verified.

## Access Controls

| Action | Who can perform | Approval required |
|---|---|---|
| Change `POLYMARKET_EXECUTION_MODE` to `live` | Technical owner | Trading owner sign-off |
| Raise `MAX_CAPITAL_USD` | Technical owner | Trading + risk owner sign-off |
| Rotate private key | Technical owner | Security owner notification |
| Emergency revoke | Any team member | Post-hoc review within 24h |
