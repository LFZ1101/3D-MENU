#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Provision MenuAR via Stripe Projects"

if ! stripe projects status --json >/tmp/menuar-projects-status.json 2>&1; then
  echo "Projects não inicializado. Rodando init..."
  stripe projects init --accept-tos --yes
fi

echo "Adding Supabase project..."
stripe projects add supabase/project \
  --name menuar \
  --region americas \
  --yes || true

echo "Adding Cloudflare R2 bucket..."
stripe projects add cloudflare/r2:bucket \
  --name menuar-media \
  --yes || true

echo "Adding Cloudflare Workers..."
stripe projects add cloudflare/workers \
  --yes || true

echo "Syncing env..."
stripe projects env --json > /tmp/menuar-projects-env.json || true
stripe projects status --json > /tmp/menuar-projects-status.json || true

bash "$ROOT/scripts/connect-infra.sh"

echo "Done. Review stripe projects status --json"
