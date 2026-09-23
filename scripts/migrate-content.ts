/**
 * One-off migration: copies the content currently hardcoded in the site
 * (lib/site.ts + fallbacks in sanity/lib/data.ts) into Sanity as DRAFTS.
 *
 * - Creates one draft per project (skips any that exist).
 * - Uploads project cover images from /public.
 * - Home Page and Site Settings: only fills fields that are empty; existing
 *   values (title, email, navLinks, …) are never overwritten.
 * - Publishes nothing. Review and publish in /studio.
 *
 * Dry run (read-only):  DRY_RUN=1 sanity exec scripts/migrate-content.ts --with-user-token
 * Apply:                         sanity exec scripts/migrate-content.ts --with-user-token
 * Requires Node >= 22.12 and `sanity login`.
 */
import { randomUUID } from 'node:crypto'
import { createReadStream } from 'node:fs'
import path from 'node:path'
import { getCliClient } from 'sanity/cli'
import { projects, site } from '../lib/site'

const DRY_RUN = Boolean(process.env.DRY_RUN)
const client = getCliClient({ apiVersion: '2024-10-01' })
const key = () => randomUUID().replace(/-/g, '').slice(0, 12)
const link = (label: string, href: string) => ({
  _type: 'navLink',
  label,
  href,
  openInNewTab: false,
})

const platformByLabel: Record<string, string> = {
  Instagram: 'instagram',
  'Are.na': 'arena',
  LinkedIn: 'linkedin',
  'Read.cv': 'readcv',
}

async function exists(id: string) {
  const found = await client.fetch<string[]>(`*[_id in [$id, "drafts." + $id]]._id`, { id })
  return found.length > 0
}

/** Draft if one exists, otherwise the published document. */
async function getDoc(id: string) {
  const draft = await client.fetch<Record<string, unknown> | null>(`*[_id == $id][0]`, { id: `drafts.${id}` })
  const published = await client.fetch<Record<string, unknown> | null>(`*[_id == $id][0]`, { id })
  return { draft, published, current: draft ?? published }
}

const isEmpty = (v: unknown) =>
  v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)

/**
 * Sets only the fields that are empty on a singleton's draft (creating the
 * draft from the published version if needed). Never overwrites values.
 */
async function fillMissing(
  tx: ReturnType<typeof client.transaction>,
  log: string[],
  id: string,
  defaults: Record<string, unknown>,
) {
  const { draft, published, current } = await getDoc(id)
  const missing = Object.fromEntries(
    Object.entries(defaults).filter(([k]) => isEmpty(current?.[k])),
  )
  if (Object.keys(missing).length === 0) {
    log.push(`skip   ${id} (nothing missing)`)
    return
  }
  if (!draft) {
    // Start the draft from the published document so nothing is lost.
    const { _rev, _updatedAt, _createdAt, _system, ...rest } = published ?? {}
    void _rev, _updatedAt, _createdAt, _system
    tx.createIfNotExists({ ...rest, _id: `drafts.${id}`, _type: id })
  }
  tx.patch(`drafts.${id}`, (patch) => patch.set(missing))
  log.push(`fill   drafts.${id}: ${Object.keys(missing).join(', ')}`)
}

async function main() {
  const tx = client.transaction()
  const log: string[] = []

  /* ------------------------------ Projects ------------------------------ */
  for (const [i, p] of projects.entries()) {
    const id = `project-${p.slug}`
    if (await exists(id)) {
      log.push(`skip   ${id} (already exists)`)
      continue
    }
    let image: Record<string, unknown> | undefined
    if (p.image) {
      const file = path.join(process.cwd(), 'public', p.image)
      if (DRY_RUN) {
        log.push(`upload ${p.image}`)
      } else {
        const asset = await client.assets.upload('image', createReadStream(file), {
          filename: path.basename(file),
        })
        image = {
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id },
          alt: `${p.title} — ${p.category}`,
        }
      }
    }
    tx.createIfNotExists({
      _id: `drafts.${id}`,
      _type: 'project',
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      summary: p.summary,
      year: p.year,
      // Card label is derived from services ("A · B"), matching today's text.
      services: p.category.split(' · ').map((s) => s.trim()),
      // The homepage shows the first two projects today.
      featured: i < 2,
      orderRank: i + 1,
      ...(image && { image }),
    })
    log.push(`create drafts.${id}`)
  }

  /* ------------------------------ Home page ----------------------------- */
  await fillMissing(tx, log, 'homePage', {
    heroEyebrow: site.role,
    heroHeading: 'Designing quiet interfaces with a loud point of view.',
    heroParagraph: `I'm ${site.name}, a design engineer working at the seam of editorial craft and product thinking — building things that feel considered, from the first pixel to the last query.`,
    primaryCta: link('View selected work', '/projects'),
    secondaryCta: link('More about me', '/about'),
    featuredHeading: 'Selected work',
    featuredLink: link('All projects', '/projects'),
    statement:
      'Good design is a quiet argument — made in type, space, and restraint — that the work respects the person on the other side of the screen.',
  })

  /* ---------------------------- Site settings --------------------------- */
  const { current: settings } = await getDoc('siteSettings')
  const title = (settings?.title as string) || site.name
  const location = (settings?.location as string) || site.location

  await fillMissing(tx, log, 'siteSettings', {
    title,
    role: site.role,
    email: site.email,
    location,
    navLinks: [
      { _key: key(), ...link('Home', '/') },
      { _key: key(), ...link('About', '/about') },
      { _key: key(), ...link('Projects', '/projects') },
      { _key: key(), ...link('Contact', '/contact') },
    ],
    footerHeading: 'Have a project in mind?',
    footerCtaLabel: 'Start a conversation',
    footerCtaHref: '/contact',
    footerNavHeading: 'Pages',
    contactHeading: 'Contact',
    socialsHeading: 'Elsewhere',
    copyrightText: `${title}. All rights reserved.`,
    footerNote: `Designed & built in ${location}.`,
    socials: site.socials.map((s) => ({
      _key: key(),
      _type: 'socialLink',
      platform: platformByLabel[s.label] ?? 'other',
      label: s.label,
      href: s.href,
    })),
  })

  console.log(log.join('\n'))
  if (DRY_RUN) {
    console.log('\nDRY RUN — nothing was written.')
    return
  }
  await tx.commit()
  console.log('\nDone. Drafts created; review and publish them in /studio.')
}

main().catch((err) => {
  console.error('Migration failed:', err.message)
  process.exit(1)
})
