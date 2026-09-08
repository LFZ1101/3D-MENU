#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> MenuAR infra connect"

# Prefer Stripe Projects synced env if present
if [[ -f .env ]]; then
  echo "Loading .env (Stripe Projects)"
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

if [[ -f .env.local ]]; then
  echo "Loading .env.local"
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

# Normalize Stripe Projects Supabase naming → app naming
export SUPABASE_URL="${SUPABASE_URL:-${SUPABASE_PROJECT_URL:-}}"
export SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY:-${SUPABASE_PUBLISHABLE_KEY:-}}"
export SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-${SUPABASE_SECRET_KEY:-${SUPABASE_SERVICE_KEY:-}}}"

need() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "Missing required env: $name" >&2
    return 1
  fi
}

missing=0
for key in SUPABASE_URL SUPABASE_ANON_KEY; do
  if ! need "$key"; then missing=1; fi
done

if [[ "$missing" -eq 1 ]]; then
  cat <<'EOF'
Não há credenciais suficientes.

1) Stripe Projects:
   stripe projects env --pull
   pnpm infra:connect

2) Ou preencher .env.local manualmente.
EOF
  exit 1
fi

mkdir -p apps/web apps/worker

WEB_ENV="apps/web/.env"
WORKER_VARS="apps/worker/.dev.vars"

cat > "$WEB_ENV" <<EOF
VITE_APP_NAME=MenuAR
VITE_APP_URL=${VITE_APP_URL:-http://localhost:5173}
VITE_API_URL=${VITE_API_URL:-http://localhost:8787}
VITE_PUBLIC_PRICING_ENABLED=true
VITE_USE_MOCK_DATA=false
VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
VITE_DEMO_GLB_URL=${VITE_DEMO_GLB_URL:-}
VITE_DEMO_USDZ_URL=${VITE_DEMO_USDZ_URL:-}
VITE_DEMO_POSTER_URL=${VITE_DEMO_POSTER_URL:-}
VITE_WHATSAPP_NUMBER=${VITE_WHATSAPP_NUMBER:-}
VITE_CONTACT_EMAIL=${VITE_CONTACT_EMAIL:-contato@menuar.app}
EOF

cat > "$WORKER_VARS" <<EOF
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
R2_PUBLIC_BASE_URL=${R2_PUBLIC_BASE_URL:-}
CLOUDFLARE_ACCOUNT_ID=${CLOUDFLARE_ACCOUNT_ID:-}
R2_ACCESS_KEY_ID=${R2_ACCESS_KEY_ID:-}
R2_SECRET_ACCESS_KEY=${R2_SECRET_ACCESS_KEY:-}
R2_BUCKET_NAME=${R2_BUCKET_NAME:-menuar-media}
APP_NAME=MenuAR
APP_URL=${VITE_APP_URL:-http://localhost:5173}
EOF

echo "Wrote $WEB_ENV"
echo "Wrote $WORKER_VARS"

if [[ -z "${SUPABASE_SERVICE_ROLE_KEY}" ]]; then
  echo "WARN: SUPABASE_SERVICE_ROLE_KEY/SECRET ainda não disponível via Projects."
  echo "      Worker usará SUPABASE_ANON_KEY/PUBLISHABLE para leituras públicas e analytics."
fi

if command -v supabase >/dev/null 2>&1; then
  if [[ -n "${SUPABASE_PROJECT_REF:-}" && -n "${SUPABASE_DB_PASS:-}" ]]; then
    echo "Linking Supabase project ${SUPABASE_PROJECT_REF}"
    supabase link --project-ref "$SUPABASE_PROJECT_REF" --password "$SUPABASE_DB_PASS" --yes || true
    echo "Pushing migrations"
    supabase db push --include-all --yes || supabase db push --yes || true
  else
    echo "SUPABASE_PROJECT_REF/DB_PASS ausentes — migrations remotas não aplicadas automaticamente."
  fi
fi

echo "Infra local wiring complete. Start with: pnpm dev"
