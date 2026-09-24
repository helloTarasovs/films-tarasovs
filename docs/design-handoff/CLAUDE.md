# films.tarasovs.me: build brief

Portfolio site for Yurii Tarasov, an AI film and motion director. Personal brand, first person ("I direct"), hosted at **films.tarasovs.me**. The films are the main event: the interface frames them like a cinema and never competes with them.

Stack: **Next.js (App Router) + Tailwind CSS v4 + shadcn/ui**. Dark theme only.

This folder is the complete design handoff. Build the homepage first, pixel-faithful to `reference/`, with all values taken from `app/globals.css`.

## What is in this folder

| Path | What it is | How to use it |
|---|---|---|
| `app/globals.css` | All tokens: shadcn variables, Tailwind v4 `@theme`, fluid type scale, utilities, reduced motion | Copy to `app/globals.css` as is. Source of truth for every value. |
| `app/fonts.ts` | `next/font/google` setup for Cormorant, Inter, IBM Plex Mono | Copy to `app/fonts.ts`, apply the three variables on `<html>`. |
| `content/site.ts` | All homepage copy and the film list, typed | Copy to `content/site.ts`. Components read from it; no copy hardcoded in JSX. |
| `reference/homepage-desktop-1440.html` | Static render of the full homepage at 1440px | Open in a browser. Visual intent and layout spans. Do not copy its markup; it is fixed-width and uses placeholder gradients for footage. |
| `reference/homepage-mobile-390.html` | Same at 390px | Mobile is designed on purpose, not a squeezed desktop. Follow it. |
| `reference/components.css` | CSS the references use | Read it for exact paddings, sizes and states when a value is not obvious from the tokens. Port to Tailwind classes; do not import it. |
| `design-system/brand-book.md` | Rules: voice, type, color, contrast, video scrim, layout, motion, media, wordmark | Read fully before building. |
| `design-system/components/*.md` | One spec per component with states | Read the one you are building. |
| `design-system/tokens.json` | Same tokens as data | For tooling only. `globals.css` wins if they ever differ. |

## Setup

1. `npx shadcn@latest init` (Tailwind v4, CSS variables on). Then replace the generated `app/globals.css` with ours. It imports `tw-animate-css`, which shadcn init installs; install it if missing.
2. Copy `app/fonts.ts`, set `className={`${display.variable} ${sans.variable} ${mono.variable}`}` on `<html lang="en">`.
3. Add shadcn components only as needed: `button`, `sheet` (mobile menu), `tooltip` (copy-email confirmation) are enough for the homepage.
4. Copy `content/site.ts`.

## Hard rules (do not break these)

- **One accent: plum, in two strengths.** `bg-primary` (plum fill, cream label) for the primary button, play chip on hover and selection. `text-primary-text` / `border-primary-text` for accent text and thin marks: link hover, eyebrow rule, active nav line, Commissioned dot, focus ring. **Never `text-primary`**: the fill plum is only 3.00:1 as text.
- **shadcn `--accent` is not the brand accent.** It is the neutral hover surface for menus and ghost buttons. Leave it neutral.
- **No italic anywhere.** Cormorant is loaded without italic. A heading's second phrase uses the same roman face and size in `text-fg-secondary` (class `.contrast`).
- **No em dashes (—) in any copy, alt text or metadata.** Use a comma, colon, full stop or `·`. En dashes only in number ranges (2024–2026).
- **Text over video:** only `text-foreground`. Use the bottom scrim (`scrim-bottom` utility) and keep all copy in the bottom 40% of the frame. The plum primary button over video gets the `btn-on-media` utility (1px cream inner edge); without it the button disappears on light footage. Small captions on video ("Now showing") sit on a solid 70% scrim chip, cream text, plum only as the dot.
- **No** neon gradients, glows, glassmorphism or backdrop blur, decorative blobs, shadows on page content, identical card grids, emoji, or a second accent color.
- Radii: media 2px (`rounded-media`), buttons and inputs 4px (`rounded-md`), tags pill. Full-bleed media 0.
- Voice: first person singular. Never "we". Sentence case; uppercase only via the `label` style.

