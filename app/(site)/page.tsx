import type { Metadata } from 'next'
import { ContactBlock } from '@/components/site/contact-block'
import { Eyebrow } from '@/components/site/eyebrow'
import { FactRow } from '@/components/site/fact-row'
import { FormatRow } from '@/components/site/format-row'
import { Hero } from '@/components/site/hero'
import { MediaFrame } from '@/components/site/media-frame'
import { ProcessStep } from '@/components/site/process-step'
import { SectionHeader } from '@/components/site/section-header'
import { WorkSequence } from '@/components/site/work-sequence'
import { getSiteContent } from '@/sanity/lib/data'

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteContent()
  const metadata: Metadata = {}
  if (seo.title) metadata.title = { absolute: seo.title }
  if (seo.description) metadata.description = seo.description
  if (seo.ogImage) {
    metadata.openGraph = { images: [seo.ogImage] }
    metadata.twitter = { card: 'summary_large_image', images: [seo.ogImage.url] }
  }
  return metadata
}

export default async function HomePage() {
  const { site, hero, selectedWork, films, filmsArePlaceholders, formats, approach, about, contact } =
    await getSiteContent()

  return (
    <>
      <Hero hero={hero} startProject={site.startProject} />

      <section id="work" className="scroll-mt-16 pt-section">
        <div className="container-wide">
          <SectionHeader
            eyebrow={selectedWork.eyebrow}
            heading={selectedWork.heading}
            contrast={selectedWork.headingContrast}
            note={selectedWork.note}
            noteMobile={selectedWork.noteMobile}
          />
          {films.length > 0 && filmsArePlaceholders && (
            <p className="meta mt-6 text-primary-text">
              Local preview: titles and runtimes are placeholders, and only Bloom (08) is real footage.
              Hidden in production builds.
            </p>
          )}
        </div>
        <div className="mt-12 md:mt-20">
          {films.length > 0 ? (
            <WorkSequence films={films} copy={selectedWork} />
          ) : (
            <p className="container-wide text-body-l text-fg-secondary">{selectedWork.empty}</p>
          )}
        </div>
      </section>

      <section id="formats" className="scroll-mt-16 pt-section-lg pb-section">
        <div className="container-wide">
          <SectionHeader
            eyebrow={formats.eyebrow}
            heading={formats.heading}
            contrast={formats.headingContrast}
            note={formats.note}
            noteMobile={formats.noteMobile}
          />
          <ol className="mt-12 border-b border-border md:mt-16">
            {formats.items.map((item, i) => (
              <FormatRow key={item.name} index={i + 1} {...item} />
            ))}
          </ol>
        </div>
      </section>

      <section id="approach" className="scroll-mt-16 py-section-sm">
        <div className="container-wide">
          <SectionHeader
            eyebrow={approach.eyebrow}
            heading={approach.heading}
            contrast={approach.headingContrast}
            note={approach.note}
          />
          <ol className="mt-12 md:mt-16 md:grid md:grid-cols-5 md:gap-6">
            {approach.steps.map((step, i) => (
              <ProcessStep key={step.name} index={i + 1} name={step.name} line={step.line} />
            ))}
          </ol>
        </div>
      </section>

      <section id="about" className="scroll-mt-16 py-section-sm">
        <div className="container-wide">
          <div className="grid-12 gap-y-8 border-t border-border pt-6">
            <div className="col-span-4 md:col-span-3">
              <MediaFrame
                ratio="4:5"
                poster={about.portrait}
                title={`Portrait of ${site.name}`}
                placeholderLabel="Portrait"
                sizes="(min-width: 768px) 22vw, 33vw"
              />
            </div>
            <div className="col-span-8 self-end md:hidden">
              <Eyebrow>{about.eyebrow}</Eyebrow>
            </div>
            <div className="col-span-12 md:col-span-4 md:col-start-5">
              <Eyebrow className="hidden md:inline-flex">{about.eyebrow}</Eyebrow>
              <p className="font-display text-[26px] leading-[1.15] font-medium text-foreground md:mt-6 md:text-[34px]">
                {about.lead}
              </p>
              <p className="mt-6 max-w-measure text-body-m text-fg-secondary">{about.body}</p>
            </div>
            <dl className="col-span-12 border-t border-border md:col-span-3 md:col-start-10">
              {about.facts.map((f) => (
                // Label beside the value on mobile, stacked in the narrow desktop column.
                <FactRow key={f.label} label={f.label} value={f.value} className="md:grid-cols-1 md:gap-1.5" />
              ))}
            </dl>
          </div>
        </div>
      </section>

      <ContactBlock contact={contact} email={site.email} startProject={site.startProject} />
    </>
  )
}
