# Fluxos de usuário — MenuAR

## Consumidor (QR → cardápio → 3D/AR)

1. Escaneia QR (`/q/:code`) → redireciona para `/r/:slug` com origem.
2. Vê marca, descrição e capa do restaurante.
3. Filtra por categoria sticky ou busca por nome/descrição.
4. Abre prato (`/r/:slug/p/:product`).
5. Lê preço, descrição, alergênicos e indicadores.
6. Opcional: **Ver em 3D** (download sob demanda) → gira o modelo.
7. Opcional: **Ver no meu ambiente** (AR) ou mensagem se indisponível.
8. Compartilha ou registra interesse.

Estados: loading skeleton, cardápio inexistente, busca sem resultados, produto sem GLB, AR indisponível.

## Restaurante (painel `/app`)

1. Login mock (`/login`) → sessão em `sessionStorage`.
2. **Visão geral:** métricas 7 dias, notificações, atalhos.
3. **Categorias / Produtos:** CRUD básico, disponibilidade, preço.
4. **Modelos 3D:** solicitar com medidas e consentimentos; acompanhar status em PT.
5. **QR Codes:** criar origem, testar destino, copiar link, baixar SVG/PNG.
6. **Aparência:** nome, descrição, cor, WhatsApp + preview mobile.
7. **Equipe / Métricas:** membros e taxas de interesse.
8. **Sair** limpa a sessão.

> Persistência do painel é mock nesta versão do MVP. Cardápio público pode usar Supabase quando `VITE_USE_MOCK_DATA=false`.

## Admin (`/admin`, role `super_admin`)

1. Login com e-mail contendo `admin`.
2. Dashboard operacional (restaurantes, modelos, storage approx.).
3. Lista/detalhe de restaurantes com confirmação em mudanças de status.
4. Kanban de solicitações 3D com todos os status.
5. Assinaturas; demais itens marcados “Em breve”.

## Autenticação (atual)

- Qualquer e-mail válido cria sessão restaurant owner.
- E-mail com `admin` → `super_admin`.
- Sem Supabase Auth ligado no front nesta fase (documentado como P0 restante).