## Wordmark

Header and footer: **"Yurii Tarasov"** (Cormorant 600, 22px desktop, 20px mobile) + 1px `border-strong` vertical rule + **"FILMS"** (Inter 500, 10.5px, uppercase, 0.18em tracking, `muted-foreground`; `foreground` when the header sits over the hero video). No symbol. The agency appears once, in the footer: "Part of Tarasovs Digital Agency ↗" linking to https://tarasovs.me.

## Layout system

- 12 columns at every breakpoint. Margin / gutter: mobile 20 / 12px, tablet (≥768) 40 / 20px, desktop (≥1280) 64 / 24px. Fluid values are `--margin` and `--gutter` in `globals.css`.
- Containers: `container-text` 72rem, `container-wide` 88rem, full-bleed. Running text max `max-w-measure` (38rem).
- Section rhythm: `py-section-sm` (64→96), `py-section` (96→160), `py-section-lg` (128→224). Pattern is impact, breathing room, impact.
- Type: use the `text-display-xl`, `text-display`, `text-h1`…`text-caption` utilities; they carry line height, tracking and weight. `h1–h3` in `font-display`, everything from `h4` down in `font-sans`, metadata in `font-mono` with `tabular-nums`.

## Homepage, section by section

Desktop spans below refer to the 12-column grid. Check each against the reference HTML.

1. **Header** (64px, 56px mobile). Wordmark left, nav centred (Work, Approach, About, Contact; current item gets a 1px `primary-text` underline and `aria-current`), "Start a project" small primary button right. Transparent over the hero with the top scrim; after scrolling past the hero it becomes `bg-background` with a bottom hairline. Mobile: wordmark + "Menu" text button opening a full-screen shadcn `Sheet` (solid background, no blur): Cormorant 44px links with mono indexes, full-width primary button at the bottom.
2. **Hero**, `100svh`. Muted looping video (`autoPlay muted loop playsInline`, poster), bottom scrim. Headline `text-display-xl` in two lines, cols 1–8. Intro + two buttons (primary with `btn-on-media`, secondary on-media variant) in cols 9–12, bottom aligned. Below, a hairline row: "Now showing" chip left, "Scroll" caption right. Mobile: "Now showing" chip moves to the top under the header; headline 54px, intro, two buttons side by side at 50/50.
3. **Selected work** (`id="work"`). Section header, then an editorial sequence, not a grid:
   - 01 wide feature, 2.39:1, full `container-wide` width, caption below.
   - 02 + 03 staggered pair: 16:9 in cols 1–8; 9:16 in cols 10–12 offset down ~200px.
   - 04 text + film split: text cols 1–4 (index line, title, description, two fact rows, watch link + tag), film 16:9 cols 6–12, vertically centred.
   - 05–07 row of three 9:16 verticals, cols 1–4 / 5–8 / 9–12, stepped down 0 / 64 / 128px. **Mobile: horizontal swipe** (`overflow-x-auto snap-x`, cards 250px wide so the next one peeks, "Swipe · 1 / 3" caption).
   - 08 full-bleed 2.39:1, no radius, caption in the page margin below. **Mobile: reframed to 4:5**, still full-bleed (serve a separate 4:5 crop).
   - 09 closing split: 16:9 film cols 1–7 + note and "All work (10)" secondary button cols 9–12.
4. **What I make**: typographic list of 5 formats, visually unlike the gallery. Row grid: mono index 56px · name in Cormorant 64px · one-line description · mono spec column right aligned. Hairlines between rows. Hover: index turns `primary-text`, name shifts 8px and turns `primary-text`. Mobile: index + 38px name, description and spec below.
5. **Approach** (`id="approach"`): 5 steps in 5 columns (real sequence, so numbers are allowed). `border-strong` rule on top; a 40px `primary-text` segment draws in on hover / in view. Mobile: vertical list.
6. **About** (`id="about"`): 4:5 portrait cols 1–3, lead + body cols 5–8, fact rows cols 10–12. Compact.
7. **Contact** (`id="contact"`, `py-section-lg`): eyebrow, "Have a film in mind?" in `fg-secondary`, the email in `text-display` (132px desktop, 42px mobile) with hairline underline that turns `primary-text` on hover, then primary "Start a project", a "Copy email" text link and the response-time caption. Copy uses `navigator.clipboard.writeText` with a select-text fallback and a short "Copied" tooltip; do not rely on `mailto:` alone.
8. **Footer**: wordmark + role + agency link cols 1–4, nav cols 5–8, social cols 9–12 right aligned, fine print row (© 2026 · Timișoara, "Back to top").

