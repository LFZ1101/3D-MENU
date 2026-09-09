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
  export VITE_API_URL="$WORKER_URL"
  export VITE_APP_URL="${VITE_APP_URL:-https://${PAGES_PROJECT}.pages.dev}"
  pnpm exec vite build
)

echo "==> Deploy pages"
pnpm --filter @menuar/worker exec wrangler pages deploy "$ROOT/apps/web/dist" \
  --project-name "$PAGES_PROJECT" \
  --branch main \
  --commit-dirty=true

echo "Worker: $WORKER_URL"
echo "Pages:  https://${PAGES_PROJECT}.pages.dev"
