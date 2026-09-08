# Architecture — MenuAR

```text
QR / Browser
    │
    ▼
React (Cloudflare Pages)
    │
    ├── Supabase Auth + Postgres + RLS
    ├── Worker (Hono) ── Supabase Storage uploads / analytics ingest
    │                      (R2 opcional)
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
