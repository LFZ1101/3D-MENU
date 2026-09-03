# Relatório de entrega — MenuAR MVP

## 1. Resumo

MVP comercial do **MenuAR** criado do zero como monorepo pnpm: landing, cardápio demo Casa Fogo, painéis, Worker, schema Supabase+RLS, analytics, QR, docs e CI. Funciona em modo mock sem credenciais.

## 2. Arquitetura final

React/Vite (Pages) → Supabase (Auth/Postgres/RLS) + Worker Hono (analytics/upload) → R2 (mídia) → model-viewer (3D/AR sob demanda).

## 3. Estrutura

`apps/web`, `apps/worker`, `packages/shared`, `supabase/`, `docs/`, `tools/photogrammetry`, `tests/e2e`, `.github/workflows`.

## 4. Funcionalidades concluídas

- Landing original + planos configuráveis
- Cardápio público / produto / busca / filtros
- Fallback 3D sem GLB
- QR `/q/:code` com evento
- Painel restaurante (dashboard, produtos, modelos, QR, analytics)
- Admin interno (overview, restaurantes, solicitações)
- Worker health + analytics validation + contrato de upload
- Migrations + seed + RLS
- Mock mode tipado
- Documentação completa

## 5. Simuladas (mock)

Auth, CRUD persistente, upload R2 real, persistência analytics, gestão avançada de branding/equipe.

## 6. Pendências reais

Credenciais Supabase/Cloudflare/R2, GLB/USDZ demo, Object Capture no Mac, gateway (fora do MVP), Lighthouse em staging.

## 7. Testes

- Unit: shared 7 + web 1 + worker 2 = **10 passed**
- E2E Playwright: **3 passed**
- Lint/typecheck/build: **ok**

## 8. Build

- `apps/web/dist` gerado
- Worker wrangler dry-run ok

## 9–18. Operação

Ver `.env.example`, `docs/DEPLOYMENT.md`, `docs/MODEL_3D_PIPELINE.md`.

Login mock: qualquer e-mail válido; `admin@...` → `/admin`.

## 19. Limitações

Sem persistência real até credenciais; AR depende de dispositivo; produção 3D local.

## 20. Próxima fase

Conectar Supabase + R2, publicar Pages/Worker, gerar 3 pratos demo reais, prospectar piloto.
