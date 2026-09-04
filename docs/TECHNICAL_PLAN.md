# Technical Plan — MenuAR

## Estado encontrado (Fase 0)

Repositório praticamente vazio (`README.md` mínimo). Estrutura criada do zero.

## Estrutura final

```text
apps/web          React + Vite + Tailwind
apps/worker       Cloudflare Worker + Hono
packages/shared   Tipos, schemas Zod, constantes, utils
supabase/         Migrations + seed
docs/             Documentação de produto e operação
tools/            Stub de photogrammetry (macOS)
tests/e2e         Playwright smoke
```

## Modo mock

`VITE_USE_MOCK_DATA=true` (padrão) permite demo completa sem Supabase/Cloudflare.

## Próximas conexões manuais

1. Credenciais Supabase
2. Bucket R2 + secrets Worker
3. Arquivos GLB/USDZ demo
4. Domínio Cloudflare Pages
