'use client'

import dynamic from 'next/dynamic'
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { Film } from '@/content/site'

// Vidstack and the full MP4 are only fetched when a film is first opened.
const loadLightbox = () => import('@/components/FilmLightbox')
const FilmLightbox = dynamic(loadLightbox, { ssr: false })

type Ctx = {
  /** Slugs that can be played; others render as "Film in edit". */
  canPlay: (slug: string) => boolean
  open: (slug: string, trigger?: HTMLElement | null) => void
  /** Start fetching the lightbox chunk (call on hover/focus of a film). */
  prefetch: () => void
}

const FilmLightboxContext = createContext<Ctx | null>(null)

/** Null outside a provider, so frames used elsewhere (e.g. the portrait) stay inert. */
export function useFilmLightbox() {
  return useContext(FilmLightboxContext)
}

export const isPlayable = (film: Film) => Boolean(film.href && film.href !== '#')

export function FilmLightboxProvider({ films, children }: { films: Film[]; children: React.ReactNode }) {
  const playable = useMemo(() => films.filter(isPlayable), [films])
  const [index, setIndex] = useState<number | null>(null)
  const returnFocusTo = useRef<HTMLElement | null>(null)

  const open = useCallback(
    (slug: string, trigger?: HTMLElement | null) => {
      const i = playable.findIndex((f) => f.slug === slug)
      if (i < 0) return
      returnFocusTo.current = trigger ?? (document.activeElement as HTMLElement | null)
      setIndex(i)
    },
    [playable],
  )

  const ctx = useMemo<Ctx>(
    () => ({ open, prefetch: () => void loadLightbox(), canPlay: (slug) => playable.some((f) => f.slug === slug) }),
    [open, playable],
  )

  return (
    <FilmLightboxContext.Provider value={ctx}>
      {children}
      {index !== null && (
        <FilmLightbox
          films={playable}
          index={index}
          onIndexChange={setIndex}
          onClose={() => setIndex(null)}
          returnFocusTo={returnFocusTo}
        />
      )}
    </FilmLightboxContext.Provider>
  )
}
