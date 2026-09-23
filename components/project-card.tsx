import Image from 'next/image'
import type { Project } from '@/lib/site'

export function ProjectCard({
  project,
  index,
  priority = false,
}: {
  project: Project
  index: number
  priority?: boolean
}) {
  return (
    <article className="group">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border/60 bg-card">
        <Image
          src={project.image || '/placeholder.svg'}
          alt={`${project.title} — ${project.category}`}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-2xl tracking-tight text-foreground md:text-3xl">
          <span className="mr-3 align-middle font-sans text-xs text-muted-foreground">
            {String(index + 1).padStart(2, '0')}
          </span>
          {project.title}
        </h3>
        <span className="shrink-0 text-sm text-muted-foreground">{project.year}</span>
      </div>
      <p className="mt-1 text-sm uppercase tracking-widest text-primary/90">
        {project.category}
      </p>
      <p className="mt-3 max-w-xl text-pretty leading-relaxed text-muted-foreground">
        {project.summary}
      </p>
    </article>
  )
}
