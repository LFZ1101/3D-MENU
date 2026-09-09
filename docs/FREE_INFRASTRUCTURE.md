# Infraestrutura gratuita — MenuAR

## Stack free-tier

| Camada | Serviço | Plano |
|--------|---------|-------|
| Front | Cloudflare Pages | Free |
| API | Cloudflare Workers | Free |
| DB + Auth + Storage | Supabase | Free |
| Código | GitHub | Free |
| 3D/AR | `<model-viewer>` (CDN Google) | Free |
| QR | Geração local (`qrcode` / SVG) | Free |
| Fontes | Google Fonts (Syne, Manrope) | Free |

## O que NÃO usar no MVP

- Cloudflare R2 via Stripe Projects (billing obrigatório mesmo em free tier)
- Analytics pagos, CDNs cobrados, APIs de IA, geração 3D paga
- E-mail transacional / mapas / chat pagos

## Armazenamento

Bucket Supabase Storage `menuar-media` (público para assets do cardápio).

## Variáveis

Ver `.env.example`. Em produção Pages:

- `VITE_API_URL` = URL do Worker (ex.: `https://menuar-worker.*.workers.dev`)
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` quando sair do mock
- `VITE_USE_MOCK_DATA=true` para demo sem backend

Worker secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `APP_URL`, `SUPABASE_STORAGE_BUCKET`.

**Não** mapear `MENUAR_WORKER_API_BASE_URL` (API da Cloudflare) em `VITE_API_URL`.

## Deploy

```bash
pnpm deploy:cf
# ou scripts/deploy-cloudflare.sh
```

Detalhes em `docs/DEPLOYMENT.md`.

## Limitações do free tier

- Quotas de Workers/Pages/Supabase
- Sem service role via Stripe Projects → painel ainda mock
- Modelos 3D pesados podem estourar limites de Storage/banda
