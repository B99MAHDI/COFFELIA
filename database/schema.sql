-- Coffelia : tables, sécurité (RLS) et stockage des photos
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null check (price >= 0),
  image_url text not null,
  type text not null default 'mug' check (type in ('mug','verre')),
  description text,
  available boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.settings (key text primary key, value text);
insert into public.settings (key, value) values ('whatsapp', '') on conflict do nothing;

-- Liste des administrateurs (aucune lecture directe via l'API)
create table if not exists public.admins (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.admins enable row level security;

create or replace function public.is_admin() returns boolean
language sql security definer set search_path = public as
$$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

alter table public.products enable row level security;
alter table public.settings enable row level security;
create policy "produits lisibles par tous" on public.products for select using (true);
create policy "produits modifiables par admin" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "reglages lisibles par tous" on public.settings for select using (true);
create policy "reglages modifiables par admin" on public.settings for all using (public.is_admin()) with check (public.is_admin());

-- Photos : bucket public en lecture, écriture réservée aux admins
insert into storage.buckets (id, name, public) values ('products', 'products', true) on conflict do nothing;
create policy "photos lisibles par tous" on storage.objects for select using (bucket_id = 'products');
create policy "photos ajoutees par admin" on storage.objects for insert with check (bucket_id = 'products' and public.is_admin());
create policy "photos supprimees par admin" on storage.objects for delete using (bucket_id = 'products' and public.is_admin());

-- Après avoir créé votre utilisateur admin (Authentication > Users), exécutez :
-- insert into public.admins (user_id) select id from auth.users where email = 'VOTRE_EMAIL';

-- Si la table products existait déjà (avant l'ajout du filtre Mugs / Verres), exécutez seulement ceci :
-- alter table public.products add column if not exists type text not null default 'mug' check (type in ('mug','verre'));

-- Si la table products existait déjà, ajoutez les nouvelles colonnes (description, disponibilité) :
-- alter table public.products add column if not exists description text;
-- alter table public.products add column if not exists available boolean not null default true;
