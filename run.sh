#!/usr/bin/env bash
# Starts the whole app: FastAPI backend (internal, :8000) + Vite frontend
# (the app itself, :2034 — proxies /api and /uploads to the backend).
# Open http://localhost:2034 once both are up.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$ROOT_DIR/server"
FRONTEND_DIR="$ROOT_DIR/flatproduction"
FRONTEND_PORT=2034
BACKEND_PORT=8000

if [ ! -d "$SERVER_DIR/.venv" ]; then
  echo "error: $SERVER_DIR/.venv not found — run this first:" >&2
  echo "  cd server && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt" >&2
  exit 1
fi

if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
  echo "error: $FRONTEND_DIR/node_modules not found — run this first:" >&2
  echo "  cd flatproduction && npm install --legacy-peer-deps" >&2
  exit 1
fi

PIDS=()
cleanup() {
  echo ""
  echo "Stopping…"
  for pid in "${PIDS[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo "Starting backend on :$BACKEND_PORT…"
(
  cd "$SERVER_DIR"
  source .venv/bin/activate
  exec uvicorn app.main:app --port "$BACKEND_PORT"
) &
PIDS+=("$!")

echo "Starting frontend on :$FRONTEND_PORT…"
(
  cd "$FRONTEND_DIR"
  exec npm run dev -- --port "$FRONTEND_PORT" --strictPort
) &
PIDS+=("$!")

echo ""
echo "App:     http://localhost:$FRONTEND_PORT"
echo "API:     http://localhost:$BACKEND_PORT"
echo "Ctrl+C to stop both."
echo ""

wait
