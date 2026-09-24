import 'server-only'
import { cache } from 'react'
import { stegaClean } from 'next-sanity'
import { sanityFetch } from './fetch'
import { urlForImage } from './image'
import { filmsQuery, homePageQuery, projectsQuery, siteSettingsQuery } from './queries'
import { socialPlatformTitle } from './socialPlatforms'
import type {
  FilmResult,
  FilmsQueryResult,
  HomePageQueryResult,
  LinkResult,
  ProjectItem,
  ProjectResult,
  ProjectsQueryResult,
  SanityImageWithAlt,
  SiteSettingsQueryResult,
  SocialLinkResult,
} from './types'
import {
  defaultContent,
  type Film,
  type LinkValue,
  type NavItem,
  type Ratio,
  type SiteContent,
} from '@/content/site'
import { projects as fallbackProjects } from '@/lib/site'

/*
 * Every value falls back field-by-field to content/site.ts, so the site stays
 * complete when Sanity is not configured, a document is unpublished, a field is
 * empty, or a query fails.
 *
 * In draft mode, strings carry invisible stega markers for click-to-edit.
 * Values used as URLs, keys or in <head> are cleaned so they stay valid.
 */

/* -------------------------------- Helpers ------------------------------- */

const text = (value: string | undefined | null, fallback: string) =>
  value && value.trim() ? value : fallback

const url = (value: string | undefined | null) => stegaClean(value)?.trim() || ''

function toLink(link: LinkResult | null | undefined): LinkValue | null {
  const href = url(link?.href)
  if (!link?.label?.trim() || !href) return null
  return { label: link.label, href }
}

function toSocial(social: SocialLinkResult | null | undefined): LinkValue | null {
  const href = url(social?.href)
  const label = social?.label?.trim() ? social.label : socialPlatformTitle(stegaClean(social?.platform))
  return href && label ? { label, href } : null
}

function toNav(link: LinkResult | null): NavItem | null {
  const value = toLink(link)
  if (!value) return null
  // The section id drives the header's scroll-spy ("/#work" → "work").
  return { ...value, id: value.href.split('#')[1] ?? value.href }
}

function compact<T>(items: (T | null | undefined)[] | null | undefined): T[] {
  return (items || []).filter((item): item is T => item !== null && item !== undefined)
}

const ratioSize: Record<Ratio, [number, number]> = {
  '16:9': [1600, 900],
  '2.39:1': [2000, 837],
  '9:16': [900, 1600],
  '4:5': [1200, 1500],
}

const isRatio = (value: string): value is Ratio => value in ratioSize

/** Poster cropped to the frame's ratio around the editor's hotspot. */
function imageUrl(image: SanityImageWithAlt | undefined, ratio?: Ratio) {
  if (!image?.asset) return ''
  const builder = urlForImage(image)
  if (!ratio) return builder.width(2400).url()
  const [w, h] = ratioSize[ratio]
  return builder.width(w).height(h).fit('crop').url()
}

function toFilm(film: FilmResult | null, position: number): Film | null {
  const slug = stegaClean(film?.slug)
  if (!film || !slug || !film.title) return null
  const ratio = stegaClean(film.ratio) ?? ''
  const safeRatio: Ratio = isRatio(ratio) ? ratio : '16:9'
  return {
    index: String(position + 1).padStart(2, '0'),
    slug,
    title: film.title,
    category: film.category || '',
    ratio: safeRatio,
    runtime: film.runtime || '',
    tag: stegaClean(film.kind) === 'commissioned' ? 'Commissioned' : 'Self-initiated',
    poster: imageUrl(film.poster, safeRatio),
    preview: url(film.previewUrl) || undefined,
    href: url(film.projectUrl) || '#',
    description: film.summary || undefined,
    role: film.role || undefined,
    year: film.year || undefined,
  }
}

function toFilms(items: (FilmResult | null)[] | null | undefined) {
  return compact((items || []).map((film, i) => toFilm(film, i)))
}

/* ------------------------------- Site content ------------------------------ */

