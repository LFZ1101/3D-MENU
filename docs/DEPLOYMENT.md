# Deployment — MenuAR

## Provisionamento rápido (Stripe Projects)

1. Autenticar Stripe CLI (browser):
   ```bash
   stripe login --non-interactive --new-session
   # abra browser_url e digite verification_code
   stripe login --complete-device
   ```
2. Provisionar:
   ```bash
   pnpm infra:provision
   ```
   Isso cria/conecta:
   - Supabase project (DB + Auth + Storage)
   - Cloudflare R2 bucket `menuar-media`
   - Cloudflare Workers
3. Aplicar schema:
   ```bash
   supabase link --project-ref <ref>
   supabase db push
   supabase db query -f supabase/seed.sql
   ```

## Conectar env local

```bash
pnpm infra:connect
pnpm dev
```

`VITE_USE_MOCK_DATA` desliga automaticamente quando `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` existem.

## Front-end (Cloudflare Pages)

- Build: `pnpm install && pnpm --filter @menuar/shared build && pnpm --filter @menuar/web build`
- Output: `apps/web/dist`
- SPA fallback: `apps/web/public/_redirects`

```bash
pnpm --filter @menuar/web exec wrangler pages deploy dist --project-name menuar-web
```

## Worker

```bash
pnpm --filter @menuar/worker exec wrangler deploy
```

Secrets do Worker (`wrangler secret put`):

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `R2_PUBLIC_BASE_URL`

## Auth redirect URLs (Supabase)

Adicionar:

- `http://localhost:5173/*`
- `https://<seu-dominio>/*`

## R2

1. Bucket `menuar-media`
2. Domínio público/CDN
3. Bind `MEDIA_BUCKET` no `apps/worker/wrangler.toml`

## Ambientes

- Preview / Staging / Production
- Rollback: redeploy da versão anterior no Pages + Worker
