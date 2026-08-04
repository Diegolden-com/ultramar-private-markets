# Ultramar Supabase activation

This directory owns the LCX secondary-transfer data-room schema. It is intentionally not
linked to the existing `LCX-operator-app` project, which contains laundromat
operations data and is a separate trust boundary.

## Local validation

1. Start Docker.
2. Run `supabase start` from `apps/ultramar`. This project uses the isolated
   `5572x` port range so it can coexist with other local Supabase projects.
   The local API, database, Studio, and Mailpit endpoints are respectively
   `55721`, `55722`, `55723`, and `55724`.
3. Confirm the schema with `supabase migration list --local`. A first local
   start applies migrations and the idempotent seed. Do not run `db reset` on
   an environment containing local review evidence; use `supabase stop` (never
   `--no-backup`) followed by `supabase start` to reload local configuration.
4. Copy `.env.example` to an untracked `.env.local`, then obtain the local URL
   and keys with `supabase status -o env`. Do not paste values into committed
   files. Set `NEXT_PUBLIC_SITE_URL` to the actual local preview origin (for
   example `http://127.0.0.1:3101`); the matching callback URLs are allowlisted
   in `config.toml`.
5. Run `supabase test db` for the role/RLS/Storage matrix and `supabase db lint
   --local --level warning` for schema lint.

Run the Playwright/Axe audit with `yarn test:e2e`. Playwright loads
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

The private bucket is created by the migration. Published files remain private.
For document delivery, the application first authorizes the caller with the
user SSR client and RLS, then uses the server-only admin client to write the
required audit event and return a signed URL that expires after 60 seconds. If
the privileged client or audit write is unavailable, no document URL is
returned.
