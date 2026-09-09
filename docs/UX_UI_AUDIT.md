# Auditoria UX/UI — MenuAR MVP

Data: 2026-09-09  
Branch base: `cursor/mvp-commercial-polish-2eb2`  
Baseline: lint ✅ · typecheck ✅ · unit tests ✅ · build ✅

---

## 5.1 Diagnóstico técnico

### Stack atual
| Camada | Tecnologia |
|--------|------------|
| Front | React 19 + Vite 6 + TypeScript + Tailwind |
| API | Cloudflare Workers + Hono |
| Dados | Supabase Postgres + RLS |
| Auth | Mock (`sessionStorage`); Supabase Auth preparado |
| Storage | Supabase Storage `menuar-media` (R2 opcional pago) |
| 3D/AR | Google `<model-viewer>` 4.0 (CDN) |
| Deploy | Cloudflare Pages + Workers (free) |

### Estrutura
`apps/web`, `apps/worker`, `packages/shared`, `supabase/`, `docs/`, `tests/e2e/`

### Rotas
- **Públicas:** `/`, `/demo`, `/r/:slug`, `/r/:slug/p/:product`, `/q/:code`, `/login`, forgot/reset
- **Restaurante (`RequireSession`):** `/app/*` (dashboard, menu, products, models, qr, analytics, settings, team)
- **Admin (`super_admin`):** `/admin/*` (dashboard, restaurants, model-requests, subscriptions + placeholders)

### Componentes UI existentes
`Button`, `Badge`, `EmptyState`, `Skeleton`, `ProductCard`, `ProductModelViewer`, shells, site-chrome

### Autenticação
Login mock: qualquer e-mail válido; “admin” no e-mail → `super_admin`. Sem logout. Forgot/reset stubs.

### Banco / Storage
Schema + RLS + seed Casa Fogo aplicados. Storage público `menuar-media`. Painel **não** persiste no Supabase (mock store).

### 3D / AR
Carregamento sob demanda OK. Sem GLB demo por padrão (`VITE_DEMO_*` vazio). AR unavailable só em analytics — sem feedback ao usuário.

### Build / testes (baseline)
- Lint / typecheck / unit / worker dry-run: OK
- E2E Playwright: 4 specs (requer browsers instalados)

### Dependências
Radix (dialog/select/toast) instalados mas pouco encapsulados. Recharts no dashboard. Sem dependências pagas.

---

## 5.2 Diagnóstico de UX/UI

| Área | Avaliação |
|------|-----------|
| Primeira impressão | Landing com hero full-bleed e marca forte (pós-polish). CTAs claros. |
| Proposta de valor | Clara (“vê o prato antes de pedir”). |
| Cardápio público | Boa base mobile; tema por restaurante; busca + filtros. |
| Página produto | Hierarquia ok; falta educação 3D/AR e feedback AR. |
| Painel restaurante | Usável em mock, mas sem toasts, poucos empty states, tabela frágil no mobile. |
| Admin | Kanban incompleto (status ocultos); placeholders na nav. |
| A11y | Focus-visible global; labels parciais; falta toast aria-live; contraste de marca sem validação. |
| Performance | Code-split admin/app; GLB sob demanda; bundle principal ainda grande (~567kb). |

---

## 5.3 Classificação dos problemas

| ID | Sev | Problema | Tela | Impacto | Solução | Risco | Status |
|----|-----|----------|------|---------|---------|-------|--------|
| A1 | P0 | Painel/admin só mock — dados não persistem | `/app`, `/admin` | Demo comercial frágil | Manter mock documentado; preparar repos (sem quebrar API) | Médio | Doc + polish UX |
| A2 | P0 | Auth não é Supabase Auth | Login | Segurança | Não alterar destrutivamente nesta fase; documentar + logout | Alto se forçado | Logout + doc |
| A3 | P1 | Sem feedback AR indisponível | Produto | Confusão | Mensagem educativa no viewer | Baixo | ✅ |
| A4 | P1 | Sem toast / feedback de ações | Painel | Parece quebrado | Toast + aria-live | Baixo | ✅ |
| A5 | P1 | Empty states faltando | Produtos/QR/Team | Confusão | EmptyState + CTA | Baixo | ✅ |
| A6 | P1 | Tabela produtos sem scroll mobile | Produtos | UX mobile | overflow-x-auto / cards | Baixo | ✅ |
| A7 | P1 | Kanban admin omite status | Admin 3D | Tickets “sumidos” | Renderizar todos os status | Baixo | ✅ |
| A8 | P1 | Contraste marca do restaurante | Cardápio | Ilegibilidade | Fallback contraste | Baixo | ✅ |
| A9 | P1 | Sem logout | Shells | Sessão presa | Botão sair | Baixo | ✅ |
| A10 | P1 | Model viewer sem progresso/educação | Produto | Abandono | Progress + copy | Baixo | ✅ |
| A11 | P2 | Design system incompleto | Global | Inconsistência | Input/FormField/Toast/etc. | Baixo | ✅ parcial |
| A12 | P2 | Placeholders admin na nav | Admin | Parece incompleto | Badge “Em breve” | Baixo | ✅ |
| A13 | P2 | Settings branding clear bug | Settings | UX form | Controlled fields | Baixo | ✅ |
| A14 | P2 | Landing hero text vs imagem | Landing | Hierarquia | Reforçar contraste overlay | Baixo | ✅ |
| A15 | P3 | Bundle JS grande | Global | Perf | Lazy charts | Médio | Pendente |
| A16 | P3 | Sem Open Graph completo | Público | Share | Meta tags | Baixo | Parcial (index) |

---

## Decisão de implementação

Não reescrever arquitetura. Priorizar:
1. Fundação de design system + a11y
2. Experiência pública 3D/AR + contraste
3. Painel: toasts, empty states, mobile, logout
4. Admin: kanban completo + nav honesta
5. Documentação obrigatória

**Fora de escopo destrutivo nesta rodada:** migrar Auth/painel para Supabase real (exige secret key + mudanças sensíveis — documentado como P0 restante).