/**
 * Everything the homepage, header and footer render. Cached per request, so the
 * layout, the page and generateMetadata share one set of queries.
 */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const [settings, home] = await Promise.all([
    sanityFetch<SiteSettingsQueryResult>({ query: siteSettingsQuery }),
    sanityFetch<HomePageQueryResult>({ query: homePageQuery }),
  ])
  const d = defaultContent

  // Films: hand-picked on the Home Page, else by Display order; else placeholders.
  let films = toFilms(home?.films)
  if (!films.length) films = toFilms(await sanityFetch<FilmsQueryResult>({ query: filmsQuery }))
  const realFilms = films.length > 0

  const nav = compact((settings?.navLinks || []).map(toNav))
  const socials = compact((settings?.socials || []).map(toSocial))
  const email = url(settings?.email) || d.site.email
  const startProject = toLink(settings?.startProject)
  const agency = toLink(settings?.agency)
  const heroLines = compact(home?.heroLines).filter((l) => l.trim())
  const formats = compact(home?.formats).filter((f) => f.name?.trim())
  const steps = compact(home?.approachSteps).filter((s) => s.name?.trim())
  const facts = compact(home?.aboutFacts).filter((f) => f.label?.trim() && f.value?.trim())
  const ogImage = home?.ogImage?.asset
    ? {
        url: urlForImage(home.ogImage).width(1200).height(630).fit('crop').url(),
        alt: stegaClean(home.ogImage.alt) || stegaClean(settings?.title) || d.site.name,
        width: 1200,
        height: 630,
      }
    : undefined

  return {
    site: {
      ...d.site,
      name: text(settings?.title, d.site.name),
      descriptor: text(settings?.descriptor, d.site.descriptor),
      role: text(settings?.role, d.site.role),
      email,
      location: text(settings?.location, d.site.location),
      startProject: startProject ?? {
        label: d.site.startProject.label,
        // Keep the default mail link pointed at the (possibly edited) address.
        href: `mailto:${email}?subject=${encodeURIComponent('New project')}`,
      },
      agency: agency ?? d.site.agency,
      social: socials.length ? socials : d.site.social,
      nav: nav.length ? nav : d.site.nav,
    },
    hero: {
      ...d.hero,
      headline: heroLines.length ? heroLines : d.hero.headline,
      intro: text(home?.heroIntro, d.hero.intro),
      introMobile: text(home?.heroIntroMobile, home?.heroIntro?.trim() ? home.heroIntro : d.hero.introMobile),
      nowShowing: home?.nowShowing?.title
        ? {
            title: home.nowShowing.title,
            note: (home.nowShowing.category || '').toLowerCase(),
            runtime: home.nowShowing.runtime || '',
          }
        : d.hero.nowShowing,
      video: {
        src: url(home?.heroVideoUrl) || d.hero.video.src,
        poster: imageUrl(home?.heroPoster) || d.hero.video.poster,
      },
    },
    selectedWork: {
      ...d.selectedWork,
      heading: text(home?.workHeading, d.selectedWork.heading),
      headingContrast: home?.workHeading?.trim()
        ? home.workHeadingContrast || ''
        : d.selectedWork.headingContrast,
      note: text(home?.workNote, d.selectedWork.note),
      noteMobile: text(home?.workNoteMobile, home?.workNote?.trim() ? home.workNote : d.selectedWork.noteMobile),
      phoneLabel: text(home?.phoneLabel, d.selectedWork.phoneLabel),
      archiveNote: text(home?.archiveNote, d.selectedWork.archiveNote),
    },
    films: realFilms ? films : d.films,
    filmsArePlaceholders: realFilms ? false : d.filmsArePlaceholders,
    formats: {
      ...d.formats,
      heading: text(home?.formatsHeading, d.formats.heading),
      headingContrast: home?.formatsHeading?.trim() ? home.formatsHeadingContrast || '' : d.formats.headingContrast,
      note: text(home?.formatsNote, d.formats.note),
      noteMobile: home?.formatsNote?.trim() ? home.formatsNote : d.formats.noteMobile,
      items: formats.length
        ? formats.map((f) => ({ name: f.name!, description: f.description || '', spec: compact(f.spec) }))
        : d.formats.items,
    },
    approach: {
      ...d.approach,
      heading: text(home?.approachHeading, d.approach.heading),
      headingContrast: home?.approachHeading?.trim() ? home.approachHeadingContrast || '' : d.approach.headingContrast,
      note: text(home?.approachNote, d.approach.note),
      steps: steps.length ? steps.map((s) => ({ name: s.name!, line: s.line || '' })) : d.approach.steps,
    },
    about: {
      ...d.about,
      lead: text(home?.aboutLead, d.about.lead),
      body: text(home?.aboutBody, d.about.body),
      portrait: imageUrl(home?.aboutPortrait, '4:5') || d.about.portrait,
      facts: facts.length ? facts.map((f) => ({ label: f.label!, value: f.value! })) : d.about.facts,
    },
    contact: {
      ...d.contact,
      lead: text(home?.contactLead, d.contact.lead),
      response: text(home?.contactResponse, d.contact.response),
      responseMobile: home?.contactResponse?.trim() ? home.contactResponse : d.contact.responseMobile,
    },
    seo: {
      title: stegaClean(home?.seoTitle)?.trim() || undefined,
      description: stegaClean(home?.seoDescription)?.trim() || undefined,
      ogImage,
    },
  }
})

/* ------------------------------- /projects page ---------------------------- */

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
    image: p.image?.asset ? urlForImage(p.image).width(1600).height(1200).fit('crop').url() : '',
    imageAlt: p.image?.alt ? stegaClean(p.image.alt) : undefined,
    featured: Boolean(p.featured),
  }
}

export async function getProjects(): Promise<ProjectItem[]> {
  const data = await sanityFetch<ProjectsQueryResult>({ query: projectsQuery })
  const cleaned = compact((data || []).map(toProject))
  return cleaned.length ? cleaned : fallbackProjects
}
