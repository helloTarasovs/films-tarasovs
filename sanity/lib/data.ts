import 'server-only'
import { stegaClean } from 'next-sanity'
import { sanityFetch } from './fetch'
import { urlForImage } from './image'
import {
  homePageQuery,
  projectsQuery,
  siteSettingsQuery,
} from './queries'
import { socialPlatformTitle } from './socialPlatforms'
import type {
  HomePageData,
  HomePageQueryResult,
  LinkItem,
  LinkResult,
  ProjectItem,
  ProjectResult,
  ProjectsQueryResult,
  SiteSettings,
  SiteSettingsQueryResult,
  SocialLinkResult,
} from './types'
import { navLinks, projects as fallbackProjects, site } from '@/lib/site'

/*
 * Every getter below falls back field-by-field to the hardcoded content in
 * lib/site.ts, so the site stays complete when Sanity is not configured, a
 * document has not been published yet, a field is left empty, or a query fails.
 *
 * In draft mode, strings carry invisible stega markers for click-to-edit.
 * Values used as URLs, keys, or in <head> are cleaned so they stay valid.
 */

/* -------------------------------- Helpers ------------------------------- */

function toLink(link: LinkResult | null | undefined): LinkItem | null {
  const href = stegaClean(link?.href)?.trim()
  if (!link?.label?.trim() || !href) return null
  return { label: link.label, href, openInNewTab: Boolean(link.openInNewTab) }
}

function toLinks(links: (LinkResult | null)[] | null | undefined): LinkItem[] {
  return (links || []).map(toLink).filter((l): l is LinkItem => l !== null)
}

function toSocial(social: SocialLinkResult | null | undefined): LinkItem | null {
  const href = stegaClean(social?.href)?.trim()
  const label = social?.label?.trim()
    ? social.label
    : socialPlatformTitle(stegaClean(social?.platform))
  if (!href || !label) return null
  return { label, href, openInNewTab: true }
}

function toProject(p: ProjectResult | null | undefined): ProjectItem | null {
  const slug = stegaClean(p?.slug)
  if (!p || !slug || !p.title) return null
  return {
    slug,
    title: p.title,
    category: p.category || (p.services || []).filter(Boolean).join(' · '),
    year: p.year || '',
    summary: p.summary || '',
    // Cards render at 4:3, so crop server-side around the editor's hotspot.
    image: p.image?.asset
      ? urlForImage(p.image).width(1600).height(1200).fit('crop').url()
      : '',
    imageAlt: p.image?.alt ? stegaClean(p.image.alt) : undefined,
    featured: Boolean(p.featured),
  }
}

function toProjects(items: (ProjectResult | null)[] | null | undefined) {
  return (items || []).map(toProject).filter((p): p is ProjectItem => p !== null)
}

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
  footerNavHeading: 'Pages',
  footerNav: [],
  socialsHeading: 'Elsewhere',
  contactHeading: 'Contact',
  copyrightText: `${site.name}. All rights reserved.`,
  footerNote: `Designed & built in ${site.location}.`,
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await sanityFetch<SiteSettingsQueryResult>({
    query: siteSettingsQuery,
  })
  if (!data) return fallbackSettings

  const title = data.title || fallbackSettings.title
  const location = data.location || fallbackSettings.location
  const headerNav = toLinks(data.navLinks)
  const footerNav = toLinks(data.footerNav)
  const socials = (data.socials || [])
    .map(toSocial)
    .filter((s): s is LinkItem => s !== null)
  const footerCtaHref = stegaClean(data.footerCtaHref)?.trim()

  return {
    title,
    role: data.role || fallbackSettings.role,
    email: stegaClean(data.email)?.trim() || fallbackSettings.email,
    location,
    navLinks: headerNav.length ? headerNav : fallbackSettings.navLinks,
    socials: socials.length ? socials : fallbackSettings.socials,
    footerHeading: data.footerHeading || fallbackSettings.footerHeading,
    // Label and link fall back together so a CTA never points somewhere unexpected.
    footerCtaLabel:
      data.footerCtaLabel && footerCtaHref
        ? data.footerCtaLabel
        : fallbackSettings.footerCtaLabel,
    footerCtaHref:
      data.footerCtaLabel && footerCtaHref
        ? footerCtaHref
        : fallbackSettings.footerCtaHref,
    footerNavHeading: data.footerNavHeading || fallbackSettings.footerNavHeading,
    footerNav,
    socialsHeading: data.socialsHeading || fallbackSettings.socialsHeading,
    contactHeading: data.contactHeading || fallbackSettings.contactHeading,
    copyrightText:
      data.copyrightText || `${stegaClean(title)}. All rights reserved.`,
    footerNote:
      data.footerNote ||
      (location ? `Designed & built in ${stegaClean(location)}.` : ''),
  }
}

