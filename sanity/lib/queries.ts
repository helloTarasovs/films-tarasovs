import { defineQuery } from 'next-sanity'

export const siteSettingsQuery = defineQuery(`*[_type == "siteSettings"][0]{
  title,
  role,
  email,
  location,
  navLinks[]{ label, href },
  socials[]{ label, href },
  footerHeading,
  footerCtaLabel,
  footerCtaHref
}`)

export const homePageQuery = defineQuery(`*[_type == "homePage"][0]{
  heroEyebrow,
  heroHeading,
  heroParagraph,
  primaryCta{ label, href },
  secondaryCta{ label, href },
  featuredHeading,
  featuredLink{ label, href },
  statement,
  "featuredProjects": featuredProjects[]->{
    "slug": slug.current,
    title,
    category,
    year,
    summary,
    "image": image.asset->url
  }
}`)

export const projectsQuery = defineQuery(`*[_type == "project"] | order(coalesce(orderRank, 9999) asc, year desc){
  "slug": slug.current,
  title,
  category,
  year,
  summary,
  "image": image.asset->url
}`)
