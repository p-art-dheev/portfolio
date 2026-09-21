# Admin CMS (Supabase)

The public site stays on Vercel. Content (projects, blogs, artworks, books, homepage copy) lives in a **free Supabase** project.

## One-time setup

1. Create a project at [supabase.com](https://supabase.com).
2. SQL editor → run [`supabase/schema.sql`](../supabase/schema.sql), then [`supabase/seed.sql`](../supabase/seed.sql).
   If the site was set up before tags/likes, also run [`supabase/migrate-posts.sql`](../supabase/migrate-posts.sql).
   For unique homepage visitors and unique blog reads, run [`supabase/migrate-analytics.sql`](../supabase/migrate-analytics.sql).
3. **Authentication → Providers → Email**: keep email enabled.
4. **Authentication → Providers**: turn **off** “Allow new users to sign up” (or disable public sign-ups under Auth settings).
5. **Authentication → Users → Add user**: create **one** admin account (your email + password). Confirm the email if the dashboard asks you to.
6. Copy **Project URL** and **anon public** key from **Project Settings → API**.

Local `.env.local` (and the same two keys in the Vercel project):

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Never add the `service_role` key to this app. Writes use your logged-in session; Row Level Security blocks anonymous edits.

7. Open `/admin/login`, sign in, then manage content. The public navbar does not link to admin.

If env vars are missing, the site keeps serving the current static copy from `lib/data.ts` / `lib/artworks.ts` / `lib/books.ts`.

## Limits (free tier)

- Database ~500 MB, Storage ~1 GB — enough for a personal portfolio if you compress images.
- Inactive free projects can pause after about a week with **zero** traffic; a live site stays awake.
- New uploads go to the public `media` bucket. Existing files under `public/` can keep their `/artworks/...` paths.
