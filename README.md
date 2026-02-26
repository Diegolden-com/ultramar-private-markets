# Project Ultramar Monorepo Runbook

Canonical handoff for consolidating and upgrading this codebase.

## Current Status (updated: 2026-02-26)

Phase 1, 2 and 3 are complete.

### Phase 1: Workspace Consolidation (complete)

- Root git repo initialized at `project-ultramar/.git`
- Apps moved under `apps/`
  - `apps/capital`
  - `apps/polymarket`
  - `apps/private-equities`
- Root Yarn workspaces configured
  - `package.json` with `workspaces: ["apps/*", "packages/*"]`
  - `.yarnrc.yml` with `nodeLinker: node-modules`
  - root `yarn.lock` generated
- Workspace package names normalized
  - `@ultramar/capital`
  - `@ultramar/polymarket`
  - `@ultramar/private-equities`
- Nested per-app git metadata and legacy lockfiles removed from active tree

### Phase 2: Script + CI Normalization (complete)

- Replaced active `npm run` references with `yarn` in:
  - `apps/polymarket/package.json` (qa scripts)
  - `apps/polymarket/playwright.config.ts` (webServer command)
  - `apps/polymarket/lefthook.yml` (pre-push commands)
- Consolidated GitHub workflows to root `.github/workflows/`:
  - `claude.yml`
  - `claude-code-review.yml`
  - `polymarket-ci.yml`
  - `polymarket-cd.yml`
- Added root matrix workflow for missing app coverage:
  - `apps-ci.yml` (capital + private-equities, path-gated)
  - runs lint + build for each app workspace
  - lint is blocking in CI (warnings allowed, errors fail)
- Old per-app `.github/` directories moved to `.migration-trash/`

### Phase 3: Next.js Upgrade + Version Pinning (complete)

- All apps pinned to `next@16.1.6`
- `eslint-config-next` pinned to `16.1.6` in polymarket and private-equities
- Added ESLint setup for capital:
  - `eslint` + `eslint-config-next` in `apps/capital/package.json`
  - `apps/capital/eslint.config.mjs`
- Removed deprecated `eslint` key from `apps/capital/next.config.mjs`
- Upgraded polymarket ESLint config to native flat config
- Replaced remaining floating dependencies in app manifests:
  - `@supabase/ssr` -> `0.8.0`
  - `@supabase/supabase-js` -> `2.97.0`
  - `@vercel/analytics` -> `1.6.1`
  - `recharts` -> `3.7.0`
- Resolved `react-hooks/set-state-in-effect` in hydration theme components:
  - `apps/polymarket/components/theme-switcher.tsx`
  - `apps/private-equities/components/theme-provider.tsx`
  - `apps/capital/components/theme-provider.tsx`

Build validation (all on Next.js 16.1.6 with Turbopack):

- `yarn workspace @ultramar/capital build` — PASS (18 routes)
- `yarn workspace @ultramar/polymarket build` — PASS (15 routes)
- `yarn workspace @ultramar/private-equities build` — PASS (19 routes)

Lint validation:

- `yarn workspace @ultramar/polymarket lint` — PASS
- `yarn workspace @ultramar/capital lint` — PASS (0 errors, 0 warnings)
- `yarn workspace @ultramar/private-equities lint` — PASS (0 errors, 0 warnings)

## Important Migration Artifact

Direct deletion commands were blocked by environment policy, so old metadata was moved (not deleted) to:

- `.migration-trash/capital.git`
- `.migration-trash/polymarket.git`
- `.migration-trash/private-equities.git`
- `.migration-trash/capital-pnpm-lock.yaml`
- `.migration-trash/polymarket-package-lock.json`
- `.migration-trash/private-equities-bun.lock`
- `.migration-trash/capital-github` (old per-app workflows)
- `.migration-trash/polymarket-github` (old per-app workflows)

If rollback/history extraction is needed, use those folders/files.

## Repository Layout

```text
project-ultramar/
  .github/
    workflows/
      claude.yml
      claude-code-review.yml
      polymarket-ci.yml
      polymarket-cd.yml
      apps-ci.yml
  apps/
    capital/          (Next.js 16.1.6)
    polymarket/       (Next.js 16.1.6)
    private-equities/ (Next.js 16.1.6)
  packages/
  package.json
  yarn.lock
  .yarnrc.yml
  .gitignore
  README.md
```

## Remaining Risks / Open Issues

### Lint Status

- `@ultramar/capital`: clean lint baseline (`0 errors / 0 warnings`)
- `@ultramar/private-equities`: clean lint baseline (`0 errors / 0 warnings`)
- `react/no-unescaped-entities` and `@typescript-eslint/no-explicit-any` are enforced as `error` globally.

### Peer Dependency Warnings

- `vaul` requests React `^18.2.0` while capital uses React `19.2.0`
- `recharts` requests `react-is` in capital and private-equities

These are currently non-blocking (builds pass) but should be tracked before larger dependency refreshes.

## Quick Recovery Commands (after /clear)

```bash
cd /Users/diegolden/Code/Diegolden/project-ultramar
corepack yarn workspaces list
corepack yarn install
corepack yarn workspace @ultramar/capital build
corepack yarn workspace @ultramar/polymarket build
corepack yarn workspace @ultramar/private-equities build
```

## Definition of Done

Phase 1 done when: **COMPLETE**

- one root git repo
- one root lockfile (`yarn.lock`)
- apps living under `apps/*`
- workspace-aware install succeeds
- each app builds from workspace scope

Phase 2/3 done when: **COMPLETE**

- no hardcoded legacy package-manager commands remain in active scripts/workflows
- CI/CD runs from monorepo paths
- all apps pinned and validated on target Next version (`16.1.6`)
