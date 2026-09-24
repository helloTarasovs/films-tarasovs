Screening Room is the interface for an AI film and motion director's portfolio. It works like a cinema: a dark, warm room where the films are the only bright thing. Every rule below serves that. If a choice makes the interface more noticeable than the work, it is the wrong choice.

## Point of view

- The films are the event. UI sits in `foreground`, `fg-secondary` and one plum accent. Plum is rare in film sites and far from the warm pastels of typical footage, so it reads as a signature, not a filter. Nothing else competes with the footage.
- Confidence comes from scale and restraint, not effects. Big Cormorant headlines, generous section spacing, hairlines instead of boxes.
- Rhythm is impact, then breathing room, then impact: a full-bleed film, a quiet text section, the next film.
- Never: neon gradients, glowing "AI" graphics, glassmorphism, decorative blobs, stock-tech imagery, identical card grids, a second accent.

## Voice

Write like a director talking to a producer. Short, concrete, first person.

- Name the craft, not the tool: "Directed films, made with AI." not "AI-powered video solutions".
- Sentence case everywhere except `label` (uppercase through CSS, never typed in caps).
- Buttons start with a verb and say what happens: "View the work", "Start a project", "Watch film", "Copy email".
- Metadata is factual and mono: `2.39:1 · 01:24 · 2026`.
- No emoji. No exclamation marks.

## Typography

Pair **Cormorant** (display and headings) with **Inter** (UI and body), plus **IBM Plex Mono** for metadata only. All three are free on Google Fonts and all three include Cyrillic.

**Why this pairing.** Cormorant is a Garamond descendant drawn for display sizes: tall ascenders, sharp high-contrast serifs and the calm proportions of a film title card. At 100px+ it looks expensive and quiet at the same time. Inter stays neutral and precise at small sizes, which is what navigation, captions and forms need. The contrast between the two is wide enough that neither feels like a compromise. Plex Mono gives runtimes and ratios the feel of a slate or an edit decision list.

**Fraunces and Inter: keep one, swap one.** Keep Inter. It does its job and the site is already built around it. Replace Fraunces. Its soft, rounded "wonk" details read friendly and bookish rather than cinematic, and Google Fonts serves it without Cyrillic, which you said you prefer. Cormorant keeps the same editorial serif idea, so the site evolves rather than changes character. If Cyrillic stops mattering and you want to keep Fraunces, set it with `opsz` at max, `SOFT` 0 and `WONK` 0 so it sharpens up.

Rules:
- `display-xl` for the hero headline only. `display` for the contact email. `h1`–`h3` in Cormorant; `h4` and everything smaller in Inter.
- Cormorant below 32px uses weight 600 (`h3`); it gets too thin at 500.
- No italic. When a heading needs a second, quieter phrase, set it in the same roman face in `fg-secondary` (`h2-contrast`), at most once per section.
- `label` is Inter 500, 0.16em tracking, uppercase. `caption` is Plex Mono with tabular figures.
- Running text never wider than `measure` (38rem). Headings use `text-wrap: balance`.

| Style | 390px | 1440px | Line height | Tracking | Weight | Case |
|---|---|---|---|---|---|---|
| display-xl | 52 | 152 | 0.92 | −0.02em | 500 | Sentence |
| display | 44 | 104 | 0.95 | −0.018em | 500 | Sentence |
| h1 | 36 | 72 | 1.00 | −0.015em | 500 | Sentence |
| h2 / h2-contrast | 30 | 52 | 1.05 | −0.01em | 500 | Sentence |
| h3 | 24 | 32 | 1.15 | −0.005em | 600 | Sentence / title |
| h4 (Inter) | 17 | 20 | 1.30 | −0.01em | 500 | Sentence |
| body-l | 18 | 21 | 1.55 | −0.005em | 400 | Sentence |
| body-m | 16 | 17 | 1.60 | 0 | 400 | Sentence |
| body-s | 14 | 15 | 1.55 | 0 | 400 | Sentence |
| label | 11 | 12 | 1.20 | 0.16em | 500 | UPPERCASE |
| caption (mono) | 12 | 13 | 1.40 | 0.02em | 400 | As written |

The `clamp()` values for each are in the token usage notes and in the Code export section.

## Color

Dark-first and single-theme on purpose: a screening room has no light mode. Every neutral carries a small warm bias (hue 60–85) so the page reads as walnut and paper, not grey.

- Layers: `background` → `card` → `popover`. Separation comes from lightness steps and hairlines, never shadows (`shadow-overlay` is for menus and dialogs only).
- Text: `foreground` for anything that matters, `fg-secondary` for supporting copy, `muted-foreground` for metadata.
- Plum is the single accent, in two strengths of the same hue: `primary` (fill) and `primary-text` (text and thin marks). The fill is only 3.00:1 on the page, so it is never used as text. `primary` fills the primary button, the play chip on hover and text selection. `primary-text` draws the eyebrow rule, the current nav line, link and title hover, the Commissioned dot and the focus ring. Never as a large fill behind content.
- shadcn's `--accent` is its neutral hover surface, not the brand accent. It maps to the overlay layer here. Plum lives on `--primary`; its text strength is the extra `--primary-text`.
- `destructive` and `success` always travel with a text message.

**Contrast (WCAG 2.x, computed from the OKLCH values)**

