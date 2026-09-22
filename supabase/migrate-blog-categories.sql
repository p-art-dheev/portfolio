-- Custom blog categories: a manageable list instead of the old hardcoded
-- five. Safe to re-run. Run once in the Supabase SQL editor.
--
-- posts.category stays a plain text column (unchanged, no data migration
-- needed) and is matched against this table by name at read time. Renaming
-- or deleting a category here updates any posts using it to match.

create table if not exists public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text not null default 'slate',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Case-insensitive uniqueness: "AI" and "ai" can't both exist.
create unique index if not exists blog_categories_name_key
  on public.blog_categories (lower(name));

alter table public.blog_categories enable row level security;

drop policy if exists "Public read categories" on public.blog_categories;
create policy "Public read categories"
on public.blog_categories for select
to anon, authenticated
using (true);

drop policy if exists "Admin write categories" on public.blog_categories;
create policy "Admin write categories"
on public.blog_categories for all
to authenticated
using (true)
with check (true);

-- A starting set matching the old hardcoded list. Rename, recolor, reorder
-- or delete these freely from /admin/blogs/categories — nothing else
-- depends on these specific rows.
insert into public.blog_categories (name, color, sort_order)
values
  ('Development', 'sky', 0),
  ('AI', 'violet', 1),
  ('Design', 'fuchsia', 2),
  ('Personal', 'amber', 3),
  ('Notes', 'emerald', 4)
on conflict (lower(name)) do nothing;
