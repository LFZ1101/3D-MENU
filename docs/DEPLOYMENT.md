# Deployment — MenuAR

## Front-end

Cloudflare Pages apontando para `apps/web` (`pnpm --filter @menuar/web build`, output `dist`).

## Worker

```bash
pnpm --filter @menuar/worker exec wrangler deploy
```

## Supabase

1. Criar projeto
2. Aplicar migrations
3. Rodar seed
4. Configurar Auth redirect URLs
5. Preencher `VITE_SUPABASE_*` e secrets do Worker

## R2

1. Criar bucket `menuar-media`
2. Configurar domínio público/CDN
3. Bind no `wrangler.toml`
4. Preencher secrets de assinatura

## Ambientes

- Preview / Staging / Production
- Rollback: redeploy da versão anterior no Pages + Worker
