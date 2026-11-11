import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { stegaClean } from 'next-sanity'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CtaLink } from '@/components/site/cta-link'
import { Eyebrow } from '@/components/site/eyebrow'
import { FactRow } from '@/components/site/fact-row'
import { FilmLightboxProvider } from '@/components/site/film-lightbox-provider'
import { MediaFrame } from '@/components/site/media-frame'
import { Tag } from '@/components/site/tag'
import { TextLink } from '@/components/site/text-link'
import { WatchLink } from '@/components/site/watch-link'
import { projectPath, urlSlug } from '@/lib/slug'
import { getProjectPage, getProjectSlugs, getSiteContent } from '@/sanity/lib/data'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getProjectSlugs()).map((slug) => ({ slug: urlSlug(slug) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getProjectPage(slug)
  if (!page) return {}
  const { film } = page
  const title = stegaClean(film.title)
  const description = stegaClean(film.description) || `${stegaClean(film.category)}, directed by Yurii Tarasov.`
  return {
    title,
    description,
    alternates: { canonical: projectPath(film.slug) },
    openGraph: { type: 'video.other', title, description, ...(film.poster && { images: [film.poster] }) },
    twitter: { card: 'summary_large_image', ...(film.poster && { images: [film.poster] }) },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const [page, { site }] = await Promise.all([getProjectPage(slug), getSiteContent()])
  if (!page) notFound()
  const { film, client, services, stills, notes, prev, next } = page

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: stegaClean(film.title),
    genre: stegaClean(film.category),
    dateCreated: stegaClean(film.year),
    description: stegaClean(film.description),
    url: `${site.url}${projectPath(film.slug)}`,
    ...(film.poster && { image: film.poster }),
    author: { '@type': 'Person', name: site.name, jobTitle: site.role },
  }

  return (
    <FilmLightboxProvider films={[film]}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <article className="pt-28 pb-section-sm md:pt-36">
        <div className="container-wide">
          <TextLink href="/#work" arrow={false} className="mb-10">
            ← All work
          </TextLink>

          <Eyebrow>{[film.category, film.year].filter(Boolean).join(' · ')}</Eyebrow>
          <h1 className="mt-5 max-w-[16ch] text-balance text-h1">{film.title}</h1>

          <div className="mt-10 md:mt-14">
            <MediaFrame
              poster={film.poster}
              preview={film.preview}
              runtime={film.runtime}
              slug={film.slug}
              title={film.title}
              ratio={film.ratio}
              ratioMobile={film.ratio === '2.39:1' ? '16:9' : undefined}
              sizes="(min-width: 1536px) 1408px, 100vw"
              priority
            />
          </div>

          <div className="grid-12 mt-12 gap-y-12 md:mt-20">
            <div className="col-span-12 md:col-span-6">
              {film.description && (
                <p className="max-w-measure text-body-l text-fg-secondary">{film.description}</p>
              )}
              {notes.length > 0 && (
                <div className="mt-8 space-y-5">
                  {notes.map((n) =>
                    n.style === 'h3' ? (
                      <h2 key={n.key} className="pt-4 text-h3">
                        {n.text}
                      </h2>
                    ) : n.style === 'blockquote' ? (
                      <blockquote key={n.key} className="border-l border-border-strong pl-5 text-body-l text-foreground">
                        {n.text}
                      </blockquote>
                    ) : (
                      <p key={n.key} className="max-w-measure text-body-m text-fg-secondary">
                        {n.text}
                      </p>
                    ),
                  )}
                </div>
              )}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <WatchLink slug={film.slug} />
                <Tag value={film.tag} />
              </div>
            </div>

            <dl className="col-span-12 border-t border-border md:col-span-4 md:col-start-9">
              {client && <FactRow label="Client" value={client} />}
              {film.role && <FactRow label="Role" value={film.role} />}
              {services.length > 0 && <FactRow label="Services" value={services.join(', ')} />}
              {film.runtime && <FactRow label="Runtime" value={`${film.runtime} · ${film.ratio}`} />}
              {film.year && <FactRow label="Year" value={film.year} />}
            </dl>
          </div>

          {stills.length > 0 && (
            <div className="mt-section-sm grid gap-6 md:grid-cols-2">
              {stills.map((still) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={still.src}
                  src={still.src}
                  alt={still.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-media"
                />
              ))}
            </div>
          )}
        </div>

        {(prev || next) && (
          <nav aria-label="More work" className="container-wide mt-section-sm grid gap-8 border-t border-border pt-8 md:grid-cols-2">
            <div>
              {prev && (
                <Link href={projectPath(prev.slug)} className="group block">
                  <span className="label text-muted-foreground">Previous</span>
                  <span className="mt-2 block text-h3 transition-colors group-hover:text-primary-text">{prev.title}</span>
                </Link>
              )}
            </div>
            <div className="md:text-right">
              {next && (
                <Link href={projectPath(next.slug)} className="group block">
                  <span className="label text-muted-foreground">Next</span>
                  <span className="mt-2 block text-h3 transition-colors group-hover:text-primary-text">{next.title}</span>
                </Link>
              )}
            </div>
          </nav>
        )}

        <div className="container-wide mt-section-sm">
          <CtaLink
            href="/contact"
            location="contact-block"
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            Start a project
          </CtaLink>
        </div>
      </article>
    </FilmLightboxProvider>
  )
}
