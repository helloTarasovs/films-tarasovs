export type LinkItem = {
  label: string
  href: string
}

export type ProjectItem = {
  slug: string
  title: string
  category: string
  year: string
  summary: string
  /** Resolved image URL (Sanity asset URL or a local fallback path). */
  image: string
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
}

export type HomePageData = {
  heroEyebrow: string
  heroHeading: string
  heroParagraph: string
  primaryCta: LinkItem
  secondaryCta: LinkItem
  featuredHeading: string
  featuredLink: LinkItem
  statement: string
  featuredProjects: ProjectItem[]
}
