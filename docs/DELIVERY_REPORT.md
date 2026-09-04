# Relatório de entrega — MenuAR MVP

## 1. Resumo

MVP comercial do **MenuAR** em monorepo pnpm: landing, cardápio demo Casa Fogo, painéis com CRUD, Worker expandido, schema Supabase+RLS, analytics, QR com download, docs e CI. Funciona em modo mock sem credenciais; camada Supabase pronta para ativação.

## 2. Arquitetura final

React/Vite (Pages) → Supabase (Auth/Postgres/RLS) + Worker Hono (analytics/upload/QR/menu) → R2 (mídia) → model-viewer (3D/AR sob demanda).

## 3. Estrutura

`apps/web`, `apps/worker`, `packages/shared`, `supabase/`, `docs/`, `tools/photogrammetry`, `tests/e2e`, `.github/workflows`.

## 4. Funcionalidades concluídas

- Landing + planos + demo Casa Fogo
- Cardápio público / produto / busca / filtros / fallback 3D
- QR `/q/:code` + download SVG/PNG
- Painel: dashboard, categorias, produtos (CRUD), modelos (solicitação/aprovação), QR, analytics, branding, equipe, notificações
- Admin: overview, restaurantes (ativar/suspender), kanban 3D, assinaturas manuais
- Worker: health, analytics, QR resolve, menu stub, upload sign/confirm, security headers
- Cliente Supabase + switch mock automático
- Migrations + RLS + seed
- Documentação completa

## 5. Simuladas (mock)

Auth real Supabase, upload R2 assinado de ponta a ponta, persistência analytics em produção.

## 6. Pendências reais (bloqueio de credencial)

- Autenticar MCP/projeto Supabase e preencher secrets
- Bucket R2 + domínio Cloudflare Pages/Worker
- Arquivos GLB/USDZ demo
- Object Capture no Mac
- Lighthouse em staging
- Gateway (fora do MVP)

## 7. Testes

- Unit shared + web + worker
- E2E Playwright ampliado (CRUD + admin)
- Lint / typecheck / build

## 8–18. Operação

Ver `.env.example`, `docs/DEPLOYMENT.md`, `docs/MODEL_3D_PIPELINE.md`.

Login mock: qualquer e-mail; `admin@...` → `/admin`.

## 19. Limitações

Sem persistência real até credenciais; AR depende de dispositivo; produção 3D local.

## 20. Próxima fase

Conectar Supabase + R2, publicar Pages/Worker, gerar 3 pratos demo reais, prospectar piloto.
