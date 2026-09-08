#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

WORKER_URL="${WORKER_URL:-https://menuar-worker.ddv8tdvr5m.workers.dev}"
PAGES_PROJECT="${PAGES_PROJECT:-menuar-web}"

echo "==> Build shared"
pnpm --filter @menuar/shared build

echo "==> Deploy worker"
pnpm --filter @menuar/worker exec wrangler deploy

echo "==> Build web (API=$WORKER_URL)"
(
  cd apps/web
  # temporarily set API for production build without rewriting secrets file permanently
  export VITE_API_URL="$WORKER_URL"
  # vite reads .env — override via env takes precedence for VITE_* in Vite
  pnpm exec vite build
)

echo "==> Deploy pages"
pnpm --filter @menuar/worker exec wrangler pages deploy apps/web/dist \
  --project-name "$PAGES_PROJECT" \
  --branch main \
  --commit-dirty=true

echo "Worker: $WORKER_URL"
echo "Pages:  https://${PAGES_PROJECT}.pages.dev"
