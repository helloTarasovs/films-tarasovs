import { defineQuery } from 'next-sanity'

// Singletons are fetched by their fixed document ID (see sanity/structure.ts).

export const siteSettingsQuery = defineQuery(`*[_type == "siteSettings" && _id == "siteSettings"][0]{
  title,
  role,
  email,
  location,
  navLinks[]{ label, href, openInNewTab },
  footerHeading,
  footerCtaLabel,
  footerCtaHref,
  footerNavHeading,
  footerNav[]{ label, href, openInNewTab },
  contactHeading,
  copyrightText,
  footerNote,
  socialsHeading,
  socials[]{ platform, label, href }
}`)

export const homePageQuery = defineQuery(`*[_type == "homePage" && _id == "homePage"][0]{
  heroEyebrow,
  heroHeading,
  heroParagraph,
  primaryCta{ label, href, openInNewTab },
  secondaryCta{ label, href, openInNewTab },
  featuredHeading,
  featuredLink{ label, href, openInNewTab },
  statement,
  "featuredProjects": featuredProjects[]->{
    _id,
    "slug": slug.current,
    title,
    category,
    services,
    year,
    summary,
    featured,
    image{ asset, crop, hotspot, alt }
  },
  seoTitle,
  seoDescription,
  ogImage{ asset, crop, hotspot, alt }
}`)

export const projectsQuery = defineQuery(`*[_type == "project" && defined(slug.current)] | order(coalesce(orderRank, 9999) asc, year desc){
  _id,
  "slug": slug.current,
  title,
  category,
  services,
  year,
  summary,
  featured,
  image{ asset, crop, hotspot, alt }
}`)
