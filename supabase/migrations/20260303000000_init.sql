-- MenuAR initial schema + RLS
create extension if not exists "pgcrypto";

create type public.global_role as enum ('user', 'operator_3d', 'super_admin');
create type public.member_role as enum ('owner', 'manager', 'editor', 'viewer');
create type public.restaurant_status as enum ('draft', 'active', 'suspended', 'archived');
create type public.theme_mode as enum ('light', 'dark');
create type public.model_request_status as enum (
  'draft', 'submitted', 'material_review', 'needs_new_capture', 'processing',
  'internal_review', 'customer_review', 'changes_requested', 'approved',
  'published', 'rejected', 'archived'
);
create type public.subscription_status as enum (
  'trialing', 'active', 'past_due', 'grace_period', 'suspended', 'canceled'
);
create type public.qr_source_type as enum (
  'table', 'counter', 'menu_print', 'instagram', 'whatsapp',
  'delivery_package', 'event', 'campaign', 'other'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  phone text,
  global_role public.global_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  cover_url text,
  primary_color text not null default '#39d7a2',
  secondary_color text not null default '#118a68',
  background_color text not null default '#f4f7f6',
  text_color text not null default '#1d292f',
  theme public.theme_mode not null default 'light',
  phone text,
  whatsapp text,
  instagram text,
  website text,
  timezone text not null default 'America/Sao_Paulo',
  currency text not null default 'BRL',
  locale text not null default 'pt-BR',
  status public.restaurant_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.restaurant_members (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.member_role not null default 'viewer',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (restaurant_id, user_id)
);

create table public.units (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  slug text not null,
  address text,
  city text,
  state text,
  postal_code text,
  latitude double precision,
  longitude double precision,
  phone text,
  whatsapp text,
  opening_hours jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (restaurant_id, slug)
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  unique (restaurant_id, slug)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null,
  slug text not null,
  short_description text,
  description text,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'BRL',
  serves_min integer,
  serves_max integer,
  width_cm numeric,
  height_cm numeric,
  depth_cm numeric,
  ingredients text[] not null default '{}',
  allergen_notes text,
  is_vegetarian boolean not null default false,
  is_vegan boolean not null default false,
  is_gluten_free boolean not null default false,
  is_spicy boolean not null default false,
  is_featured boolean not null default false,
  is_available boolean not null default true,
  has_3d boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  unique (restaurant_id, slug)
);

create table public.product_media (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  media_type text not null,
  storage_key text not null,
  public_url text,
  alt_text text,
  width integer,
  height integer,
  size_bytes bigint,
  mime_type text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.model_requests (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  requested_by uuid references public.profiles(id),
  assigned_to uuid references public.profiles(id),
  status public.model_request_status not null default 'draft',
  width_cm numeric,
  height_cm numeric,
  depth_cm numeric,
  notes text,
  internal_notes text,
  submitted_at timestamptz,
  due_at timestamptz,
  approved_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.models_3d (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  model_request_id uuid references public.model_requests(id),
  version integer not null default 1,
  glb_storage_key text,
  usdz_storage_key text,
  poster_storage_key text,
  glb_size_bytes bigint,
  usdz_size_bytes bigint,
  polygon_count integer,
  texture_resolution integer,
  width_cm numeric,
  height_cm numeric,
  depth_cm numeric,
  scale_verified boolean not null default false,
  scale_verified_by uuid references public.profiles(id),
  scale_verified_at timestamptz,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  published_at timestamptz,
  archived_at timestamptz
);

create table public.model_reviews (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  model_id uuid not null references public.models_3d(id) on delete cascade,
  reviewer_id uuid references public.profiles(id),
  decision text not null,
  comment text,
  created_at timestamptz not null default now()
);

create table public.qr_codes (
  id uuid primary key default gen_random_uuid(),
  short_code text not null unique,
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  unit_id uuid references public.units(id),
  table_label text,
  campaign_name text,
  source_type public.qr_source_type not null default 'other',
  destination_path text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.analytics_events (
  id bigserial primary key,
  event_name text not null,
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  unit_id uuid,
  product_id uuid,
  qr_code_id uuid,
  anonymous_session_id uuid not null,
  source text,
  table_label text,
  device_type text,
  browser_family text,
  os_family text,
  occurred_at timestamptz not null default now(),
  duration_ms integer,
  error_code text,
  metadata jsonb not null default '{}'::jsonb
);

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  monthly_price_cents integer not null,
  max_units integer not null,
  max_products integer not null,
  max_3d_models integer not null,
  analytics_retention_days integer not null,
  custom_domain_enabled boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  plan_id uuid not null references public.plans(id),
  status public.subscription_status not null default 'trialing',
  monthly_price_cents integer not null,
  started_at timestamptz not null default now(),
  trial_ends_at timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  grace_ends_at timestamptz,
  canceled_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigserial primary key,
  restaurant_id uuid references public.restaurants(id) on delete set null,
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index analytics_events_restaurant_id_idx on public.analytics_events (restaurant_id);
create index analytics_events_product_id_idx on public.analytics_events (product_id);
create index analytics_events_event_name_idx on public.analytics_events (event_name);
create index analytics_events_occurred_at_idx on public.analytics_events (occurred_at desc);
create index analytics_events_session_idx on public.analytics_events (anonymous_session_id);
create index analytics_events_qr_idx on public.analytics_events (qr_code_id);
create index products_restaurant_id_idx on public.products (restaurant_id);
create index categories_restaurant_id_idx on public.categories (restaurant_id);
create index qr_codes_restaurant_id_idx on public.qr_codes (restaurant_id);

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.global_role = 'super_admin'
  );
$$;

create or replace function public.is_operator_3d()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.global_role in ('operator_3d', 'super_admin')
  );
$$;

create or replace function public.is_restaurant_member(target_restaurant uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.restaurant_members rm
    where rm.restaurant_id = target_restaurant
      and rm.user_id = auth.uid()
      and rm.active = true
  );
$$;

create or replace function public.has_restaurant_role(target_restaurant uuid, allowed public.member_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.restaurant_members rm
    where rm.restaurant_id = target_restaurant
      and rm.user_id = auth.uid()
      and rm.active = true
      and rm.role = any(allowed)
  );
$$;

alter table public.profiles enable row level security;
alter table public.restaurants enable row level security;
alter table public.restaurant_members enable row level security;
alter table public.units enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_media enable row level security;
alter table public.model_requests enable row level security;
alter table public.models_3d enable row level security;
alter table public.model_reviews enable row level security;
alter table public.qr_codes enable row level security;
alter table public.analytics_events enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.audit_logs enable row level security;

create policy profiles_self_select on public.profiles
  for select using (id = auth.uid() or public.is_super_admin());

create policy restaurants_public_read on public.restaurants
  for select using (status = 'active' or public.is_restaurant_member(id) or public.is_super_admin());

create policy restaurants_member_update on public.restaurants
  for update using (public.has_restaurant_role(id, array['owner','manager']::public.member_role[]) or public.is_super_admin());

create policy categories_public_read on public.categories
  for select using (
    (active = true and archived_at is null and exists (
      select 1 from public.restaurants r where r.id = restaurant_id and r.status = 'active'
    ))
    or public.is_restaurant_member(restaurant_id)
    or public.is_super_admin()
  );

create policy categories_write on public.categories
  for all using (
    public.has_restaurant_role(restaurant_id, array['owner','manager','editor']::public.member_role[])
    or public.is_super_admin()
  )
  with check (
    public.has_restaurant_role(restaurant_id, array['owner','manager','editor']::public.member_role[])
    or public.is_super_admin()
  );

create policy products_public_read on public.products
  for select using (
    (archived_at is null and exists (
      select 1 from public.restaurants r where r.id = restaurant_id and r.status = 'active'
    ))
    or public.is_restaurant_member(restaurant_id)
    or public.is_super_admin()
  );

create policy products_write on public.products
  for all using (
    public.has_restaurant_role(restaurant_id, array['owner','manager','editor']::public.member_role[])
    or public.is_super_admin()
  )
  with check (
    public.has_restaurant_role(restaurant_id, array['owner','manager','editor']::public.member_role[])
    or public.is_super_admin()
  );

create policy members_read on public.restaurant_members
  for select using (public.is_restaurant_member(restaurant_id) or public.is_super_admin());

create policy members_manage on public.restaurant_members
  for all using (
    public.has_restaurant_role(restaurant_id, array['owner']::public.member_role[])
    or public.is_super_admin()
  )
  with check (
    public.has_restaurant_role(restaurant_id, array['owner']::public.member_role[])
    or public.is_super_admin()
  );

create policy analytics_member_read on public.analytics_events
  for select using (
    public.has_restaurant_role(restaurant_id, array['owner','manager','editor','viewer']::public.member_role[])
    or public.is_super_admin()
  );

create policy analytics_insert_service on public.analytics_events
  for insert with check (true);

create policy plans_public_read on public.plans
  for select using (active = true or public.is_super_admin());

create policy subscriptions_member_read on public.subscriptions
  for select using (public.is_restaurant_member(restaurant_id) or public.is_super_admin());

create policy model_requests_member on public.model_requests
  for all using (
    public.has_restaurant_role(restaurant_id, array['owner','manager']::public.member_role[])
    or public.is_operator_3d()
    or public.is_super_admin()
  )
  with check (
    public.has_restaurant_role(restaurant_id, array['owner','manager']::public.member_role[])
    or public.is_operator_3d()
    or public.is_super_admin()
  );

create policy models_3d_public_read on public.models_3d
  for select using (
    (status = 'published' and archived_at is null)
    or public.is_restaurant_member(restaurant_id)
    or public.is_operator_3d()
    or public.is_super_admin()
  );

create policy qr_codes_member on public.qr_codes
  for all using (
    public.has_restaurant_role(restaurant_id, array['owner','manager','editor']::public.member_role[])
    or public.is_super_admin()
  )
  with check (
    public.has_restaurant_role(restaurant_id, array['owner','manager','editor']::public.member_role[])
    or public.is_super_admin()
  );

create policy qr_codes_public_resolve on public.qr_codes
  for select using (active = true or public.is_restaurant_member(restaurant_id) or public.is_super_admin());
