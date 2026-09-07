#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> MenuAR infra connect"

need() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "Missing required env: $name" >&2
    return 1
  fi
}

# Prefer Stripe Projects synced env if present
if [[ -f .projects/.env ]]; then
  echo "Loading .projects/.env"
  set -a
  # shellcheck disable=SC1091
  source .projects/.env
  set +a
fi

if [[ -f .env.local ]]; then
  echo "Loading .env.local"
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

missing=0
for key in SUPABASE_URL SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY; do
  if ! need "$key"; then missing=1; fi
done

if [[ "$missing" -eq 1 ]]; then
  cat <<'EOF'
Não há credenciais suficientes.

Opções:
1) Autenticar Stripe CLI e provisionar via Projects (recomendado):
   stripe login --non-interactive --new-session
   stripe login --complete-device
   stripe projects init --accept-tos --yes
   stripe projects add supabase/project --name menuar --region americas
   stripe projects add cloudflare/r2:bucket --name menuar-media
   stripe projects add cloudflare/workers

2) Ou preencher .env.local manualmente a partir do dashboard Supabase/Cloudflare.
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

if command -v supabase >/dev/null 2>&1; then
  if [[ -n "${SUPABASE_PROJECT_REF:-}" ]]; then
    echo "Linking Supabase project $SUPABASE_PROJECT_REF"
    supabase link --project-ref "$SUPABASE_PROJECT_REF" || true
    echo "Pushing migrations"
    supabase db push || true
  else
    echo "SUPABASE_PROJECT_REF não definido — migrations não foram aplicadas remotamente."
  fi
fi

echo "Infra local wiring complete. Start with: pnpm dev"
