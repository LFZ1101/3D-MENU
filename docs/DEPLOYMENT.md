# Deployment — MenuAR

## Estado atual

| Serviço | Estado | URL |
|---------|--------|-----|
| Supabase `menuar` | Live (DB + Storage) | — |
| Worker `menuar-worker` | Live (free) | https://menuar-worker.ddv8tdvr5m.workers.dev |
| Pages `menuar-web` | Live (free) | https://menuar-web.pages.dev |
| R2 | Opcional (billing) | — |

Demo: https://menuar-web.pages.dev/demo → Casa Fogo

## Local

```bash
stripe projects env --pull
pnpm infra:connect
pnpm dev
```

`VITE_USE_MOCK_DATA` desliga automaticamente com credenciais Supabase.

## Redeploy

```bash
# Worker
pnpm --filter @menuar/shared build
pnpm --filter @menuar/worker exec wrangler secret put SUPABASE_URL   # se mudou
pnpm --filter @menuar/worker exec wrangler deploy

# Pages (build com API pública)
VITE_API_URL=https://menuar-worker.ddv8tdvr5m.workers.dev pnpm --filter @menuar/web build
pnpm --filter @menuar/worker exec wrangler pages deploy apps/web/dist --project-name menuar-web --branch main --commit-dirty=true
```

Requer `wrangler login` (OAuth device funciona sem cartão).

## Secrets do Worker

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (opcional)
- `SUPABASE_STORAGE_BUCKET` (default via `[vars]`)
- `APP_URL`

## Auth redirect URLs (Supabase)

- `http://localhost:5173/*`
- `https://menuar-web.pages.dev/*`

## Mídia

MVP: Supabase Storage bucket `menuar-media` (free).  
R2 só se quiseres object storage dedicado (Stripe Projects exige cartão).
