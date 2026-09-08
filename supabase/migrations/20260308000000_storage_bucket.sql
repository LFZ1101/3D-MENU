-- MenuAR media via Supabase Storage (free tier) — no Cloudflare R2 required.
-- Public read for cardápio; uploads signed via Worker/API with anon or service key.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'menuar-media',
  'menuar-media',
  true,
  52428800,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'model/gltf-binary',
    'model/gltf+json',
    'application/octet-stream'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read (cardápio / model-viewer)
drop policy if exists menuar_media_public_read on storage.objects;
create policy menuar_media_public_read
  on storage.objects
  for select
  using (bucket_id = 'menuar-media');

-- Allow inserts under restaurants/{uuid}/… for authenticated users and anon (MVP/demo).
-- Tighten to authenticated-only once Auth JWT is fully wired in the Worker.
drop policy if exists menuar_media_insert on storage.objects;
create policy menuar_media_insert
  on storage.objects
  for insert
  with check (
    bucket_id = 'menuar-media'
    and (storage.foldername(name))[1] = 'restaurants'
  );

drop policy if exists menuar_media_update on storage.objects;
create policy menuar_media_update
  on storage.objects
  for update
  using (
    bucket_id = 'menuar-media'
    and (storage.foldername(name))[1] = 'restaurants'
  )
  with check (
    bucket_id = 'menuar-media'
    and (storage.foldername(name))[1] = 'restaurants'
  );

drop policy if exists menuar_media_delete on storage.objects;
create policy menuar_media_delete
  on storage.objects
  for delete
  using (
    bucket_id = 'menuar-media'
    and (
      public.is_super_admin()
      or public.has_restaurant_role(
        nullif((storage.foldername(name))[2], '')::uuid,
        array['owner','manager']::public.member_role[]
      )
    )
  );
