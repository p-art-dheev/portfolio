-- Paste this entire file into the Supabase SQL editor (once).
-- If a "Potential issue detected" dialog appears, click "Run without RLS".
-- This script already enables RLS on every table. "Run and enable RLS" is a
-- dashboard bug that tries to alter a table named "Self".
-- Then: Auth → disable public sign-ups, and create a single user for yourself.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Tables (RLS enabled immediately so the SQL advisor stays quiet)
-- ---------------------------------------------------------------------------

create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  name text not null,
  domain text not null,
  role text not null default '',
  tagline text not null default '',
  bio text not null default '',
  college text not null default '',
  branch text not null default '',
  year text not null default '',
  location text not null default '',
  resume text not null default '/resume/resume.pdf',
  avatars jsonb not null default '[]'::jsonb,
  socials jsonb not null default '{}'::jsonb,
  tech_stack jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  banner text,
  tags text[] not null default '{}',
  href text,
  status text not null default 'off' check (status in ('off', 'live', 'Building')),
  featured boolean not null default false,
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.projects enable row level security;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content_html text not null default '',
  cover_url text,
  published boolean not null default false,
  published_at timestamptz,
  tags text[] not null default '{}',
  category text not null default '',
  views_count int not null default 0,
  likes_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.posts enable row level security;

create table if not exists public.artworks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  alt text not null default '',
  width int not null default 1200,
  height int not null default 1600,
  link text,
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.artworks enable row level security;

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text not null default '',
  author text not null default '',
  cover_url text not null,
  cover_alt text not null default '',
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.books enable row level security;

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists posts_updated_at on public.posts;
create trigger posts_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

drop trigger if exists artworks_updated_at on public.artworks;
create trigger artworks_updated_at
before update on public.artworks
for each row execute function public.set_updated_at();

drop trigger if exists books_updated_at on public.books;
create trigger books_updated_at
before update on public.books
for each row execute function public.set_updated_at();

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Policies
-- ---------------------------------------------------------------------------

drop policy if exists "Public read site settings" on public.site_settings;
create policy "Public read site settings"
on public.site_settings for select
to anon, authenticated
using (true);

drop policy if exists "Admin write site settings" on public.site_settings;
create policy "Admin write site settings"
on public.site_settings for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public read published projects" on public.projects;
create policy "Public read published projects"
on public.projects for select
to anon, authenticated
using (published = true or auth.uid() is not null);

drop policy if exists "Admin write projects" on public.projects;
create policy "Admin write projects"
on public.projects for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public read published posts" on public.posts;
create policy "Public read published posts"
on public.posts for select
to anon, authenticated
using (published = true or auth.uid() is not null);

drop policy if exists "Admin write posts" on public.posts;
create policy "Admin write posts"
on public.posts for all
to authenticated
using (true)
with check (true);

create or replace function public.increment_post_views(post_slug text)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count int;
begin
  update public.posts
  set views_count = views_count + 1
  where slug = post_slug and published = true
  returning views_count into new_count;
  return coalesce(new_count, 0);
end;
$$;

create or replace function public.increment_post_likes(post_slug text)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count int;
begin
  update public.posts
  set likes_count = likes_count + 1
  where slug = post_slug and published = true
  returning likes_count into new_count;
  return coalesce(new_count, 0);
end;
$$;

grant execute on function public.increment_post_views(text) to anon, authenticated;
grant execute on function public.increment_post_likes(text) to anon, authenticated;

drop policy if exists "Public read published artworks" on public.artworks;
create policy "Public read published artworks"
on public.artworks for select
to anon, authenticated
using (published = true or auth.uid() is not null);

drop policy if exists "Admin write artworks" on public.artworks;
create policy "Admin write artworks"
on public.artworks for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public read published books" on public.books;
create policy "Public read published books"
on public.books for select
to anon, authenticated
using (published = true or auth.uid() is not null);

drop policy if exists "Admin write books" on public.books;
create policy "Admin write books"
on public.books for all
to authenticated
using (true)
with check (true);

-- ---------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read media" on storage.objects;
create policy "Public read media"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'media');

drop policy if exists "Auth upload media" on storage.objects;
create policy "Auth upload media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'media');

drop policy if exists "Auth update media" on storage.objects;
create policy "Auth update media"
on storage.objects for update
to authenticated
using (bucket_id = 'media')
with check (bucket_id = 'media');

drop policy if exists "Auth delete media" on storage.objects;
create policy "Auth delete media"
on storage.objects for delete
to authenticated
using (bucket_id = 'media');
