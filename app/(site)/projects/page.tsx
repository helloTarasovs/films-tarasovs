import type { Metadata } from 'next'
import { ProjectCard } from '@/components/project-card'
import { getProjects } from '@/sanity/lib/data'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Selected product, editorial, and brand work — case studies in restraint and craft.',
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <>
      <section className="border-b border-border/60">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Projects
          </p>
          <h1 className="mt-8 max-w-3xl text-balance font-serif text-4xl leading-tight tracking-tight text-foreground sm:text-5xl md:text-7xl">
            A decade of work, edited down to what still holds up.
          </h1>
          <p className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Product design, art direction, and brand identity. Each project below
            is a study in the same idea: clarity is a form of respect.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={i}
              priority={i < 2}
            />
          ))}
        </div>
      </section>
    </>
  )
}
