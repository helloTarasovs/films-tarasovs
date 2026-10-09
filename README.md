# films.tarasovs.me

Portfolio site for Yurii Tarasov, AI film and motion director at Tarasovs Digital Agency. It presents selected films, the formats on offer and the production process, and takes project enquiries through a contact form.

Live site: [films.tarasovs.me](https://films.tarasovs.me)

## Stack

- **Next.js 16** (App Router) with **React 19** and **TypeScript**
- **Tailwind CSS v4**, shadcn/ui and Base UI components
- **Sanity v6** as the headless CMS, with the Studio embedded at `/studio`
- **Vidstack** player for films, opened in a lightbox
- Video files served from a separate media domain (`media.tarasovs.me`) on Cloudflare, so the repository and the app bundle stay light
- **Web3Forms** for the contact form
- Deployed on **Vercel**, with Vercel Analytics

## Features

**Content managed in Sanity.** Projects, the home page and site settings are Sanity document types (`sanity/schemaTypes`). Content is fetched with GROQ queries in `sanity/lib`, and images use responsive `srcset` built from the Sanity image pipeline.

**Draft preview.** Editors can preview unpublished changes through Next.js Draft Mode (`app/api/draft-mode`), using a server-only read token.

**Works without the CMS.** If the Sanity project ID or dataset is missing, the site renders hardcoded fallback content instead of failing.

**Content migration scripts.** `scripts/migrate-content.ts` moves the content that was hardcoded in the site into Sanity as drafts. It skips existing documents, never overwrites filled fields, uploads cover images and supports a dry run.

**Mobile performance.**
- Hero video is deferred and only plays on phones when the connection allows
- Only the font used above the fold is preloaded
- Responsive poster images for film cards
- CSS is inlined to remove the render-blocking stylesheet request
- Reduced main-thread work on first load

**SEO.** Canonical URLs, Open Graph and Twitter cards, a dedicated 1200x630 OG image, `robots.txt`, XML sitemap and JSON-LD structured data. Removed template pages redirect to the matching homepage sections.

## Project structure

```text
app/
  (site)/          homepage and /contact
  studio/          embedded Sanity Studio
  api/draft-mode/  enable / disable preview
  robots.ts, sitemap.ts
components/
  site/            hero, work sequence, format rows, process steps, header, footer
  ui/              shared UI primitives
sanity/
  schemaTypes/     project, homePage, siteSettings, link, socialLink
  lib/             client, GROQ queries, fetch helpers, types
scripts/           one-off content migrations into Sanity
```

## Running locally

Requires Node 22.12 or newer and pnpm.

```sh
pnpm install
cp .env.example .env.local   # then add your own values
pnpm dev                      # http://localhost:3000
```

Environment variables:

| Variable | Purpose |
| :-- | :-- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset |
| `SANITY_API_READ_TOKEN` | Server-only token for draft preview |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | Contact form (public by design) |

Real values live in `.env.local` and in the Vercel project settings, never in the repository.

## Credits

Frontend development by [Vira Tarasova](https://www.linkedin.com/in/vira-tarasova-71860410a/).

Code is shared for portfolio purposes. Films, design, copy and images © Yurii Tarasov / Tarasovs Digital Agency. All rights reserved.
