# Architecture — MenuAR

```text
QR / Browser
    │
    ▼
React (Cloudflare Pages)
    │
    ├── Supabase Auth + Postgres + RLS
    ├── Worker (Hono) ── R2 signed uploads / analytics ingest
    └── model-viewer (GLB/USDZ sob demanda)
```

## Decisões

- Um único app multiempresa (`restaurant_id` + RLS)
- Mock mode para desenvolvimento sem credenciais
- Modelos 3D nunca na listagem
- Analytics próprio com allowlist + Zod
- Assinaturas manuais no MVP

## Trade-offs

- Produção 3D local (qualidade e custo) vs automação
- Free tiers iniciais vs necessidade futura de upgrade
