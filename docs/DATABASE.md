# Database — MenuAR

Migração: `supabase/migrations/20260303000000_init.sql`  
Seed: `supabase/seed.sql`

## Tabelas

profiles, restaurants, restaurant_members, units, categories, products, product_media, model_requests, models_3d, model_reviews, qr_codes, analytics_events, plans, subscriptions, audit_logs

## Segurança

RLS ativo em todas as tabelas de negócio. Funções auxiliares:

- `is_super_admin()`
- `is_operator_3d()`
- `is_restaurant_member(uuid)`
- `has_restaurant_role(uuid, roles[])`

## Preços

Sempre em `price_cents` (inteiro).

## Retenção

Planejar agregação futura de `analytics_events` por plano (`analytics_retention_days`).
