# pardheev.dev

Personal portfolio site for **Pardheev** — Next.js 15 App Router, TypeScript, Tailwind CSS, and shadcn/ui.

Public pages read published content from **Supabase** (Postgres + Auth + Storage). Until env vars are set, they fall back to the static copy in `lib/data.ts`, `lib/artworks.ts`, and `lib/books.ts`.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- shadcn/ui (Radix)
- Geist Sans / Geist Mono via `next/font`
- Motion for animation
- Supabase (free tier) for CMS, login, and image uploads
- ESLint + Prettier

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin is at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

```bash
npm run lint
npm run format
npm run build
```

## Admin / CMS

See [supabase/README.md](supabase/README.md) for the one-time free Supabase setup (schema, seed, env vars, single admin user). Add the same two `NEXT_PUBLIC_SUPABASE_*` keys in Vercel.

Never add the `service_role` key to this app.

## Deploy

Push to GitHub and import the repo in Vercel. Set the production domain to `pardheev.dev` in the Vercel project settings.
