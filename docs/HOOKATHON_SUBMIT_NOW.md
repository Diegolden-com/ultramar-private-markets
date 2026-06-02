# Hookathon submit-now checklist

Purpose: the shortest safe path from the ready package to the official Tally submit, without committing private submitter data.

## Current state

The package is ready for final submitter inputs. Do not mark the thread goal complete until Tally accepts the submission and the private receipt is recorded.

Public packet to keep open:

- Tally form: https://tally.so/r/VLV1pa
- Project demo: https://ultramar.capital/hookathon/port-of-call
- Pitch deck: https://ultramar.capital/hookathon/port-of-call/deck
- Demo video: https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/final-demo-latest.webm
- Base Sepolia proof: https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/testnet-dry-run-latest.md
- Source branch: https://github.com/Diegolden-com/ultramar-private-markets/tree/codex/landing-wave-route-ui

## 1. Fill private inputs

Edit the ignored private env file:

```text
artifacts/hookathon/final-submit.env
```

Required:

```text
HOOKATHON_SUBMITTER_EMAIL=
HOOKATHON_WORKED_WITH_TEAM=
HOOKATHON_COURSE_RATING=
```

If `HOOKATHON_WORKED_WITH_TEAM=Yes`, also fill:

```text
HOOKATHON_TEAM_DETAILS=
```

## 2. Run strict operator

```bash
corepack yarn hookathon:submission:operator --strict
```

Do not submit until `artifacts/hookathon/final-submit-run-latest.md` says:

```text
Ready for Tally submit: yes
Local failures: 0
Session submit-ready: yes
```

## 3. Copy/paste into Tally

Open the generated local copy aid:

```text
artifacts/hookathon/tally-browser-session-latest.html
```

Open Tally:

```text
https://tally.so/r/VLV1pa
```

Copy fields in order. Do not press Submit if any placeholder remains.

## 4. Record receipt

After Tally confirms the submission, capture the confirmation page or email, then run:

```bash
HOOKATHON_TALLY_SUBMITTED_AT="REPLACE_WITH_ISO_TIMESTAMP_FROM_CONFIRMATION" \
HOOKATHON_TALLY_CONFIRMATION="REPLACE_WITH_TALLY_CONFIRMATION_TEXT_OR_ID" \
HOOKATHON_TALLY_EVIDENCE="REPLACE_WITH_SCREENSHOT_OR_EMAIL_REFERENCE" \
corepack yarn hookathon:submission:receipt
```

## 5. Final readiness check

```bash
corepack yarn hookathon:readiness
```

Completion evidence is valid only when the readiness report shows a real Tally receipt.
