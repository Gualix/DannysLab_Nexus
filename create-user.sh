#!/usr/bin/env bash
# Create a Supabase user (optionally admin).
# Uses local Node.js if available; otherwise falls back to a Node Docker container
# so the user doesn't need to install Node.
#
# Usage:
#   ./create-user.sh --email user@example.com --password 'S3cret!' [--admin] [--name "Full Name"]
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$SCRIPT_DIR"

# Prefer local Node if available.
if command -v node >/dev/null 2>&1; then
  if [ ! -d "node_modules/@supabase/supabase-js" ]; then
    echo "[+] Installing dependencies (first run only)…"
    npm install --no-audit --no-fund
  fi
  exec node scripts/create-user.mjs "$@"
fi

# --- Docker fallback ---------------------------------------------------------
if ! command -v docker >/dev/null 2>&1; then
  echo "[x] Neither Node.js nor Docker found. Install one of them and re-run." >&2
  echo "    Docker Desktop: https://www.docker.com/products/docker-desktop/" >&2
  echo "    Node.js:        https://nodejs.org/" >&2
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "[x] Docker is installed but the daemon is not running. Start Docker Desktop and retry." >&2
  exit 1
fi

ENV_FILE_ARGS=()
if [ -f ".env.local" ]; then
  ENV_FILE_ARGS=(--env-file .env.local)
elif [ -f ".env" ]; then
  ENV_FILE_ARGS=(--env-file .env)
else
  echo "[!] No .env.local or .env file found." >&2
  echo "    SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be exported in this shell." >&2
fi

echo "[+] Node.js not found — running inside node:22-slim Docker container…"
exec docker run --rm -i \
  "${ENV_FILE_ARGS[@]}" \
  -e SUPABASE_URL="${SUPABASE_URL:-}" \
  -e SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-}" \
  -e VITE_SUPABASE_URL="${VITE_SUPABASE_URL:-}" \
  -v "$SCRIPT_DIR":/app \
  -w /app \
  node:22-slim \
  bash -lc '
    set -e
    if [ ! -d node_modules/@supabase/supabase-js ]; then
      echo "[+] Installing @supabase/supabase-js (first run only)…"
      npm install --no-audit --no-fund --silent @supabase/supabase-js@^2.105.4 >/dev/null
    fi
    exec node scripts/create-user.mjs "$@"
  ' bash "$@"
