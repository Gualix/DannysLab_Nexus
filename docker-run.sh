#!/usr/bin/env bash
# Danny's Lab Nexus — One-shot local Docker bootstrap
# Builds and runs the app via docker compose. Safe to re-run.
set -euo pipefail

# ---------- helpers ----------
log()  { printf "\033[1;34m[+]\033[0m %s\n" "$*"; }
warn() { printf "\033[1;33m[!]\033[0m %s\n" "$*"; }
err()  { printf "\033[1;31m[x]\033[0m %s\n" "$*" >&2; }

# Resolve script dir (project root)
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$SCRIPT_DIR"

APP_URL="http://localhost:8080"
HEALTH_URL="http://localhost:8080/healthz"

# ---------- preflight: docker ----------
if ! command -v docker >/dev/null 2>&1; then
  err "Docker is not installed. Install Docker Desktop: https://www.docker.com/products/docker-desktop/"
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  err "Docker daemon is not running. Start Docker Desktop and re-run this script."
  exit 1
fi

# Detect compose command (v2 plugin vs legacy)
if docker compose version >/dev/null 2>&1; then
  COMPOSE=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE=(docker-compose)
else
  err "Neither 'docker compose' nor 'docker-compose' is available."
  exit 1
fi

log "Using compose command: ${COMPOSE[*]}"

# ---------- preflight: .env.local ----------
if [ ! -f ".env.local" ]; then
  if [ -f ".env.example" ]; then
    warn ".env.local missing — creating from .env.example"
    cp .env.example .env.local
    warn "Edit .env.local and set real Supabase values, especially SUPABASE_SERVICE_ROLE_KEY."
    warn "Continuing with placeholder values for now…"
  else
    err ".env.local and .env.example are both missing. Cannot proceed."
    exit 1
  fi
else
  log ".env.local found"
fi

# ---------- parse args ----------
ACTION="up"
NO_CACHE=""
FOLLOW_LOGS="false"
for arg in "$@"; do
  case "$arg" in
    --rebuild|--no-cache) NO_CACHE="--no-cache" ;;
    --logs)               FOLLOW_LOGS="true" ;;
    down|stop)            ACTION="down" ;;
    restart)              ACTION="restart" ;;
    -h|--help)
      cat <<EOF
Usage: ./docker-run.sh [options] [command]

Commands:
  (none)     Build (if needed) and start the app in the background
  restart    Recreate containers
  down|stop  Stop and remove containers

Options:
  --rebuild  Force a clean image rebuild (no cache)
  --logs     Tail logs after startup
  -h|--help  Show this help
EOF
      exit 0
      ;;
    *) warn "Ignoring unknown arg: $arg" ;;
  esac
done

# ---------- actions ----------
if [ "$ACTION" = "down" ]; then
  log "Stopping containers…"
  "${COMPOSE[@]}" down
  log "Stopped."
  exit 0
fi

if [ "$ACTION" = "restart" ]; then
  log "Restarting containers…"
  "${COMPOSE[@]}" down
fi

log "Building images…${NO_CACHE:+ (no cache)}"
# shellcheck disable=SC2086
"${COMPOSE[@]}" build $NO_CACHE

log "Starting containers in detached mode…"
"${COMPOSE[@]}" up -d

# ---------- wait for health ----------
log "Waiting for app to become healthy at $HEALTH_URL …"
ATTEMPTS=60
until curl -fsS "$HEALTH_URL" >/dev/null 2>&1; do
  ATTEMPTS=$((ATTEMPTS - 1))
  if [ "$ATTEMPTS" -le 0 ]; then
    err "App did not become healthy in time. Recent logs:"
    "${COMPOSE[@]}" logs --tail=80 || true
    exit 1
  fi
  sleep 2
done

log "App is up: $APP_URL"
"${COMPOSE[@]}" ps

if [ "$FOLLOW_LOGS" = "true" ]; then
  log "Tailing logs (Ctrl+C to exit)…"
  "${COMPOSE[@]}" logs -f
fi
