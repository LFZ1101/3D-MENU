# Security — MenuAR

## Controles

- RLS multiempresa
- Segredos apenas em variáveis de servidor
- Upload via URL assinada (Worker)
- MIME allowlist + limites de tamanho
- Rate limiting no Worker
- CSP/headers em produção (Cloudflare)
- Logs sem tokens/senhas/URLs assinadas completas

## LGPD

- Sessão anônima com TTL
- Sem IP bruto permanente no MVP
- Sem fingerprint invasivo
- Consentimento configurável (roadmap)

## Ameaças

- Acesso cruzado entre restaurantes → RLS + testes
- Upload abusivo → auth + MIME + size + rate limit
- XSS → React escaping + CSP
