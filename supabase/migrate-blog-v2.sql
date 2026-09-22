-- Blog v2: stored reading time, cover alt text, one-like-per-visitor, engagement
-- and read-count helpers. Safe to re-run. Run once in the Supabase SQL editor.
-- The site keeps working (with fallbacks) until this has been applied.

alter table public.posts
  add column if not exists reading_minutes int not null default 1,
  add column if not exists cover_alt text not null default '';

-- Backfill reading time for existing posts (~220 words per minute).
update public.posts
set reading_minutes = greatest(
  1,
  round(
    coalesce(
      array_length(
        regexp_split_to_array(
          trim(regexp_replace(content_html, '<[^>]+>', ' ', 'g')),
          '\s+'
        ),
        1
      ),
      0
    ) / 220.0
  )::int
);

-- Fix: record_post_read failed with 'column reference "post_slug" is ambiguous'
-- (ON CONFLICT (post_slug, ...) clashed with the parameter), so no unique read
-- was ever stored. Naming the constraint avoids the clash.
create or replace function public.record_post_read(post_slug text, vid text)
returns int
language plpgsql
security definer
set search_path = public
as $$
begin
  if vid is not null and char_length(vid) between 8 and 80 and exists (
    select 1 from public.posts p
    where p.slug = record_post_read.post_slug and p.published = true
  ) then
    insert into public.post_readers (post_slug, visitor_id)
    values (record_post_read.post_slug, vid)
    on conflict on constraint post_readers_pkey do nothing;
  end if;
  return (
    select count(*)::int from public.post_readers r
    where r.post_slug = record_post_read.post_slug
  );
end;
$$;

-- One like per visitor --------------------------------------------------------

create table if not exists public.post_likes (
  post_slug text not null,
  visitor_id text not null,
  created_at timestamptz not null default now(),
  primary key (post_slug, visitor_id)
);
alter table public.post_likes enable row level security;

-- Likes already counted in posts.likes_count are kept; the counter is only
-- adjusted when a visitor's like row is actually inserted or removed.
create or replace function public.set_post_like(post_slug text, vid text, want boolean)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  changed int := 0;
  total int;
begin
  if vid is null or char_length(vid) < 8 or char_length(vid) > 80 then
    select p.likes_count into total from public.posts p
    where p.slug = set_post_like.post_slug and p.published = true;
    return coalesce(total, 0);
  end if;

  if not exists (
    select 1 from public.posts p
    where p.slug = set_post_like.post_slug and p.published = true
  ) then
    return 0;
  end if;

  if want then
    insert into public.post_likes (post_slug, visitor_id)
    values (set_post_like.post_slug, vid)
    on conflict do nothing;
    get diagnostics changed = row_count;
    if changed > 0 then
      update public.posts p set likes_count = p.likes_count + 1
      where p.slug = set_post_like.post_slug;
    end if;
  else
    delete from public.post_likes l
    where l.post_slug = set_post_like.post_slug and l.visitor_id = vid;
    get diagnostics changed = row_count;
    if changed > 0 then
      update public.posts p set likes_count = greatest(p.likes_count - 1, 0)
      where p.slug = set_post_like.post_slug;
    end if;
  end if;

  select p.likes_count into total from public.posts p
  where p.slug = set_post_like.post_slug;
  return coalesce(total, 0);
end;
$$;

-- Reads, likes and whether this visitor liked, in one round trip.
create or replace function public.get_post_engagement(post_slug text, vid text)
returns json
language sql
security definer
set search_path = public
stable
as $$
  select json_build_object(
    'reads', (
      select count(*)::int from public.post_readers r
      where r.post_slug = get_post_engagement.post_slug
    ),
    'likes', coalesce(
      (select p.likes_count from public.posts p
       where p.slug = get_post_engagement.post_slug and p.published = true),
      0
    ),
    'liked', exists (
      select 1 from public.post_likes l
      where l.post_slug = get_post_engagement.post_slug and l.visitor_id = vid
    )
  );
$$;

-- Unique reads for every post (used by the blog list and the admin list).
create or replace function public.get_post_read_counts()
returns table (post_slug text, reads int)
language sql
security definer
set search_path = public
stable
as $$
  select r.post_slug, count(*)::int from public.post_readers r group by r.post_slug;
$$;

grant execute on function public.set_post_like(text, text, boolean) to anon, authenticated;
grant execute on function public.get_post_engagement(text, text) to anon, authenticated;
grant execute on function public.get_post_read_counts() to anon, authenticated;

-- The old anonymous "+1" endpoints allowed unlimited like/view inflation.
do $$
begin
  revoke execute on function public.increment_post_likes(text) from anon, authenticated;
exception when undefined_function then null;
end $$;

do $$
begin
  revoke execute on function public.increment_post_views(text) from anon, authenticated;
exception when undefined_function then null;
end $$;

-- Admin cleanup: deleting a post used to leave its reader/like rows behind.
-- If that slug is ever reused, the new post would silently inherit the old
-- counts. These match the "Admin write posts" policy already on public.posts.
drop policy if exists "Admin write post readers" on public.post_readers;
create policy "Admin write post readers"
on public.post_readers for all
to authenticated
using (true)
with check (true);

drop policy if exists "Admin write post likes" on public.post_likes;
create policy "Admin write post likes"
on public.post_likes for all
to authenticated
using (true)
with check (true);
