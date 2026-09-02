# pardheev.dev

Personal portfolio site for **Pardheev** — Next.js 15 App Router, TypeScript, Tailwind CSS, and shadcn/ui.

This first pass is a static shell. Copy lives in `lib/data.ts` so real content can replace placeholders later.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- shadcn/ui (Radix)
- Geist Sans / Geist Mono via `next/font`
- Motion for animation
- ESLint + Prettier

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run format
npm run build
```

## Deploy

Push to GitHub and import the repo in Vercel. No extra config is required — Next.js is detected automatically. Set the production domain to `pardheev.dev` in the Vercel project settings.
