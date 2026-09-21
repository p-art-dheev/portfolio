-- Run once in the SQL editor if posts already exist (after the original schema).
-- Safe to re-run.

alter table public.posts
  add column if not exists tags text[] not null default '{}',
  add column if not exists category text not null default '',
  add column if not exists views_count int not null default 0,
  add column if not exists likes_count int not null default 0;

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
