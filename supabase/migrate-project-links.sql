-- Project links: separate GitHub + live URLs (with a custom live-button label)
-- replace the single `href` column. Safe to re-run. Run once in the Supabase
-- SQL editor. The site keeps rendering links before and after this runs.

alter table public.projects
  add column if not exists github_url text,
  add column if not exists live_url text,
  add column if not exists live_label text not null default '';

-- Move existing href values: GitHub links go to github_url, anything else to
-- live_url. Only fills empty targets, so re-running never overwrites edits.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'projects' and column_name = 'href'
  ) then
    update public.projects
    set github_url = href
    where href ~* '^https?://(www\.)?github\.com/' and github_url is null;

    update public.projects
    set live_url = href
    where href is not null
      and href !~* '^https?://(www\.)?github\.com/'
      and live_url is null;

    alter table public.projects drop column href;
  end if;
end $$;

-- Give every project a distinct, gapped sort order so drag-and-drop has a
-- clean starting point (keeps the current relative order).
with ranked as (
  select id, row_number() over (order by sort_order, created_at) * 10 as new_order
  from public.projects
)
update public.projects p
set sort_order = ranked.new_order
from ranked
where p.id = ranked.id;
