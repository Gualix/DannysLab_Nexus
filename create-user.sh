#!/usr/bin/env bash
# Thin wrapper around scripts/create-user.mjs
# Usage:
#   ./create-user.sh --email user@example.com --password 'S3cret!' [--admin] [--name "Full Name"]
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$SCRIPT_DIR"

if ! command -v node >/dev/null 2>&1; then
  echo "[x] Node.js is required but not found in PATH." >&2
  exit 1
fi

if [ ! -d "node_modules/@supabase/supabase-js" ]; then
  echo "[+] Installing dependencies (first run only)…"
  npm install --no-audit --no-fund
fi

exec node scripts/create-user.mjs "$@"
