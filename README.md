# MenuAR

Plataforma SaaS multiempresa de cardápios digitais com pratos em 3D e realidade aumentada no navegador.

> Nome provisório centralizado em `VITE_APP_NAME` / `@menuar/shared` (`APP_CONFIG`).

## Stack

- Front-end: React + Vite + TypeScript + Tailwind
- API: Cloudflare Workers + Hono
- Dados: Supabase (PostgreSQL, Auth, RLS)
- Mídia: Cloudflare R2
- 3D/AR: Google `<model-viewer>`

## Requisitos

- Node.js 20+
- pnpm 10+

## Instalação

```bash
pnpm install
cp .env.example apps/web/.env
```

## Execução

```bash
pnpm dev:web
# em outro terminal, opcional:
pnpm dev:worker
```

Abra `http://localhost:5173`.

Com `VITE_USE_MOCK_DATA=true` (padrão), a aplicação funciona sem credenciais.

## Scripts

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

## Rotas principais

- `/` landing
- `/demo` → Casa Fogo
- `/r/:slug` cardápio
- `/r/:slug/p/:product` prato
- `/q/:code` QR curto
- `/login` autenticação
- `/app/*` painel do restaurante
- `/admin/*` operação interna

## Documentação

Veja a pasta [`docs/`](./docs).

## Deploy

Documentado em [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md).
