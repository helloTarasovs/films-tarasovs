import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { ProjectCard } from '@/components/project-card'
import { linkTargetProps } from '@/lib/links'
import { getHomePage } from '@/sanity/lib/data'

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomePage()
  const metadata: Metadata = {}

  if (seo.title) metadata.title = { absolute: seo.title }
  if (seo.description) metadata.description = seo.description
  if (seo.ogImage) {
    metadata.openGraph = {
      ...(seo.title && { title: seo.title }),
      ...(seo.description && { description: seo.description }),
      images: [seo.ogImage],
    }
    metadata.twitter = { card: 'summary_large_image', images: [seo.ogImage.url] }
  }

  return metadata
}

export default async function HomePage() {
  const home = await getHomePage()
  const featured = home.featuredProjects

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border/60">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 md:py-32">
          {home.heroEyebrow && (
            <p className="flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
              <span className="h-px w-8 bg-primary" aria-hidden />
              {home.heroEyebrow}
            </p>
          )}
          <h1 className="mt-8 max-w-4xl text-balance font-serif text-5xl leading-[0.95] tracking-tight text-foreground sm:text-6xl md:text-8xl">
            {home.heroHeading}
          </h1>
          {home.heroParagraph && (
            <p className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {home.heroParagraph}
            </p>
          )}
          {(home.primaryCta || home.secondaryCta) && (
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              {home.primaryCta && (
                <Link
                  href={home.primaryCta.href}
                  {...linkTargetProps(home.primaryCta)}
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {home.primaryCta.label}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              )}
              {home.secondaryCta && (
                <Link
                  href={home.secondaryCta.href}
                  {...linkTargetProps(home.secondaryCta)}
                  className="text-sm tracking-wide text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  {home.secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Featured work */}
      <section id="projects" className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-serif text-3xl tracking-tight text-foreground md:text-4xl">
            {home.featuredHeading}
          </h2>
          {home.featuredLink && (
            <Link
              href={home.featuredLink.href}
              {...linkTargetProps(home.featuredLink)}
              className="hidden shrink-0 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              {home.featuredLink.label}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2">
          {featured.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={i}
              priority={i === 0}
            />
          ))}
        </div>
      </section>

      {/* Marquee-style statement */}
      {home.statement && (
        <section className="border-y border-border/60 bg-card/40">
          <div className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
            <p className="max-w-4xl text-balance font-serif text-3xl leading-snug tracking-tight text-foreground md:text-5xl">
              {home.statement}
            </p>
          </div>
        </section>
      )}
    </>
  )
}
