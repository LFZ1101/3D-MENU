# Relatório de QA — MenuAR (polish comercial)

Data: 2026-09-09  
Branch: `cursor/mvp-commercial-polish-2eb2`

## Escopo validado

- Fundação: tokens, Toast, FormField, StatusBadge, ConfirmDialog, contraste de marca
- Público: landing, cardápio (busca/limpar/a11y), produto (SEO title, toast AR), model-viewer
- Painel: empty states, toasts, labels PT, preview aparência, logout
- Admin: kanban completo, confirmação de status, contexto “Administrando”
- Docs: audit, design system, fluxos, infra free, README
- Perf: Recharts lazy no dashboard

## Resultados desta rodada

| Comando | Resultado |
|---------|-----------|
| `pnpm lint` | ✅ 0 erros (1 warning react-refresh em toast) |
| `pnpm typecheck` | ✅ |
| `pnpm test` | ✅ shared 7 · web 8 · worker 5 |
| `pnpm build` | ✅ Pages + Worker dry-run |

### Bundle (web)

- Chunk principal ~572 kB / gzip ~161 kB
- Charts isolados ~393 kB (lazy no dashboard)
- Admin / app code-split

## Critérios de pronto

| Critério | Resultado |
|----------|-----------|
| Build produção | ✅ |
| Lint / typecheck | ✅ |
| Testes unitários | ✅ |
| Cardápio mobile (código) | ✅ sticky, 44px, busca 16px |
| 3D loading + fallback | ✅ |
| AR detecção + mensagem | ✅ |
| Multi-tenant contratos | ✅ preservados |
| Sem serviço pago novo | ✅ |

## Não testado / limitações

- Lighthouse em device real
- AR em hardware WebXR
- Persistência Supabase do painel (mock)
- Auth real Supabase
- E2E Playwright (browsers podem não estar instalados neste ambiente)

## P0 restantes

- Auth mock + painel mock (A1/A2)

## P2/P3 pendentes

- Open Graph dinâmico por restaurante/produto
- Bottom sheet de produto em mobile
- Expandir design system (Select/Switch/Table encapsulados)
- Reduzir ainda mais o chunk principal (supabase client / radix)