/* ------------------------------- Projects ------------------------------- */

export async function getProjects(): Promise<ProjectItem[]> {
  const data = await sanityFetch<ProjectsQueryResult>({ query: projectsQuery })
  const cleaned = toProjects(data)
  return cleaned.length ? cleaned : fallbackProjects
}

/* ------------------------------- Home page ------------------------------ */

const fallbackHome = {
  heroHeading: 'Designing quiet interfaces with a loud point of view.',
  heroParagraph: `I'm ${site.name}, a design engineer working at the seam of editorial craft and product thinking — building things that feel considered, from the first pixel to the last query.`,
  primaryCta: { label: 'View selected work', href: '/projects' },
  secondaryCta: { label: 'More about me', href: '/about' },
  featuredHeading: 'Selected work',
  featuredLink: { label: 'All projects', href: '/projects' },
  statement:
    'Good design is a quiet argument — made in type, space, and restraint — that the work respects the person on the other side of the screen.',
} satisfies Partial<HomePageData>

/**
 * Featured projects, in priority order:
 * 1. projects hand-picked on the Home Page document,
 * 2. projects with the "Featured" flag,
 * 3. the first two projects (the original hardcoded behaviour).
 */
async function getFeaturedProjects(
  picked: (ProjectResult | null)[] | null | undefined,
): Promise<ProjectItem[]> {
  const handPicked = toProjects(picked)
  if (handPicked.length) return handPicked.slice(0, 4)

  const all = await getProjects()
  const flagged = all.filter((p) => p.featured)
  return flagged.length ? flagged.slice(0, 4) : all.slice(0, 2)
}

export async function getHomePage(): Promise<HomePageData> {
  const [data, settings] = await Promise.all([
    sanityFetch<HomePageQueryResult>({ query: homePageQuery }),
    getSiteSettings(),
  ])

  const ogImage = data?.ogImage?.asset
    ? {
        url: urlForImage(data.ogImage).width(1200).height(630).fit('crop').url(),
        alt: stegaClean(data.ogImage.alt) || stegaClean(settings.title),
        width: 1200,
        height: 630,
      }
    : undefined

  return {
    heroEyebrow: data?.heroEyebrow || settings.role,
    heroHeading: data?.heroHeading || fallbackHome.heroHeading,
    heroParagraph: data?.heroParagraph || fallbackHome.heroParagraph,
    primaryCta: toLink(data?.primaryCta) ?? fallbackHome.primaryCta,
    secondaryCta: toLink(data?.secondaryCta) ?? fallbackHome.secondaryCta,
    featuredHeading: data?.featuredHeading || fallbackHome.featuredHeading,
    featuredLink: toLink(data?.featuredLink) ?? fallbackHome.featuredLink,
    statement: data?.statement || fallbackHome.statement,
    featuredProjects: await getFeaturedProjects(data?.featuredProjects),
    seo: {
      title: stegaClean(data?.seoTitle)?.trim() || undefined,
      description: stegaClean(data?.seoDescription)?.trim() || undefined,
      ogImage,
    },
  }
}
