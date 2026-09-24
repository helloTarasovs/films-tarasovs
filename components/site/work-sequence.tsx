import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import type { Film, SiteContent } from '@/content/site'
import { FactRow } from './fact-row'
import { ArrowRight } from './icons'
import { MediaFrame } from './media-frame'
import { Tag } from './tag'
import { TextLink } from './text-link'
import { VerticalRow } from './vertical-row'
import { WorkCaption } from './work-caption'

/**
 * Editorial sequence, not a grid:
 * 01 wide feature · 02+03 staggered pair · 04 text + film split ·
 * 05–07 verticals · 08 full-bleed · 09 closing split. Missing films skip their block.
 */
export function WorkSequence({
  films,
  copy,
}: {
  films: Film[]
  copy: SiteContent['selectedWork']
}) {
  const [feature, pairA, pairB, split, v1, v2, v3, fullBleed, closing] = films
  const verticals = [v1, v2, v3].filter(Boolean) as Film[]

  return (
    // Block flow with space-y: a flex/grid parent would shrink the margin-auto containers.
    <div className="space-y-24 md:space-y-section">
      {feature && (
        <div className="container-wide">
          <div className="group/work">
            <MediaFrame {...frameProps(feature)} ratio="2.39:1" ratioMobile="16:9" sizes="(min-width: 1536px) 1408px, 100vw" />
            <WorkCaption film={feature} />
          </div>
        </div>
      )}

      {pairA && (
        <div className="container-wide">
          <div className="grid-12 gap-y-20">
            <div className="group/work col-span-12 md:col-span-8">
              <MediaFrame {...frameProps(pairA)} ratio="16:9" sizes="(min-width: 768px) 66vw, 100vw" />
              <WorkCaption film={pairA} />
            </div>
            {pairB && (
              <div className="group/work col-span-10 col-start-3 md:col-span-3 md:col-start-10 md:mt-[200px]">
                <MediaFrame {...frameProps(pairB)} ratio="9:16" sizes="(min-width: 768px) 25vw, 80vw" />
                <WorkCaption film={pairB} compact />
              </div>
            )}
          </div>
        </div>
      )}

      {split && (
        <div className="container-wide">
          <div className="group/work grid-12 items-center gap-y-6">
            <div className="col-span-12 md:order-2 md:col-span-7 md:col-start-6">
              <MediaFrame {...frameProps(split)} ratio="16:9" sizes="(min-width: 768px) 58vw, 100vw" />
            </div>
            <div className="col-span-12 md:order-1 md:col-span-4 md:col-start-1">
              <p className="meta text-muted-foreground">
                {[split.index, split.category, split.year].filter(Boolean).join(' · ')}
              </p>
              <h3 className="mt-4 text-h2 transition-colors duration-(--duration-hover) ease-standard group-hover/work:text-primary-text">
                {split.title}
              </h3>
              {split.description && (
                <p className="mt-5 max-w-measure text-body-m text-fg-secondary">{split.description}</p>
              )}
              <dl className="mt-8 hidden border-t border-border md:block">
                {split.role && <FactRow label="Role" value={split.role} />}
                <FactRow label="Runtime" value={`${split.runtime} · ${split.ratio}`} />
              </dl>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <TextLink href={isLinked(split) ? split.href : undefined} external>
                  {isLinked(split) ? 'Watch film' : 'Film in edit'}
                </TextLink>
                <Tag value={split.tag} />
              </div>
            </div>
          </div>
        </div>
      )}

      {verticals.length > 0 && <VerticalRow films={verticals} label={copy.phoneLabel} />}

      {fullBleed && (
        <div className="group/work md:py-12">
          <MediaFrame {...frameProps(fullBleed)} ratio="2.39:1" ratioMobile="4:5" fullBleed sizes="100vw" />
          <div className="container-wide">
            <WorkCaption film={fullBleed} />
          </div>
        </div>
      )}

      {closing && (
        <div className="container-wide">
          <div className="grid-12 items-center gap-y-10">
            <div className="group/work col-span-12 md:col-span-7">
              <MediaFrame {...frameProps(closing)} ratio="16:9" sizes="(min-width: 768px) 58vw, 100vw" />
              <WorkCaption film={closing} />
            </div>
            <div className="col-span-12 md:col-span-4 md:col-start-9">
              <p className="hidden font-display text-h3 font-medium text-fg-secondary md:block">
                {copy.archiveNote}
              </p>
              {/* Archive page not built yet: shown disabled rather than as a broken link. */}
              <span
                aria-disabled
                className={cn(buttonVariants({ variant: 'outline' }), 'w-full md:mt-8 md:w-auto')}
              >
                {copy.archiveCta.label}
                <ArrowRight />
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function isLinked(film: Film) {
  return Boolean(film.href && film.href !== '#')
}

function frameProps(film: Film) {
  return {
    poster: film.poster,
    preview: film.preview,
    runtime: film.runtime,
    href: film.href,
    title: film.title,
  }
}
