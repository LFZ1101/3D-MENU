-- Seed demonstrativo Casa Fogo
insert into public.plans (id, code, name, monthly_price_cents, max_units, max_products, max_3d_models, analytics_retention_days, custom_domain_enabled)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'founder', 'Piloto fundador', 9900, 1, 100, 5, 30, false),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'essential', 'Essencial', 14900, 1, 150, 5, 60, false),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 'experience', 'Experiência', 24900, 1, 300, 12, 90, false),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4', 'premium', 'Premium', 44900, 3, 500, 30, 180, true);

insert into public.restaurants (
  id, name, slug, description, status, primary_color, secondary_color
) values (
  '11111111-1111-4111-8111-111111111111',
  'Casa Fogo',
  'casa-fogo',
  'Restaurante demonstrativo — experiência MenuAR com pratos visuais.',
  'active',
  '#39d7a2',
  '#118a68'
);

insert into public.units (id, restaurant_id, name, slug, address, city, state, active)
values (
  '22222222-2222-4222-8222-222222222222',
  '11111111-1111-4111-8111-111111111111',
  'Unidade Centro',
  'centro',
  'Rua das Brasas, 120',
  'Londrina',
  'PR',
  true
);

insert into public.categories (id, restaurant_id, name, slug, sort_order, active) values
  ('c1111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111111', 'Hambúrgueres', 'hamburgueres', 1, true),
  ('c2222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111111', 'Porções', 'porcoes', 2, true),
  ('c3333333-3333-4333-8333-333333333333', '11111111-1111-4111-8111-111111111111', 'Pratos', 'pratos', 3, true),
  ('c4444444-4444-4444-8444-444444444444', '11111111-1111-4111-8111-111111111111', 'Sobremesas', 'sobremesas', 4, true),
  ('c5555555-5555-4555-8555-555555555555', '11111111-1111-4111-8111-111111111111', 'Bebidas', 'bebidas', 5, true);

insert into public.products (
  id, restaurant_id, category_id, name, slug, short_description, description,
  price_cents, serves_min, serves_max, width_cm, height_cm, depth_cm,
  ingredients, allergen_notes, is_vegetarian, is_featured, is_available, has_3d, sort_order
) values
(
  'p1111111-1111-4111-8111-111111111111',
  '11111111-1111-4111-8111-111111111111',
  'c1111111-1111-4111-8111-111111111111',
  'Burger Brasa', 'burger-brasa',
  'Blend 180g, queijo maturado e cebola caramelizada.',
  'Hambúrguer artesanal grelhado na brasa.',
  4290, 1, 1, 14, 8, 14,
  array['Blend bovino 180g','Pão brioche','Queijo maturado'],
  'Contém glúten e lactose.', false, true, true, false, 1
),
(
  'p2222222-2222-4222-8222-222222222222',
  '11111111-1111-4111-8111-111111111111',
  'c2222222-2222-4222-8222-222222222222',
  'Porção da Casa', 'porcao-da-casa',
  'Batatas crocantes, anéis e molhos.',
  'Porção generosa para compartilhar.',
  5490, 2, 3, 28, 8, 20,
  array['Batata','Cebola','Molhos'],
  'Pode conter glúten.', true, true, true, false, 1
);

insert into public.qr_codes (short_code, restaurant_id, unit_id, table_label, source_type, destination_path, active)
values
  ('mesa12', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222', 'Mesa 12', 'table', '/r/casa-fogo', true),
  ('bio-ig', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222', null, 'instagram', '/r/casa-fogo', true);

insert into public.subscriptions (restaurant_id, plan_id, status, monthly_price_cents, trial_ends_at)
values (
  '11111111-1111-4111-8111-111111111111',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
  'trialing',
  9900,
  now() + interval '30 days'
);
