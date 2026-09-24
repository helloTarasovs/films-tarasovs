import { cn } from '@/lib/utils'
import { Eyebrow } from './eyebrow'

/** Eyebrow, h2 (with an optional quieter second phrase) and a short note, on a hairline. */
export function SectionHeader({
  eyebrow,
  heading,
  contrast,
  note,
  noteMobile,
  className,
}: {
  eyebrow: string
  heading: string
  contrast?: string
  note?: string
  noteMobile?: string
  className?: string
}) {
  return (
    <div className={cn('grid-12 items-end gap-y-5 border-t border-border pt-6', className)}>
      <Eyebrow className="col-span-12">{eyebrow}</Eyebrow>
      <h2 className="col-span-12 text-h2 md:col-span-7">
        {heading}
        {contrast && <span className="contrast"> {contrast}</span>}
      </h2>
      {note && (
        <p className="col-span-12 text-body-s text-fg-secondary md:col-span-4 md:col-start-9">
          {noteMobile ? (
            <>
              <span className="md:hidden">{noteMobile}</span>
              <span className="hidden md:inline">{note}</span>
            </>
          ) : (
            note
          )}
        </p>
      )}
    </div>
  )
}
