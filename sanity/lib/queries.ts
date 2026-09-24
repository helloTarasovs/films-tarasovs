import { defineQuery } from 'next-sanity'

// Singletons are fetched by their fixed document ID (see sanity/structure.ts).

const imageFields = `{ asset, crop, hotspot, alt }`

// One film, as the homepage components need it.
const filmFields = `{
  _id,
  "slug": slug.current,
  title,
  category,
  kind,
  ratio,
  runtime,
  year,
  summary,
  role,
  "poster": image${imageFields},
  previewUrl,
  projectUrl
}`

export const siteSettingsQuery = defineQuery(`*[_type == "siteSettings" && _id == "siteSettings"][0]{
  title,
  descriptor,
  role,
  email,
  location,
  startProject{ label, href },
  navLinks[]{ label, href },
  agency{ label, href },
  socials[]{ platform, label, href }
}`)

export const homePageQuery = defineQuery(`*[_type == "homePage" && _id == "homePage"][0]{
  heroLines,
  heroIntro,
  heroIntroMobile,
  heroVideoUrl,
  "heroPoster": heroPoster${imageFields},
  "nowShowing": nowShowing->{ title, category, runtime },
  workHeading,
  workHeadingContrast,
  workNote,
  workNoteMobile,
  "films": featuredProjects[]->${filmFields},
  phoneLabel,
  archiveNote,
  formatsHeading,
  formatsHeadingContrast,
  formatsNote,
  formats[]{ name, description, spec },
  approachHeading,
  approachHeadingContrast,
  approachNote,
  approachSteps[]{ name, line },
  aboutLead,
  aboutBody,
  "aboutPortrait": aboutPortrait${imageFields},
  aboutFacts[]{ label, value },
  contactLead,
  contactResponse,
  seoTitle,
  seoDescription,
  "ogImage": ogImage${imageFields}
}`)

/** Homepage films when none are hand-picked on the Home Page. */
export const filmsQuery = defineQuery(`*[_type == "project" && defined(slug.current) && featured != false]
  | order(coalesce(orderRank, 9999) asc, year desc)[0...9]${filmFields}`)

/** /projects page (card list). */
export const projectsQuery = defineQuery(`*[_type == "project" && defined(slug.current)] | order(coalesce(orderRank, 9999) asc, year desc){
  _id,
  "slug": slug.current,
  title,
  category,
  services,
  year,
  summary,
  featured,
  image${imageFields}
}`)
