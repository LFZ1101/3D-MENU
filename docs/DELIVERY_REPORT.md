# Relatório de entrega — MenuAR MVP

## 1. Resumo

MVP comercial do **MenuAR** em monorepo pnpm: landing, cardápio demo Casa Fogo, painéis com CRUD, Worker expandido, schema Supabase+RLS+Storage, analytics, QR com download, docs e CI. Funciona em modo mock sem credenciais; com Stripe Projects + Supabase o cardápio público, QR, analytics e uploads usam dados reais **sem cartão**.

## 2. Arquitetura final

React/Vite → Supabase (Auth/Postgres/RLS/Storage) + Worker Hono (analytics/upload/QR/menu) → model-viewer (3D/AR sob demanda).  
Cloudflare Workers (plano free) para API; R2 opcional (billing).

## 3. Estrutura

`apps/web`, `apps/worker`, `packages/shared`, `supabase/`, `docs/`, `tools/photogrammetry`, `tests/e2e`, `.github/workflows`.

## 4. Funcionalidades concluídas

- Landing + planos + demo Casa Fogo
- Cardápio público / produto / busca / filtros / fallback 3D
- QR `/q/:code` + download SVG/PNG
- Painel: dashboard, categorias, produtos (CRUD), modelos, QR, analytics, branding, equipe, notificações
- Admin: overview, restaurantes, kanban 3D, assinaturas manuais
- Worker: health, analytics (live), QR resolve (live), menu, upload sign via Supabase Storage
- Cliente Supabase + switch mock automático
- Migrations + RLS + seed + bucket `menuar-media`
- Documentação completa

## 5. Ainda mock / parcial

- Auth de painel (login mock até Auth JWT completo)
- CRUD do painel/admin ainda no store mock (público já lê Supabase)
- Modelos 3D GLB/USDZ reais (pipeline documentado; Object Capture no Mac)

## 6. Pendências operacionais

- `wrangler login` (OAuth device) para publicar Worker/Pages no free tier
- Arquivos GLB/USDZ demo
- Lighthouse em staging
- Gateway de pagamento (fora do MVP)

## 7. Testes

- Unit shared + web + worker
- E2E Playwright
- Lint / typecheck / build
- Validação live: REST Casa Fogo, QR `mesa12`, analytics insert, Storage signed upload

## 8–18. Operação

Ver `.env.example`, `docs/DEPLOYMENT.md`, `docs/MODEL_3D_PIPELINE.md`.

Login mock: qualquer e-mail; `admin@...` → `/admin`.

## 19. Limitações

AR depende de dispositivo; produção 3D local; deploy Cloudflare precisa OAuth Wrangler.

## 20. Próxima fase

Publicar Worker/Pages, Auth real no painel, 3 pratos demo com GLB, prospectar piloto.
