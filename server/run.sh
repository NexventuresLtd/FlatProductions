#!/usr/bin/env bash
source "$(conda info --base)/etc/profile.d/conda.sh"
conda activate fastapi_setup
cd "$(dirname "${BASH_SOURCE[0]}")"
uvicorn app.main:app --port 2800
