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

export type LinkResult = {
  label?: string
  href?: string
  openInNewTab?: boolean
}

export type SocialLinkResult = {
  platform?: string
  label?: string
  href?: string
}

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

export type SiteSettingsQueryResult = {
  title?: string
  role?: string
  email?: string
  location?: string
  navLinks?: LinkResult[]
  footerHeading?: string
  footerCtaLabel?: string
  footerCtaHref?: string
  footerNavHeading?: string
  footerNav?: LinkResult[]
  contactHeading?: string
  copyrightText?: string
  footerNote?: string
  socialsHeading?: string
  socials?: SocialLinkResult[]
} | null

export type HomePageQueryResult = {
  heroEyebrow?: string
  heroHeading?: string
  heroParagraph?: string
  primaryCta?: LinkResult
  secondaryCta?: LinkResult
  featuredHeading?: string
  featuredLink?: LinkResult
  statement?: string
  featuredProjects?: (ProjectResult | null)[]
  seoTitle?: string
  seoDescription?: string
  ogImage?: SanityImageWithAlt
} | null

export type ProjectsQueryResult = ProjectResult[] | null

/* -------------------- Normalized data used by components ------------------ */

export type LinkItem = {
  label: string
  href: string
  openInNewTab?: boolean
}

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

export type SiteSettings = {
  title: string
  role: string
  email: string
  location: string
  navLinks: LinkItem[]
  socials: LinkItem[]
  footerHeading: string
  footerCtaLabel: string
  footerCtaHref: string
  footerNavHeading: string
  footerNav: LinkItem[]
  socialsHeading: string
  contactHeading: string
  copyrightText: string
  footerNote: string
}

export type HomePageData = {
  heroEyebrow: string
  heroHeading: string
  heroParagraph: string
  primaryCta: LinkItem | null
  secondaryCta: LinkItem | null
  featuredHeading: string
  featuredLink: LinkItem | null
  statement: string
  featuredProjects: ProjectItem[]
  seo: {
    title?: string
    description?: string
    ogImage?: { url: string; alt: string; width: number; height: number }
  }
}
