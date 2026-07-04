#!/usr/bin/env bash
# Starts the whole app: FastAPI backend (conda env "fastapi_setup", internal :8000)
# + Vite frontend (the app itself, :2034 — proxies /api and /uploads to the backend).
# Open http://localhost:2034 once both are up.

set -euo pipefail

SERVER_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SERVER_DIR/.." && pwd)"
FRONTEND_DIR="$ROOT_DIR/flatproduction"
FRONTEND_PORT=2034
BACKEND_PORT=8000
CONDA_ENV_NAME="fastapi_setup"

CONDA_SH="${CONDA_EXE:-conda}"
if ! command -v conda >/dev/null 2>&1; then
  # try the default miniconda/anaconda locations if conda isn't already on PATH
  for base in "$HOME/miniconda3" "$HOME/anaconda3" "/opt/conda"; do
    if [ -f "$base/etc/profile.d/conda.sh" ]; then
      # shellcheck disable=SC1091
      source "$base/etc/profile.d/conda.sh"
      break
    fi
  done
fi
if ! command -v conda >/dev/null 2>&1; then
  echo "error: conda not found on PATH and no default install located." >&2
  exit 1
fi
# shellcheck disable=SC1091
source "$(conda info --base)/etc/profile.d/conda.sh"

if ! conda env list | grep -q "^$CONDA_ENV_NAME "; then
  echo "error: conda env '$CONDA_ENV_NAME' not found — create it first:" >&2
  echo "  conda create -n $CONDA_ENV_NAME python=3.11 && conda activate $CONDA_ENV_NAME && pip install -r requirements.txt" >&2
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

echo "Starting backend on :$BACKEND_PORT (conda env: $CONDA_ENV_NAME)…"
(
  cd "$SERVER_DIR"
  conda activate "$CONDA_ENV_NAME"
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
