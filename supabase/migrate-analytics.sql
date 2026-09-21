-- Unique visitors (homepage) and unique readers (per post). Safe to re-run.
-- Homepage visits and blog reads are stored in separate tables.

create table if not exists public.site_visitors (
  visitor_id text primary key,
  first_seen timestamptz not null default now()
);

create table if not exists public.post_readers (
  post_slug text not null,
  visitor_id text not null,
  first_read timestamptz not null default now(),
  primary key (post_slug, visitor_id)
);

alter table public.site_visitors enable row level security;
alter table public.post_readers enable row level security;

create or replace function public.record_site_visitor(vid text)
returns int
language plpgsql
security definer
set search_path = public
as $$
begin
  if vid is null or char_length(vid) < 8 or char_length(vid) > 80 then
    return (select count(*)::int from public.site_visitors);
  end if;
  insert into public.site_visitors (visitor_id)
  values (vid)
  on conflict (visitor_id) do nothing;
  return (select count(*)::int from public.site_visitors);
end;
$$;

create or replace function public.record_post_read(post_slug text, vid text)
returns int
language plpgsql
security definer
set search_path = public
as $$
begin
  if vid is null or char_length(vid) < 8 or char_length(vid) > 80 then
    return (
      select count(*)::int from public.post_readers r
      where r.post_slug = record_post_read.post_slug
    );
  end if;
  if exists (
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

create or replace function public.get_site_visitor_count()
returns int
language sql
security definer
set search_path = public
stable
as $$
  select count(*)::int from public.site_visitors;
$$;

create or replace function public.get_post_read_count(post_slug text)
returns int
language sql
security definer
set search_path = public
stable
as $$
  select count(*)::int
  from public.post_readers r
  where r.post_slug = get_post_read_count.post_slug;
$$;

grant execute on function public.record_site_visitor(text) to anon, authenticated;
grant execute on function public.record_post_read(text, text) to anon, authenticated;
grant execute on function public.get_site_visitor_count() to anon, authenticated;
grant execute on function public.get_post_read_count(text) to anon, authenticated;
