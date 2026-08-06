#!/usr/bin/env bash

# Run the local data-room QA suite as a transaction: this process starts the
# isolated Supabase project, then is responsible for stopping it on every exit
# path. It deliberately refuses to borrow a stack that another process owns.

set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
SUPABASE_CONFIG="${APP_ROOT}/supabase/config.toml"

log() {
  printf '[ultramar:qa] %s\n' "$*"
}

fail() {
  log "ERROR: $*" >&2
  exit 1
}

require_command() {
  local command="$1"
  if ! command -v "${command}" >/dev/null 2>&1; then
    fail "${command} is required. Install it and retry."
  fi
}

project_id="$({
  sed -nE 's/^[[:space:]]*project_id[[:space:]]*=[[:space:]]*"([A-Za-z0-9._-]+)"[[:space:]]*$/\1/p' "${SUPABASE_CONFIG}" | head -n 1
} || true)"

if [[ -z "${project_id}" ]]; then
  fail "Could not read a safe project_id from ${SUPABASE_CONFIG}."
fi

docker_desktop_started_here=0
supabase_started_here=0

stop_owned_supabase_stack() {
  local remaining_containers
  local fallback_failed=0

  if ! supabase stop --workdir "${APP_ROOT}" --yes; then
    log "WARN: Supabase CLI teardown reported an error; checking this run's containers directly." >&2
  fi

  if ! remaining_containers="$(docker ps -aq --filter "label=com.supabase.cli.project=${project_id}")"; then
    return 1
  fi

  if [[ -z "${remaining_containers}" ]]; then
    return 0
  fi

  log "Removing remaining containers scoped to '${project_id}' while preserving volumes."
  while IFS= read -r container_id; do
    [[ -z "${container_id}" ]] && continue
    if ! docker rm -f "${container_id}" >/dev/null; then
      fallback_failed=1
    fi
  done <<< "${remaining_containers}"

  if ! remaining_containers="$(docker ps -aq --filter "label=com.supabase.cli.project=${project_id}")"; then
    return 1
  fi

  [[ -z "${remaining_containers}" && "${fallback_failed}" -eq 0 ]]
}

disarm_project_container_restarts() {
  local project_containers
  local update_failed=0

  if ! project_containers="$(docker ps -aq --filter "label=com.supabase.cli.project=${project_id}")"; then
    return 1
  fi

  [[ -n "${project_containers}" ]] || return 1

  # Supabase assigns `unless-stopped`. Disarm it immediately so an abnormal
  # end that skips this script's trap cannot revive the QA stack later.
  while IFS= read -r container_id; do
    [[ -z "${container_id}" ]] && continue
    docker update --restart=no "${container_id}" >/dev/null || update_failed=1
  done <<< "${project_containers}"

  [[ "${update_failed}" -eq 0 ]]
}

cleanup() {
  local status="$?"
  local cleanup_failed=0
  local other_running_containers

  trap - EXIT HUP INT TERM

  if [[ "${supabase_started_here}" -eq 1 ]]; then
    log "Stopping the Supabase stack started by this QA run."
    if ! stop_owned_supabase_stack; then
      log "ERROR: Could not stop the Supabase stack started by this QA run." >&2
      cleanup_failed=1
    fi
  fi

  if [[ "${docker_desktop_started_here}" -eq 1 ]]; then
    if ! other_running_containers="$(docker ps -q)"; then
      log "ERROR: Could not determine whether Docker Desktop is safe to stop." >&2
      cleanup_failed=1
    elif [[ -n "${other_running_containers}" ]]; then
      log "Leaving Docker Desktop running because another container is active."
    else
      log "Stopping Docker Desktop started by this QA run."
      if ! docker desktop stop --timeout 120; then
        log "ERROR: Could not stop Docker Desktop started by this QA run." >&2
        cleanup_failed=1
      fi
    fi
  fi

  if [[ "${cleanup_failed}" -eq 1 && "${status}" -eq 0 ]]; then
    status=1
  fi

  exit "${status}"
}

trap cleanup EXIT
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM

