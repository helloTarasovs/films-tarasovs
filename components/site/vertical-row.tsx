'use client'

import { useRef, useState } from 'react'
import type { Film } from '@/content/site'
import { cn } from '@/lib/utils'
import { MediaFrame } from './media-frame'
import { WorkCaption } from './work-caption'

/** 05–07: three 9:16 films. Desktop: stepped 0 / 64 / 128px. Mobile: swipe with a counter. */
export function VerticalRow({ films, label }: { films: Film[]; label: string }) {
  const scroller = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(1)
  const steps = ['', 'md:mt-16', 'md:mt-32']

  const onScroll = () => {
    const el = scroller.current
    const card = el?.firstElementChild as HTMLElement | null
    if (!el || !card) return
    const step = card.offsetWidth + 12
    setCurrent(Math.min(films.length, Math.round(el.scrollLeft / step) + 1))
  }

  return (
    <div>
      <div className="container-wide flex items-baseline justify-between">
        <p className="label text-fg-secondary">{label}</p>
        <p className="meta text-muted-foreground">
          <span className="md:hidden" aria-live="polite">
            Swipe · {current} / {films.length}
          </span>
          <span className="hidden md:inline">
            {films[0].index} – {films[films.length - 1].index} · 9:16
          </span>
        </p>
      </div>

      <div className="mt-6 md:mt-8">
        <div
          ref={scroller}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory scroll-px-margin gap-3 overflow-x-auto px-margin [scrollbar-width:none] md:container-wide md:grid md:grid-cols-12 md:gap-x-gutter md:overflow-visible md:px-margin [&::-webkit-scrollbar]:hidden"
        >
          {films.map((film, i) => (
            <div
              key={film.slug}
              className={cn('group/work w-[250px] shrink-0 snap-start md:col-span-4 md:w-auto', steps[i])}
            >
              <MediaFrame
                ratio="9:16"
                poster={film.poster}
                preview={film.preview}
                runtime={film.runtime}
                href={film.href}
                title={film.title}
                sizes="(min-width: 768px) 30vw, 250px"
              />
              <WorkCaption film={film} compact />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
