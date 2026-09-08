# Deployment — MenuAR

## Provisionamento rápido (Stripe Projects)

Estado atual do projeto `workspace`:

| Serviço | Estado |
|---------|--------|
| Supabase `menuar` | Ligado + schema/seed aplicados |
| Cloudflare `workers:free` + `menuar-worker` | Ligado |
| Cloudflare R2 `menuar-media` | Pendente de método de pagamento |

1. Autenticar Stripe CLI / Projects (já feito nesta conta).
2. Provisionar o que falta:
   ```bash
   # Após adicionar billing no checkout Stripe Projects:
   stripe projects add cloudflare/r2:bucket --name menuar-media --config '{"name":"menuar-media"}' --accept-tos --yes --confirm-paid-service
   stripe projects env --pull
   pnpm infra:connect
   ```
3. Schema (já aplicado no projeto live; reaplicar se necessário via pooler/psql com `SUPABASE_DB_PASS`).

## Conectar env local

```bash
stripe projects env --pull
pnpm infra:connect
pnpm dev
```

`VITE_USE_MOCK_DATA` desliga automaticamente quando `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` existem.

O script mapeia nomes do Stripe Projects (`SUPABASE_PROJECT_URL`, `SUPABASE_PUBLISHABLE_KEY`, `MENUAR_WORKER_ACCOUNT_ID`, …) para as vars da app.

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

Secrets do Worker (`wrangler secret put`):

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (opcional; publishable funciona para leituras públicas/analytics)
- `R2_PUBLIC_BASE_URL`

## Auth redirect URLs (Supabase)

Adicionar:

- `http://localhost:5173/*`
- `https://<seu-dominio>/*`

## R2

1. Completar billing Stripe Projects
2. Bucket `menuar-media`
3. Domínio público/CDN
4. Bind `MEDIA_BUCKET` no `apps/worker/wrangler.toml`

## Ambientes

- Preview / Staging / Production
- Rollback: redeploy da versão anterior no Pages + Worker
