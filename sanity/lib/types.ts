import type { SanityImageCrop, SanityImageHotspot } from '@sanity/image-url'

/* ------------------------- Raw GROQ query results ------------------------ */
// Shapes returned by the queries in ./queries.ts. Every field is optional
// because documents may be incomplete or not exist yet.

export type SanityImageWithAlt = {
  asset?: { _ref: string; _type: 'reference' }
  crop?: SanityImageCrop
  hotspot?: SanityImageHotspot
  alt?: string
}

export type LinkResult = { label?: string; href?: string }

export type SocialLinkResult = { platform?: string; label?: string; href?: string }

export type FilmResult = {
  _id: string
  slug?: string
  title?: string
  category?: string
  kind?: string
  ratio?: string
  runtime?: string
  year?: string
  summary?: string
  role?: string
  poster?: SanityImageWithAlt
  previewUrl?: string
  projectUrl?: string
}

export type SiteSettingsQueryResult = {
  title?: string
  descriptor?: string
  role?: string
  email?: string
  location?: string
  startProject?: LinkResult
  navLinks?: (LinkResult | null)[]
  agency?: LinkResult
  socials?: (SocialLinkResult | null)[]
} | null

export type HomePageQueryResult = {
  heroLines?: string[]
  heroIntro?: string
  heroIntroMobile?: string
  heroVideoUrl?: string
  heroPoster?: SanityImageWithAlt
  nowShowing?: { title?: string; category?: string; runtime?: string } | null
  workHeading?: string
  workHeadingContrast?: string
  workNote?: string
  workNoteMobile?: string
  films?: (FilmResult | null)[]
  phoneLabel?: string
  archiveNote?: string
  formatsHeading?: string
  formatsHeadingContrast?: string
  formatsNote?: string
  formats?: ({ name?: string; description?: string; spec?: string[] } | null)[]
  approachHeading?: string
  approachHeadingContrast?: string
  approachNote?: string
  approachSteps?: ({ name?: string; line?: string } | null)[]
  aboutLead?: string
  aboutBody?: string
  aboutPortrait?: SanityImageWithAlt
  aboutFacts?: ({ label?: string; value?: string } | null)[]
  contactLead?: string
  contactResponse?: string
  seoTitle?: string
  seoDescription?: string
  ogImage?: SanityImageWithAlt
} | null

export type FilmsQueryResult = FilmResult[] | null

/* ------------------------------ /projects page ----------------------------- */

export type ProjectResult = {
  _id: string
  slug?: string
  title?: string
  category?: string
  services?: string[]
  year?: string
  summary?: string
  featured?: boolean
  image?: SanityImageWithAlt
}

export type ProjectsQueryResult = ProjectResult[] | null

export type ProjectItem = {
  slug: string
  title: string
  category: string
  year: string
  summary: string
  /** Resolved image URL (Sanity asset URL or a local fallback path). */
  image: string
  imageAlt?: string
  featured?: boolean
}
