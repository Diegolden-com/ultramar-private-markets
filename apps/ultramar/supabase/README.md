# Ultramar Supabase activation

This directory owns the LCX secondary-transfer data-room schema. It is intentionally not
linked to the existing `LCX-operator-app` project, which contains laundromat
operations data and is a separate trust boundary.

## Local validation

Run the complete local QA transaction from the repository root:

```bash
corepack yarn test:qa:ultramar:local
```

It starts Docker Desktop when needed, starts this project's isolated `5572x`
Supabase stack, exports its loopback credentials, runs schema lint,
database/RLS tests, and Playwright, then always stops the stack. The cleanup
runs on success, failure, `Ctrl-C`, and `TERM`; it preserves local Supabase
data and deliberately leaves Docker Desktop running rather than guessing which
process started it.

The transaction also disables Docker's `unless-stopped` restart policy on its
own QA containers as soon as it creates them. If a power loss or `SIGKILL`
prevents the shell trap from running, those abandoned containers will remain
off rather than waking up on the next Docker Desktop launch.

If the scoped teardown cannot complete, the QA command fails rather than
reporting a passing suite with incomplete cleanup.

The command refuses to reuse an existing `ultramar` stack, including stopped
or partial containers. That is intentional: remove a stack you started
yourself before running QA, rather than letting QA take ownership of it
implicitly. It never uses
`supabase stop --all` or `--no-backup`.

For interactive development, start Docker and run `supabase start` from
`apps/ultramar` yourself. This project uses the isolated `5572x` port range so
it can coexist with other local Supabase projects. The local API, database,
Studio, and Mailpit endpoints are respectively `55721`, `55722`, `55723`, and
`55724`. Confirm the schema with `supabase migration list --local`. A first
local start applies migrations and the idempotent seed. Do not run `db reset`
on an environment containing local review evidence; use `supabase stop` (never
`--no-backup`) followed by `supabase start` to reload local configuration.

Copy `.env.example` to an untracked `.env.local`, then obtain the local URL and
keys with `supabase status -o env`. Do not paste values into committed files.
Set `NEXT_PUBLIC_SITE_URL` to the actual local preview origin (for example
`http://127.0.0.1:3101`); the matching callback URLs are allowlisted in
`config.toml`.

`yarn test:e2e` is the lower-level browser command for an explicitly managed
environment. Playwright loads
`apps/ultramar/.env.local` in addition to the process environment and requires
`NEXT_PUBLIC_SUPABASE_URL` (or `SUPABASE_URL`) plus `SUPABASE_SECRET_KEY`; the
legacy `SUPABASE_SERVICE_ROLE_KEY` fallback is accepted only for loopback local
stacks. Its setup reprovisions the issuer and investor fixtures on every run,
using `LCX_E2E_PASSWORD` or the local-only default `Test-password-2026!`, and
teardown removes only the E2E database rows, Storage objects, and Auth users.
Non-loopback Supabase hosts are rejected unless `LCX_E2E_ALLOW_REMOTE=true`;
remote runs also require an explicit `SUPABASE_SECRET_KEY` and
`LCX_E2E_PASSWORD`.

## Hosted activation

1. Create or select the dedicated Ultramar project, then link it with
   `supabase link --project-ref <ref>`.
2. Review migration status with `supabase migration list` and apply the schema
   plus the idempotent LCX catalog bootstrap with
   `supabase db push --include-seed`.
3. Configure `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`, and a
   dedicated `SUPABASE_SECRET_KEY` (`sb_secret_...`) in Vercel. The secret is
   server-only: never give it a `NEXT_PUBLIC_` prefix. A legacy
   `SUPABASE_SERVICE_ROLE_KEY` is accepted only as a transition fallback.
4. Add the production callback pattern
   `https://ultramar.capital/auth/confirm**` to Auth redirect URLs. The suffix
   admits the callback's validated `next` query parameter without opening the
   rest of the site. For local email flows, allow the same callback pattern on
   both `localhost` and `127.0.0.1` on port 3000; the local `config.toml` also
   includes both hosts on Playwright's port 3100. Add separately scoped preview
   URL patterns only for preview environments that need email authentication.
5. Configure confirm-signup and recovery email templates to target
   `/auth/confirm` with `token_hash`, `type`, and a safe relative `next` path.
6. After the first trusted operator signs up, assign the initial role in the
   SQL editor: `update public.profiles set role = 'admin' where id = '<uuid>';`.
   Issuer operators also need the LCX issuer ID and role `issuer`.

## LCX diligence-release preflight

The LCX secondary-transfer room starts in `internal_preparation`. This is a
separate global release decision for LCX only: it is never inferred from a
round status, and it does not make a live offer. While closed, managers can
prepare internal drafts and controls, but investors cannot request access,
receive an access grant, or view a document.

Before an active platform administrator opens diligence, complete this
preflight in the dedicated Ultramar project:

1. Confirm Vercel has the hosted activation variables above:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
   `NEXT_PUBLIC_SITE_URL`, and server-only `SUPABASE_SECRET_KEY`. Do not use
   the LCX-operator-app project or place a secret in a `NEXT_PUBLIC_` variable.
2. Obtain the current approved PWA publication reference without copying its
   financial content: finance contract version `3`, scenario
   `consolidated-secondary`, opaque PWA approval-attestation UUID, PWA source
   ID, source/manifest SHA-256, rendered snapshot/payload SHA-256,
   `modelAsOf` as a `YYYY-MM-DD` calendar cut, and a future
   `freshnessDueAt` timestamp. The model cut must be no more than 31 calendar
   days old; the deadline must be in the future and no more than 31 days from
   both the model cut and the current time. The Ultramar release manifest stores only these
   references and static attestations; it contains no price, valuation,
   allocation, ownership percentage, subscription, or document payload.
3. Name four distinct, active LCX data-room managers for Finance Ops,
   redaction, counsel, and data-room administration. A person cannot occupy
   more than one role. The assigned person must record their own attestation.
4. In the manager console, create the manifest, collect all four attestations,
   verify it is `ready` and fresh, then have an active platform administrator
   select **Open LCX diligence**. Closing diligence is an immediate
   administrative control and disables investor requests, grants, and content
   visibility again.
5. Run the release checks before any hosted opening:

   ```sh
   cd apps/ultramar
   supabase migration list
   supabase db lint --local --level warning --fail-on warning
   supabase test db --local
   cd ../..
   yarn workspace @ultramar/ultramar lint
   yarn workspace @ultramar/ultramar typecheck
   yarn workspace @ultramar/ultramar test:e2e
   ```

6. With hosted environment variables configured and the state still closed,
   smoke the public LCX page. It must show **NOT A LIVE OFFER** and
   **Diligence not open** rather than an investor-access action. Confirm that
   the same `/private-equities/assets/lcx/dataroom` route shows a closed
   diligence state to a signed-out browser. Only after the preflight is fully
   complete should the administrator open the release gate.

The private bucket is created by the migration. Published files remain private.
For document delivery, the application first authorizes the caller with the
user SSR client and RLS, rechecks the exact version with
`can_view_data_room_document_version`, then fetches and streams it through the
application from the server-only admin client. It never returns a reusable
Storage signed URL. Closing LCX diligence therefore blocks every subsequent
open/download request immediately (including a refresh or a newly opened
browser tab). Bytes already delivered to a browser or saved locally cannot be
recalled; the control is prospective. If the privileged client or audit write
is unavailable, no document response is returned.
