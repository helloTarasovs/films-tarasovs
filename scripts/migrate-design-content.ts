/**
 * One-off migration to the Screening Room design (all writes are DRAFTS):
 * - drafts.siteSettings: overwrite name, descriptor, role, email, location,
 *   "Start a project", navigation and agency with the design values.
 *   Social links are left as they are.
 * - drafts.homePage: fill the new section fields from content/site.ts.
 *   Legacy fields are left untouched (hidden in Studio while empty).
 * - Delete the four v0 template project drafts.
 * - Create drafts.project-bloom (peony loop) and point "Now showing" at it.
 * Publishes nothing.
 *
 * Dry run: DRY_RUN=1 sanity exec scripts/migrate-design-content.ts --with-user-token
 * Apply:            sanity exec scripts/migrate-design-content.ts --with-user-token
 */
import { randomUUID } from 'node:crypto'
import { getCliClient } from 'sanity/cli'
import { about, approach, contact, formats, hero, selectedWork, site } from '../content/site'

const DRY_RUN = Boolean(process.env.DRY_RUN)
const client = getCliClient({ apiVersion: '2024-10-01' })
const key = () => randomUUID().replace(/-/g, '').slice(0, 12)
const link = (label: string, href: string) => ({ _type: 'navLink', label, href, openInNewTab: false })

const TEMPLATE_PROJECTS = ['meridian', 'the-quarterly', 'lumen', 'foundry'].map((s) => `project-${s}`)
const peony = hero.video.src

async function ensureDraft(tx: ReturnType<typeof client.transaction>, id: string, type: string, log: string[]) {
  const [draft, published] = await Promise.all([
    client.getDocument(`drafts.${id}`),
    client.getDocument(id),
  ])
  if (!draft) {
    const { _rev, _updatedAt, _createdAt, _system, ...rest } = (published ?? {}) as Record<string, unknown>
    void _rev, _updatedAt, _createdAt, _system
    tx.createIfNotExists({ ...rest, _id: `drafts.${id}`, _type: type })
    log.push(`create drafts.${id} (from ${published ? 'published' : 'scratch'})`)
  }
}

async function main() {
  const tx = client.transaction()
  const log: string[] = []

  /* ------------------------------ Bloom film ------------------------------ */
  const bloomExists = (await client.fetch<string[]>(`*[_id in ["project-bloom", "drafts.project-bloom"]]._id`)).length > 0
  if (bloomExists) {
    log.push('skip   project-bloom (already exists)')
  } else {
    tx.create({
      _id: 'drafts.project-bloom',
      _type: 'project',
      title: 'Bloom',
      slug: { _type: 'slug', current: 'bloom' },
      category: 'Motion identity study',
      kind: 'self-initiated',
      ratio: '2.39:1',
      previewUrl: peony,
      projectUrl: peony,
      featured: true,
      orderRank: 1,
    })
    log.push('create drafts.project-bloom')
  }

  /* ---------------------------- Site settings ----------------------------- */
  await ensureDraft(tx, 'siteSettings', 'siteSettings', log)
  const settings = {
    title: site.name,
    descriptor: site.descriptor,
    role: site.role,
    email: site.email,
    location: site.location,
    startProject: link(site.startProject.label, site.startProject.href),
    navLinks: site.nav.map((n) => ({ _key: key(), ...link(n.label, n.href) })),
    agency: link(site.agency.label, site.agency.href),
  }
  tx.patch('drafts.siteSettings', (p) => p.set(settings))
  log.push(`set    drafts.siteSettings: ${Object.keys(settings).join(', ')}`)

  /* ------------------------------ Home page ------------------------------- */
  await ensureDraft(tx, 'homePage', 'homePage', log)
  const home = {
    heroLines: hero.headline,
    heroIntro: hero.intro,
    heroIntroMobile: hero.introMobile,
    heroVideoUrl: peony,
    // Weak until Bloom is published, like Studio does for references to drafts.
    nowShowing: { _type: 'reference', _ref: 'project-bloom', _weak: true, _strengthenOnPublish: { type: 'project' } },
    workHeading: selectedWork.heading,
    workHeadingContrast: selectedWork.headingContrast,
    workNote: selectedWork.note,
    workNoteMobile: selectedWork.noteMobile,
    phoneLabel: selectedWork.phoneLabel,
    archiveNote: selectedWork.archiveNote,
    formatsHeading: formats.heading,
    formatsHeadingContrast: formats.headingContrast,
    formatsNote: formats.note,
    formats: formats.items.map((f) => ({ _key: key(), _type: 'format', name: f.name, description: f.description, spec: f.spec })),
    approachHeading: approach.heading,
    approachHeadingContrast: approach.headingContrast,
    approachNote: approach.note,
    approachSteps: approach.steps.map((s) => ({ _key: key(), _type: 'step', name: s.name, line: s.line })),
    aboutLead: about.lead,
    aboutBody: about.body,
    aboutFacts: about.facts.map((f) => ({ _key: key(), _type: 'fact', label: f.label, value: f.value })),
    contactLead: contact.lead,
    contactResponse: contact.response,
  }
  tx.patch('drafts.homePage', (p) => p.set(home))
  log.push(`set    drafts.homePage: ${Object.keys(home).length} fields`)

  /* -------------------------- Template projects --------------------------- */
  const existing = await client.fetch<string[]>(`*[_id in $ids]._id`, {
    ids: TEMPLATE_PROJECTS.flatMap((id) => [id, `drafts.${id}`]),
  })
  for (const id of existing) {
    tx.delete(id)
    log.push(`delete ${id}`)
  }

  console.log(log.join('\n'))
  if (DRY_RUN) {
    console.log('\nDRY RUN, nothing was written.')
    return
  }
  await tx.commit()
  console.log('\nDone. Review and publish in /studio: Bloom first, then Home Page and Site Settings.')
}

main().catch((err) => {
  console.error('Migration failed:', err.message)
  process.exit(1)
})