| Text | on background | on card | on popover |
|---|---|---|---|
| foreground | 16.65 | 15.58 | 14.21 |
| fg-secondary | 11.01 | 10.30 | 9.40 |
| muted-foreground | 7.04 | 6.59 | 6.01 |
| primary-text (light plum) | 6.81 | 6.37 | 5.81 |
| destructive | 6.86 | 6.42 | 5.86 |
| success | 9.55 | 8.94 | 8.15 |

- Cream `primary-foreground` on `primary` 5.55, on `primary-hover` 4.90, on `primary-pressed` 6.56. The `primary` fill edge against `background` is 3.00 (non-text).
- `input` border 3.40:1 and `ring` 6.81:1 against `background` (non-text minimum is 3:1).
- `border` (12%) and `border-strong` (24%) are decorative only and never the sole affordance.
- `fg-disabled` is 3.55:1. Disabled text is exempt from 1.4.3, and always has a second cue.

## Text over video

The hero footage can be pastel peonies or night exteriors, so the rule has to work on both without tuning per clip.

1. Bottom scrim in `scrim` (warm black), eased: 74% at 0, 62% at 40% of the height, 30% at 60%, 8% at 78%, 0 at 90%.
2. All copy sits in the bottom 40% of the frame, inside the ≥62% band.
3. Only `foreground` over video. Worst case, a near-white pixel under 62% scrim, gives 5.35:1. `fg-secondary` would drop to 3.54, so it is not used on footage. Plum never appears as text over video. The plum primary button keeps a 1px cream edge there, because its fill is 1.04:1 against the scrim.
4. Small captions such as "Now showing" sit on their own solid 70% scrim chip, in cream. Plum only as the dot.
5. Top scrim for the header: 50% to 0 over 160px.

It stays clean because the scrim is warm black matched to the page and the stops are eased, so light footage darkens instead of turning beige. No blur, no text shadow, no grey overlay.

## Space and layout

4px base unit. Component spacing uses the fixed `space-*` steps; page structure uses three fluid tokens.

| Token | 390px | 1440px | Use |
|---|---|---|---|
| margin | 20px | 64px | Page side margin |
| gutter | 12px | 24px | Column gutter |
| section-sm | 64px | 96px | Quiet sections: About, Approach |
| section | 96px | 160px | Standard sections |
| section-lg | 128px | 224px | Around full-bleed films and the contact close |

**Grid.** 12 columns at every size, so spans stay predictable.

| Breakpoint | Width | Margin | Gutter | Typical span |
|---|---|---|---|---|
| Mobile | < 768 | 20px | 12px | 12 (full) or 6+6 |
| Tablet | 768–1279 | 40px | 20px | 8 for text, 12 for media |
| Desktop | ≥ 1280 | 64px | 24px | 7 for headings, 5 for notes |

**Containers.** `container-text` 72rem for text and captions. `container-wide` 88rem for featured media. Full-bleed for one film per page section group, edge to edge, no radius.

## Shape, lines, elevation

- Radius: `radius-media` 2px on frames, `radius-control` 4px on buttons and inputs, `radius-tag` pill on tags only. Full-bleed media uses 0.
- Lines: 1px only. `border` for dividers, `border-strong` for tags and link underlines, `input` for control borders.
- Elevation: none on the page. Menus and dialogs get `popover` plus `shadow-overlay`.

## Motion

Slow, soft and linear in feeling, like a dissolve. No bounce, no overshoot, no parallax.

- Hover colour changes: `duration-hover` 180ms, `ease-standard`.
- Arrows and menu: `duration-ui` 280ms, `ease-cine`.
- Reveal on scroll: `duration-reveal` 800ms, `ease-cine`, 16px rise plus fade, `duration-stagger` 80ms between siblings. Content is visible by default and only animates when JS confirms it is in view.
- Media: hover zoom to 1.03 and poster-to-video crossfade over `duration-media` 1400ms.
- **Reduced motion:** no transforms, zoom or reveal movement; colour and opacity transitions stay at 120ms; the hero shows its poster with a "Play film" button instead of autoplaying.

## Media

- Frames: 16:9 (default), 2.39:1 (features, full-bleed), 9:16 (verticals), 4:5 (social cutdowns).
- Poster: the first graded frame, AVIF with WebP fallback, sized to the frame. It is shown until the video can play through, then crossfades.
- Hover previews: muted 6–8s loops, 720p, under 2 MB. Full films open in a player overlay or the film page.
- Play affordance: mono chip bottom-left with runtime. The whole frame is the link.
- Loading: poster plus a 1px `primary-text` line on the bottom edge. Placeholder: `card` fill, crop-mark corners and a mono status line ("16:9 · Film in edit").

## Wordmark and brand

This is a personal director brand that lives at films.tarasovs.me. The person leads; the agency is credited, not featured.

- Wordmark: "Yurii Tarasov" in Cormorant 600, then a 1px `border-strong` rule, then "Films" in `label` style. No symbol, no monogram in the header.
- The agency appears once, in the footer: "Part of Tarasovs Digital Agency", linking to tarasovs.me. Copy stays first person ("I direct"), never "we".
- The plum accent sits in the same colour family as the agency's violet, so the two feel related without the film site borrowing the agency's palette.

## Iconography

Almost none. A 14px arrow (1.25px stroke, square caps) for links, a filled triangle in the play chip, and two hairlines for the mobile menu. No icon library, no emoji. Draw icons in `currentColor` inline so they follow text colour.
