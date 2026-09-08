-- Public read policies missing from init (units + product_media blocked anon).

do $$ begin
  create policy units_public_read on public.units
    for select using (
      (active = true and exists (
        select 1 from public.restaurants r where r.id = restaurant_id and r.status = 'active'
      ))
      or public.is_restaurant_member(restaurant_id)
      or public.is_super_admin()
    );
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy product_media_public_read on public.product_media
    for select using (
      (archived_at is null and exists (
        select 1 from public.restaurants r where r.id = restaurant_id and r.status = 'active'
      ))
      or public.is_restaurant_member(restaurant_id)
      or public.is_super_admin()
    );
exception when duplicate_object then null;
end $$;

-- Demo images for Casa Fogo (external public URLs — no R2/billing).
insert into public.product_media (
  restaurant_id, product_id, media_type, storage_key, public_url, alt_text, sort_order, mime_type
)
select v.restaurant_id, v.product_id, v.media_type, v.storage_key, v.public_url, v.alt_text, v.sort_order, v.mime_type
from (values
  (
    '11111111-1111-4111-8111-111111111111'::uuid,
    'a1111111-1111-4111-8111-111111111111'::uuid,
    'image',
    'external/burger-brasa.jpg',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    'Burger Brasa',
    0,
    'image/jpeg'
  ),
  (
    '11111111-1111-4111-8111-111111111111'::uuid,
    'a2222222-2222-4222-8222-222222222222'::uuid,
    'image',
    'external/porcao-da-casa.jpg',
    'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=1200&q=80',
    'Porção da Casa',
    0,
    'image/jpeg'
  )
) as v(restaurant_id, product_id, media_type, storage_key, public_url, alt_text, sort_order, mime_type)
where not exists (
  select 1 from public.product_media pm
  where pm.product_id = v.product_id and pm.storage_key = v.storage_key
);
