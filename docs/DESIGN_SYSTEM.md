# Design System — MenuAR

## Princípios

1. **Gastronomia + tecnologia discreta** — visual editorial, sem excesso de jade.
2. **Mobile-first no cardápio público** — toque ≥ 44px, tipografia ≥ 16px no mobile.
3. **Jade como ação** — CTAs e estados positivos; nunca como fundo dominante.
4. **Contraste seguro** — cores do restaurante passam por `safeRestaurantColors`.
5. **Feedback honesto** — loading, vazio, erro e sucesso sem jargão técnico.

## Tokens

Definidos em `apps/web/src/styles/globals.css` e espelhados no Tailwind (`tailwind.config.js`).

| Token | Valor | Uso |
|-------|-------|-----|
| `--ink` | `#071014` | Fundos escuros, marca |
| `--surface-dark` | `#152025` | Painéis admin |
| `--paper` | `#f3f6f5` | Fundo claro |
| `--text` | `#162227` | Texto principal |
| `--muted` | `#5f6f75` | Texto secundário (≥ AA em paper) |
| `--line` | `#d5dfdc` | Bordas |
| `--jade` / `--jade-dark` | `#2fd6a0` / `#0f8f6c` | Ação |
| `--danger` / `--warning` | vermelho / âmbar | Status |

Espaçamentos: múltiplos de 4px. Raios: `rounded-xl` (controles), `rounded-2xl`/`rounded-3xl` (superfícies). Sombras: `shadow-soft`, `shadow-lift`.

Animações: 120–280ms (`--ease-out`); respeitam `prefers-reduced-motion`.

## Tipografia

- **Display:** Syne (títulos, marca)
- **UI:** Manrope (corpo, labels)
- Preços e métricas: peso semibold + `font-display` quando destacados

## Componentes

| Componente | Caminho |
|------------|---------|
| Button | `components/ui/button.tsx` |
| Badge / StatusBadge | `badge.tsx`, `status-badge.tsx` |
| Input / Textarea / FormField | `form.tsx` |
| Toast | `toast.tsx` |
| Skeleton / EmptyState | `skeleton.tsx`, `empty-state.tsx` |
| ConfirmDialog | `confirm-dialog.tsx` |
| ProductCard | `product/product-card.tsx` |
| ProductModelViewer | `3d/product-model-viewer.tsx` |

Estados obrigatórios nos controles: default, hover, focus-visible, active, disabled, loading quando aplicável.

## Tema do restaurante

`restaurantThemeStyle` / `safeRestaurantColors` em `lib/restaurant-theme.ts`:

- Se contraste texto/fundo < 4.5 → fallback paper + texto escuro
- Se cor primária fraca no fundo → usa secondary para ação

## Não fazer

- Cards decorativos no hero
- Gradientes purple/indigo
- Pills em excesso
- Carregar GLB na listagem do cardápio
- Prometer AR sem detecção de suporte