ensure_docker() {
  if docker info >/dev/null 2>&1; then
    return
  fi

  if ! docker desktop version >/dev/null 2>&1; then
    fail "Docker is unavailable. Start a Docker-compatible runtime and retry."
  fi

  log "Starting Docker Desktop for this QA run."
  # Mark ownership before starting so a partial Docker Desktop launch is also
  # stopped by the EXIT trap.
  docker_desktop_started_here=1
  if ! docker desktop start --timeout 120; then
    fail "Docker Desktop did not start."
  fi

  if ! docker info >/dev/null 2>&1; then
    fail "Docker Desktop started but its daemon is still unavailable."
  fi
}

assert_no_existing_stack() {
  local existing_containers
  if ! existing_containers="$(docker ps -aq --filter "label=com.supabase.cli.project=${project_id}")"; then
    fail "Could not inspect Docker for existing Supabase containers."
  fi

  if [[ -n "${existing_containers}" ]]; then
    fail "Supabase project '${project_id}' already has Docker containers. This command never adopts or stops a stack it did not start; remove that old stack explicitly, then retry."
  fi

  if supabase status --workdir "${APP_ROOT}" --output json >/dev/null 2>&1; then
    fail "Supabase project '${project_id}' is already running. This command never reuses or stops a stack it did not start."
  fi
}

read_status_value() {
  local status_json="$1"
  local key="$2"

  node -e '
    const status = JSON.parse(process.argv[1]);
    const value = status[process.argv[2]];
    if (typeof value !== "string" || value.length === 0) process.exit(1);
    process.stdout.write(value);
  ' "${status_json}" "${key}"
}

configure_local_e2e_environment() {
  local status_json
  local api_url
  local publishable_key
  local secret_key
  local service_role_key

  if ! status_json="$(supabase status --workdir "${APP_ROOT}" --output json)"; then
    fail "Could not read the local Supabase test configuration."
  fi

  api_url="$(read_status_value "${status_json}" API_URL)" || fail "Local Supabase did not return API_URL."
  publishable_key="$(read_status_value "${status_json}" PUBLISHABLE_KEY)" || fail "Local Supabase did not return PUBLISHABLE_KEY."
  secret_key="$(read_status_value "${status_json}" SECRET_KEY)" || fail "Local Supabase did not return SECRET_KEY."
  service_role_key="$(read_status_value "${status_json}" SERVICE_ROLE_KEY)" || fail "Local Supabase did not return SERVICE_ROLE_KEY."

  case "${api_url}" in
    http://127.0.0.1:*|http://localhost:*|http://\[::1\]:*) ;;
    *) fail "Refusing to run QA against a non-loopback Supabase URL: ${api_url}" ;;
  esac

  export SUPABASE_URL="${api_url}"
  export SUPABASE_SERVICE_ROLE_KEY="${service_role_key}"
  export NEXT_PUBLIC_SUPABASE_URL="${api_url}"
  export NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="${publishable_key}"
  export SUPABASE_SECRET_KEY="${secret_key}"
  export NEXT_PUBLIC_SITE_URL="http://127.0.0.1:3100"

  # Playwright must own and terminate its Next server. Defining this empty
  # prevents apps/ultramar/.env.local from supplying an external base URL.
  export PLAYWRIGHT_BASE_URL=""
}

for command in docker node supabase yarn; do
  require_command "${command}"
done

if [[ -n "${PLAYWRIGHT_BASE_URL:-}" ]]; then
  fail "PLAYWRIGHT_BASE_URL is not supported by test:qa:local; use test:e2e directly for an explicitly managed external server."
fi

ensure_docker
assert_no_existing_stack

log "Starting isolated Supabase project '${project_id}'."
# Mark ownership before starting so a partial startup is also stopped by the trap.
supabase_started_here=1
supabase start --workdir "${APP_ROOT}" --yes
if ! disarm_project_container_restarts; then
  fail "Could not disable automatic restart for the Supabase QA containers."
fi

configure_local_e2e_environment

log "Linting the local Supabase schema."
supabase db lint --workdir "${APP_ROOT}" --local --level warning --fail-on warning

log "Running the local database/RLS tests."
supabase test db --workdir "${APP_ROOT}" --local

log "Running Playwright E2E against the stack started by this QA run."
cd "${APP_ROOT}"
yarn test:e2e
