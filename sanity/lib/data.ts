import 'server-only'
import { sanityFetch } from './fetch'
import {
  homePageQuery,
  projectsQuery,
  siteSettingsQuery,
} from './queries'
import type { HomePageData, ProjectItem, SiteSettings } from './types'
import { navLinks, projects as fallbackProjects, site } from '@/lib/site'

/* --------------------------------- Site --------------------------------- */

const fallbackSettings: SiteSettings = {
  title: site.name,
  role: site.role,
  email: site.email,
  location: site.location,
  navLinks,
  socials: site.socials,
  footerHeading: 'Have a project in mind?',
  footerCtaLabel: 'Start a conversation',
  footerCtaHref: '/contact',
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await sanityFetch<Partial<SiteSettings>>({
    query: siteSettingsQuery,
  })
  if (!data) return fallbackSettings

  return {
    title: data.title || fallbackSettings.title,
    role: data.role || fallbackSettings.role,
    email: data.email || fallbackSettings.email,
    location: data.location || fallbackSettings.location,
    navLinks: data.navLinks?.length ? data.navLinks : fallbackSettings.navLinks,
    socials: data.socials?.length ? data.socials : fallbackSettings.socials,
    footerHeading: data.footerHeading || fallbackSettings.footerHeading,
    footerCtaLabel: data.footerCtaLabel || fallbackSettings.footerCtaLabel,
    footerCtaHref: data.footerCtaHref || fallbackSettings.footerCtaHref,
  }
}

/* ------------------------------- Projects ------------------------------- */

function normalizeProjects(items: ProjectItem[] | null | undefined): ProjectItem[] {
  const cleaned = (items || []).filter((p) => p && p.slug && p.title)
  return cleaned.length ? cleaned : fallbackProjects
}

export async function getProjects(): Promise<ProjectItem[]> {
  const data = await sanityFetch<ProjectItem[]>({ query: projectsQuery })
  return normalizeProjects(data)
}

/* ------------------------------- Home page ------------------------------ */

const fallbackHome: HomePageData = {
  heroEyebrow: site.role,
  heroHeading: 'Designing quiet interfaces with a loud point of view.',
  heroParagraph: `I'm ${site.name}, a design engineer working at the seam of editorial craft and product thinking — building things that feel considered, from the first pixel to the last query.`,
  primaryCta: { label: 'View selected work', href: '/projects' },
  secondaryCta: { label: 'More about me', href: '/about' },
  featuredHeading: 'Selected work',
  featuredLink: { label: 'All projects', href: '/projects' },
  statement:
    'Good design is a quiet argument — made in type, space, and restraint — that the work respects the person on the other side of the screen.',
  featuredProjects: fallbackProjects.slice(0, 2),
}

export async function getHomePage(): Promise<HomePageData> {
  const data = await sanityFetch<Partial<HomePageData>>({ query: homePageQuery })
  if (!data) return fallbackHome

  const featured = normalizeProjects(data.featuredProjects).slice(0, 4)

  return {
    heroEyebrow: data.heroEyebrow || fallbackHome.heroEyebrow,
    heroHeading: data.heroHeading || fallbackHome.heroHeading,
    heroParagraph: data.heroParagraph || fallbackHome.heroParagraph,
    primaryCta: data.primaryCta?.label
      ? data.primaryCta
      : fallbackHome.primaryCta,
    secondaryCta: data.secondaryCta?.label
      ? data.secondaryCta
      : fallbackHome.secondaryCta,
    featuredHeading: data.featuredHeading || fallbackHome.featuredHeading,
    featuredLink: data.featuredLink?.label
      ? data.featuredLink
      : fallbackHome.featuredLink,
    statement: data.statement || fallbackHome.statement,
    featuredProjects: data.featuredProjects?.length
      ? featured
      : fallbackHome.featuredProjects,
  }
}
