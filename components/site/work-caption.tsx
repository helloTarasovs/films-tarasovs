import { cn } from '@/lib/utils'
import type { Film } from '@/content/site'
import { Tag } from './tag'
import { WatchLink } from './watch-link'

/**
 * Index, title, category line, tag and "Watch film" on a hairline under the frame.
 * Default: action on the right from md up. Compact (verticals, and all captions on
 * mobile): action under the title.
 */
export function WorkCaption({
  film,
  compact = false,
  showRatio = true,
  className,
}: {
  film: Film
  compact?: boolean
  showRatio?: boolean
  className?: string
}) {
  const category = [film.category, showRatio && !compact ? film.ratio : null, film.runtime]
    .filter(Boolean)
    .join(' · ')

  return (
    <div
      className={cn(
        'mt-5 grid grid-cols-[1.75rem_1fr] items-baseline gap-x-4 gap-y-1.5 border-t border-border pt-4',
        !compact && 'md:grid-cols-[2.5rem_1fr_auto]',
        className,
      )}
    >
      <span className="meta row-span-3 text-muted-foreground md:row-span-2">{film.index}</span>
      <h3
        className={cn(
          'text-h3 transition-colors duration-(--duration-hover) ease-standard group-hover/work:text-primary-text',
          compact ? 'text-[22px] md:text-[26px]' : 'md:text-[28px]',
        )}
      >
        {film.title}
      </h3>

      {compact ? (
        <>
          <div className="col-start-2 mt-1">
            <WatchLink slug={film.slug} />
          </div>
          <p className="col-start-2 mt-1 text-body-s text-fg-secondary">
            {film.category} · {film.ratio}
          </p>
          <div className="col-start-2">
            <Tag value={film.tag} />
          </div>
        </>
      ) : (
        <>
          <p className="col-start-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-body-s text-fg-secondary">
            <span>{category}</span>
            <Tag value={film.tag} />
          </p>
          <div className="col-start-2 mt-2 md:col-start-3 md:row-span-2 md:row-start-1 md:mt-0 md:self-start">
            <WatchLink slug={film.slug} />
          </div>
        </>
      )}
    </div>
  )
}