## Components to build

`components/site/`: `Header`, `MobileMenu`, `Wordmark`, `Eyebrow`, `SectionHeader`, `TextLink` (arrow), `Tag` (Commissioned has the plum dot), `MediaFrame` (ratio, poster, preview, play chip, states: default, hover, focus, loading, placeholder, private), `WorkCaption` (default and compact), `FormatRow`, `ProcessStep`, `FactRow`, `ContactBlock`, `Footer`, `HeroVideo`. Buttons use shadcn `Button` with our variants: `default` = plum primary, `outline` = secondary. Every state listed in `design-system/components/*.md` must exist, including focus-visible (2px `ring`, 3px offset) and disabled.

## Media implementation

- Posters: first graded frame, AVIF with WebP fallback, via `next/image` sized to the frame.
- Hover previews: muted 6–8 s loops, 720p, under 2 MB, `preload="none"`, start on hover/focus (desktop) or when 60% in view (mobile) via IntersectionObserver, pause when out of view.
- Hero video: `preload="metadata"`, poster shown until `canplaythrough`, then crossfade over `duration-media` with `ease-in-out-cine`.
- Loading state: poster + 1px `primary-text` progress line on the bottom edge. Missing film: placeholder frame (crop-mark corners, mono status line).
- Hover zoom: media scales to 1.03 over `duration-media` with `ease-cine`.

## Motion and accessibility

- Durations and easings are tokens in `globals.css`. Easings work as classes (`ease-cine`, `ease-standard`, `ease-in-out-cine`). Tailwind v4 has no duration theme namespace, so use the variables: `duration-(--duration-hover)`, `duration-(--duration-media)` and so on. No bounce, no parallax.
- Scroll reveals: 16px rise + fade, `duration-reveal`, 80ms stagger. Content must be visible without JS; only animate after an IntersectionObserver confirms.
- `prefers-reduced-motion`: already handled globally in `globals.css`. Additionally the hero must not autoplay; show the poster with a "Play film" button.
- Every interactive element is a real `<a>` or `<button>`. Menu sheet traps focus and closes on Esc. Hit targets at least 44px on mobile.
- All contrast pairs are listed in the header of `globals.css`. Do not introduce new text colors.

## SEO / GEO

- `metadata`: title "Yurii Tarasov, AI film & motion director", canonical `https://films.tarasovs.me`, Open Graph image 1200×630 from a film still.
- JSON-LD: `Person` (name, jobTitle, url, sameAs: Instagram, Vimeo, LinkedIn, tarasovs.me) and a `VideoObject` per film (name, description, thumbnailUrl, uploadDate, duration in ISO 8601, contentUrl or embedUrl).
- `sitemap.ts` and `robots.ts`. Semantic sections with the `id`s above; one `h1` (the hero headline).

## Open items (ask the owner, do not invent)

- Real film titles, runtimes, posters, previews and links (all in `content/site.ts` are placeholders).
- Contact email: currently `hello@tarasovs.me`; a personal address may replace it.
- Social URLs, portrait, "Start a project" destination (brief form or booking link).

## Done when

- Homepage matches both reference files at 1440 and 390, and holds up at 768 and 1024.
- No italic, no em dashes, no `text-primary`, no hardcoded colors outside `globals.css`.
- Lighthouse accessibility 100; hero text readable over the lightest footage.
- `prefers-reduced-motion` verified: no autoplay, no zoom, no reveal movement.
