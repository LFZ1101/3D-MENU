# Deployment — MenuAR

## Provisionamento rápido (Stripe Projects)

Estado atual do projeto `workspace`:

| Serviço | Estado |
|---------|--------|
| Supabase `menuar` | Ligado + schema/seed + Storage `menuar-media` |
| Cloudflare `workers:free` + `menuar-worker` | Ligado |
| Cloudflare R2 | **Opcional** (exige cartão no Stripe Projects) — MVP não precisa |

1. Autenticar Stripe CLI / Projects (já feito nesta conta).
2. Conectar env:
   ```bash
   stripe projects env --pull
   pnpm infra:connect
   ```
3. Schema/Storage: migrations em `supabase/migrations/` (incluindo bucket público `menuar-media`).

## Mídia sem pagar

O MVP usa **Supabase Storage** (incluído no plano free do projeto).  
R2 só faz sentido depois, se quiseres CDN/object storage dedicado — e aí o Stripe Projects pede método de pagamento mesmo no free tier da Cloudflare.

## Conectar env local

```bash
stripe projects env --pull
pnpm infra:connect
pnpm dev
```

`VITE_USE_MOCK_DATA` desliga automaticamente quando `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` existem.

## Front-end (Cloudflare Pages / Workers assets)

- Build: `pnpm install && pnpm --filter @menuar/shared build && pnpm --filter @menuar/web build`
- Output: `apps/web/dist`
- SPA fallback: `apps/web/public/_redirects`

```bash
pnpm --filter @menuar/web exec wrangler pages deploy dist --project-name menuar-web
```

Requer `wrangler login` ou `CLOUDFLARE_API_TOKEN`.

## Worker

```bash
pnpm --filter @menuar/worker exec wrangler deploy
```

Secrets / vars do Worker:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (opcional)
- `SUPABASE_STORAGE_BUCKET` (default `menuar-media`)
- `R2_PUBLIC_BASE_URL` (só se usares R2)

## Auth redirect URLs (Supabase)

Adicionar:

- `http://localhost:5173/*`
- `https://<seu-dominio>/*`

## R2 (opcional, pago via billing Stripe Projects)

1. Completar billing Stripe Projects
2. `stripe projects add cloudflare/r2:bucket --name menuar-media --config '{"name":"menuar-media"}' --accept-tos --yes --confirm-paid-service`
3. Descomentar `[[r2_buckets]]` em `apps/worker/wrangler.toml`

## Ambientes

- Preview / Staging / Production
- Rollback: redeploy da versão anterior no Pages + Worker
