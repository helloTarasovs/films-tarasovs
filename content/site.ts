// Homepage content (from docs/design-handoff/content/site.ts).
// Film titles, runtimes and descriptions are PLACEHOLDERS: replace with the
// real films before launch. Keep the shape.

export type Ratio = '16:9' | '2.39:1' | '9:16' | '4:5'
export type Tag = 'Commissioned' | 'Self-initiated'

export interface Film {
  index: string // "01"
  slug: string
  title: string
  category: string // "Launch film"
  ratio: Ratio
  runtime: string // "01:24"
  tag: Tag
  poster: string // first graded frame (AVIF/WebP); "" until provided
  preview?: string // muted 6–8 s loop, 720p, < 2 MB
  href: string // film page, player overlay or file; "#" = not available yet
  description?: string // only used by the text + film split
  role?: string
  year?: string
}

const email = 'hello@tarasovs.me'

// Hero test loop (peony), hosted on the CDN.
const peonyLoop =
  'https://d8j0ntlcm91z4.cloudfront.net/user_3HK2ifWAauCzByUyVXvhTbH3EUO/hf_20260804_122601_b8cbf433-81c5-4224-b42d-80037ca19d51.mp4'

export const site = {
  name: 'Yurii Tarasov',
  descriptor: 'Films',
  domain: 'films.tarasovs.me',
  url: 'https://films.tarasovs.me',
  role: 'AI film & motion director',
  email,
  // Every primary contact button goes to the contact page.
  startProject: {
    label: 'Discuss your film',
    href: '/contact',
  },
  agency: { label: 'Part of Tarasovs Digital Agency', href: 'https://tarasovs.me' },
  location: 'Timișoara',
  social: [
    { label: 'Instagram', href: '#' }, // TODO
    { label: 'Vimeo', href: '#' }, // TODO
    { label: 'LinkedIn', href: '#' }, // TODO
  ],
  nav: [
    { label: 'Work', href: '/#work', id: 'work' },
    { label: 'Approach', href: '/#approach', id: 'approach' },
    { label: 'About', href: '/#about', id: 'about' },
    { label: 'Contact', href: '/contact', id: 'contact' },
  ],
}

export const hero = {
  headline: ['Directed films,', 'made with AI.'], // two lines, both roman, no italic
  intro:
    'I direct product and brand films for teams who want a picture people remember. Every shot is directed first, then generated, cut and scored.',
  introMobile: 'Product and brand films for teams who want a picture people remember.',
  primary: { label: 'View the work', href: '#work' },
  nowShowing: { title: 'Bloom', note: 'motion study', runtime: '00:42' },
  video: { src: peonyLoop, poster: '' },
}

export const selectedWork = {
  eyebrow: 'Selected work',
  heading: 'Nine films.',
  headingContrast: 'Each one directed.',
  note: 'Commissioned and self-initiated work, 2024–2026. Hover to preview, click to watch with sound.',
  noteMobile: 'Commissioned and self-initiated, 2024–2026. Tap to watch with sound.',
  phoneLabel: 'Made for the phone',
  archiveNote: 'Case notes, stills and credits for every film live in the archive.',
  archiveCta: { label: 'All work (10)', href: '' }, // archive page not built yet
  empty: 'New films are being added. Write to me to see recent work.',
}

/**
 * The films below are layout placeholders (invented titles). They render only
 * in local preview (next dev) or with SHOW_WORK_PLACEHOLDERS=true, never in a
 * production build. Set to false once real films replace them.
 */
export const filmsArePlaceholders = true

// Order matters: it defines the editorial sequence.
export const films: Film[] = [
  { index: '01', slug: 'northlight', title: 'Northlight', category: 'Launch film', ratio: '2.39:1', runtime: '01:24', tag: 'Commissioned', poster: '', href: '#' },
  { index: '02', slug: 'glasshouse', title: 'Glasshouse', category: 'Product film', ratio: '16:9', runtime: '01:05', tag: 'Commissioned', poster: '', href: '#' },
  { index: '03', slug: 'field-notes', title: 'Field Notes', category: 'Social series', ratio: '9:16', runtime: '0:15', tag: 'Commissioned', poster: '', href: '#' },
  { index: '04', slug: 'salt-and-silk', title: 'Salt & Silk', category: 'Brand film', ratio: '16:9', runtime: '02:10', tag: 'Self-initiated', poster: '', href: '#', year: '2026',
    description: 'A textile house wanted its fabric to feel touched, not shown. I built every shot around light moving across the weave, and cut to the rhythm of the loom.',
    role: 'Direction, edit, sound' },
  { index: '05', slug: 'low-orbit', title: 'Low Orbit', category: 'Launch teaser', ratio: '9:16', runtime: '0:15', tag: 'Commissioned', poster: '', href: '#' },
  { index: '06', slug: 'understory', title: 'Understory', category: 'Brand cutdown', ratio: '9:16', runtime: '0:22', tag: 'Commissioned', poster: '', href: '#' },
  { index: '07', slug: 'nocturne', title: 'Nocturne', category: 'Motion study', ratio: '9:16', runtime: '0:12', tag: 'Self-initiated', poster: '', href: '#' },
  // Real footage: the peony loop, used as the full-bleed moment.
  { index: '08', slug: 'bloom', title: 'Bloom', category: 'Motion identity study', ratio: '2.39:1', runtime: '00:42', tag: 'Self-initiated', poster: '', preview: peonyLoop, href: peonyLoop },
  { index: '09', slug: 'tidewater', title: 'Tidewater', category: 'Brand film', ratio: '16:9', runtime: '01:30', tag: 'Commissioned', poster: '', href: '#' },
]

