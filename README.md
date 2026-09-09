# MenuAR

Plataforma SaaS multiempresa de cardápios digitais com fotos, modelos 3D e realidade aumentada no navegador — sem aplicativo para o cliente.

> Nome centralizado em `VITE_APP_NAME` / `@menuar/shared` (`APP_CONFIG`).

## Stack

- Front-end: React 19 + Vite + TypeScript + Tailwind
- API: Cloudflare Workers + Hono
- Dados: Supabase (PostgreSQL + RLS); Auth preparado
- Mídia: Supabase Storage `menuar-media` (R2 opcional, não obrigatório)
- 3D/AR: Google `<model-viewer>` (carregamento sob demanda)
- Deploy gratuito: Cloudflare Pages + Workers + Supabase free tier

## Requisitos

- Node.js 20+
- pnpm 10+

## Instalação

```bash
pnpm install
cp .env.example apps/web/.env
```

## Variáveis de ambiente

Ver `.env.example`. Principais:

| Variável | Uso |
|----------|-----|
| `VITE_USE_MOCK_DATA` | `true` (padrão) — demo local sem backend |
| `VITE_API_URL` | Base do Worker (`http://localhost:8787` ou workers.dev) |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Cardápio público real |
| `VITE_DEMO_GLB_URL` / `VITE_DEMO_USDZ_URL` | Opcional para demo 3D |

Worker: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `APP_URL`, `SUPABASE_STORAGE_BUCKET`.

## Execução local

```bash
pnpm dev:web
# opcional:
pnpm dev:worker
```

Abra `http://localhost:5173`.

Com mock ativo, login em `/login` com qualquer e-mail. Use `admin@…` para painel admin.

## Testes e qualidade

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

## Rotas

- `/` landing
- `/demo` → Casa Fogo
- `/r/:slug` cardápio público
- `/r/:slug/p/:product` prato + 3D/AR
- `/q/:code` QR curto
- `/login` autenticação (mock no MVP)
- `/app/*` painel do restaurante
- `/admin/*` operação interna (`super_admin`)

## Multi-tenant

Dados isolados por `restaurant_id` no schema Supabase com RLS. Painel mock opera sobre o restaurante demo da sessão.

## 3D e AR

- Listagem usa apenas poster/foto
- GLB carrega após “Ver em 3D”
- AR via `webxr` / Scene Viewer / Quick Look quando suportado
- Fallback educativo se AR indisponível

## Cadastros (MVP)

1. **Restaurante:** seed SQL / admin (demo Casa Fogo) ou mock store
2. **Produto:** `/app/products`
3. **Modelo 3D:** `/app/models` → produção → aprovação → publicação (pipeline em `docs/MODEL_3D_PIPELINE.md`)

## Deploy gratuito

Ver [`docs/FREE_INFRASTRUCTURE.md`](./docs/FREE_INFRASTRUCTURE.md) e [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md).

```bash
pnpm deploy:cf
```

## Limitações do MVP

- Auth e painel ainda em modo demonstração (mock) até service role / Auth real
- Sem PDV, estoque, delivery completo ou pagamentos próprios
- AR depende do dispositivo/navegador

## Documentação

- [`docs/UX_UI_AUDIT.md`](./docs/UX_UI_AUDIT.md)
- [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md)
- [`docs/USER_FLOWS.md`](./docs/USER_FLOWS.md)
- [`docs/FREE_INFRASTRUCTURE.md`](./docs/FREE_INFRASTRUCTURE.md)
- [`docs/QA_REPORT.md`](./docs/QA_REPORT.md)
- Arquitetura, segurança, produto e roadmap na pasta [`docs/`](./docs)
