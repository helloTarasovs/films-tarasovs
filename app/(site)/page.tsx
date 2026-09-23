import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { ProjectCard } from '@/components/project-card'
import { projects, site } from '@/lib/site'

export default function HomePage() {
  const featured = projects.slice(0, 2)

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border/60">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 md:py-32">
          <p className="flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
            <span className="h-px w-8 bg-primary" aria-hidden />
            {site.role}
          </p>
          <h1 className="mt-8 max-w-4xl text-balance font-serif text-5xl leading-[0.95] tracking-tight text-foreground sm:text-6xl md:text-8xl">
            Designing quiet interfaces with a loud point of view.
          </h1>
          <p className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            I&apos;m {site.name}, a design engineer working at the seam of
            editorial craft and product thinking — building things that feel
            considered, from the first pixel to the last query.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              View selected work
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/about"
              className="text-sm tracking-wide text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              More about me
            </Link>
          </div>
        </div>
      </section>

      {/* Featured work */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-serif text-3xl tracking-tight text-foreground md:text-4xl">
            Selected work
          </h2>
          <Link
            href="/projects"
            className="hidden shrink-0 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            All projects
            <ArrowUpRight className="h-4 w-4" />
          </Link>
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
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
          <p className="max-w-4xl text-balance font-serif text-3xl leading-snug tracking-tight text-foreground md:text-5xl">
            Good design is a quiet argument — made in type, space, and restraint —
            that the work respects the person on the other side of the screen.
          </p>
        </div>
      </section>
    </>
  )
}