export const formats = {
  eyebrow: 'What I make',
  heading: 'Five formats.',
  headingContrast: 'One way of directing.',
  note: 'Each starts with a treatment and ends with a graded master, sized for where it will play.',
  noteMobile: 'Each starts with a treatment and ends with a graded master.',
  items: [
    { name: 'Product films', description: 'One object, lit and moved like it matters. For launches, product pages and paid.', spec: ['16:9 · 2.39:1', '0:30 – 1:30'] },
    { name: 'Brand films', description: 'A mood and a point of view, carried by picture and sound rather than claims.', spec: ['16:9 · 2.39:1', '1:00 – 3:00'] },
    { name: 'Launch visuals', description: 'Hero loops, keynote openers and stills cut from the same world.', spec: ['16:9 · 4K loops', '0:06 – 0:30'] },
    { name: 'Social & vertical', description: 'Cutdowns and native verticals, framed for the phone from the first shot.', spec: ['9:16 · 4:5', '0:06 – 0:45'] },
    { name: 'Motion identity', description: 'Logo animation, idents and a motion language the brand can reuse.', spec: ['16:9 · 1:1', '0:03 – 0:15'] },
  ],
}

export const approach = {
  eyebrow: 'Approach',
  heading: 'Directed first.',
  headingContrast: 'Generated second.',
  note: 'The tools change every month. The order of work does not.',
  steps: [
    { name: 'Direction', line: 'A written treatment and shot list before anything is generated.' },
    { name: 'Visual development', line: 'Look frames, characters and light, locked before any motion.' },
    { name: 'Editing', line: 'Cut for rhythm first, then for story, then for length.' },
    { name: 'Sound', line: 'Score, sound design and mix built to the picture, never added last.' },
    { name: 'Finishing', line: 'Upscale, grade and delivery masters for every placement.' },
  ],
}

export const about = {
  eyebrow: 'About',
  lead: 'I’m Yurii, a film and motion director working with AI as a camera, not a shortcut.',
  body: 'Before films I spent years in brand, web and motion design, so I think about where a film will live as much as how it looks. I work directly with brands, agencies and creative teams, alone or inside theirs.',
  portrait: '', // TODO: 4:5 portrait; placeholder frame until then
  facts: [
    { label: 'Based in', value: 'Timișoara, Romania' },
    { label: 'Works with', value: 'Brands, agencies, creative teams' },
    { label: 'Languages', value: 'English, Ukrainian, Russian' },
  ],
}

export const contact = {
  eyebrow: 'Contact',
  lead: 'Have a film in mind?',
  copyLabel: 'Copy email',
  copiedLabel: 'Copied',
  response: 'Replies within two working days',
  responseMobile: 'Replies in 2 working days',
}

export const showPlaceholders =
  process.env.NODE_ENV === 'development' || process.env.SHOW_WORK_PLACEHOLDERS === 'true'

/** Films to render: placeholders only in local preview. */
export function getFilms(): Film[] {
  if (!filmsArePlaceholders) return films
  return showPlaceholders ? films : []
}

/* ------------------------------------------------------------------------ */
/* Aggregate shape shared by the Sanity layer (sanity/lib/data.ts) and the  */
/* components. The values above are the fallbacks for every field.          */
/* ------------------------------------------------------------------------ */

export type SiteInfo = typeof site
export type NavItem = SiteInfo['nav'][number]
export type LinkValue = { label: string; href: string }

export type SiteContent = {
  site: SiteInfo
  hero: typeof hero
  selectedWork: typeof selectedWork
  films: Film[]
  /** True when `films` are the invented layout placeholders above. */
  filmsArePlaceholders: boolean
  formats: typeof formats
  approach: typeof approach
  about: typeof about
  contact: typeof contact
  seo: {
    title?: string
    description?: string
    ogImage?: { url: string; alt: string; width: number; height: number }
  }
}

export const defaultContent: SiteContent = {
  site,
  hero,
  selectedWork,
  films: getFilms(),
  filmsArePlaceholders,
  formats,
  approach,
  about,
  contact,
  seo: {},
}
