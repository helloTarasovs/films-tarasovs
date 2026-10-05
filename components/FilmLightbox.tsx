'use client'

import { Dialog } from '@base-ui/react/dialog'
import { MediaPlayer, MediaProvider, Poster, type MediaPlayerInstance } from '@vidstack/react'
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default'
import '@vidstack/react/player/styles/default/theme.css'
import '@vidstack/react/player/styles/default/layouts/video.css'
import { track } from '@vercel/analytics'
import { useEffect, useRef, useState } from 'react'
import type { Film, Ratio } from '@/content/site'
import { Tag } from '@/components/site/tag'

const ratioValue: Record<Ratio, number> = {
  '16:9': 16 / 9,
  '2.39:1': 2.39,
  '9:16': 9 / 16,
  '4:5': 4 / 5,
}

export type FilmLightboxProps = {
  /** Playable films, in portfolio order. */
  films: Film[]
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
  /** Element that opened the lightbox; focus returns to it on close. */
  returnFocusTo: React.RefObject<HTMLElement | null>
}

/**
 * Full-screen Vidstack lightbox. Mounted only while open, so the full MP4 is
 * requested on open and released on close. Remounts the player per film.
 */
export default function FilmLightbox({ films, index, onIndexChange, onClose, returnFocusTo }: FilmLightboxProps) {
  const film = films[index]
  const playerRef = useRef<MediaPlayerInstance>(null)
  const [ratio, setRatio] = useState(ratioValue[film.ratio])
  const hasMultiple = films.length > 1

  // Fall back to the card ratio until the real file reports its dimensions.
  useEffect(() => setRatio(ratioValue[film.ratio]), [film])

  useEffect(() => {
    track('film_open', { film: film.slug })
    return () => track('film_close', { film: film.slug })
    // Fires once per lightbox session; film changes are tracked in step().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const step = (dir: 1 | -1) => {
    const next = (index + dir + films.length) % films.length
    track(dir === 1 ? 'film_next' : 'film_previous', { film: films[next].slug })
    onIndexChange(next)
  }

  const meta = [film.category, film.ratio, film.runtime, film.role, film.year].filter(Boolean)

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[100] bg-scrim/90 backdrop-blur-sm" />
        <Dialog.Popup
          aria-label={`Watch ${film.title}`}
          finalFocus={returnFocusTo}
          initialFocus={() => playerRef.current?.el ?? true}
          onClick={(e) => {
            // Click on the overlay, outside the player and caption.
            if (!(e.target as Element).closest('[data-lightbox-content], button')) onClose()
          }}
          className="fixed inset-0 z-[101] flex flex-col pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] outline-none"
        >
          <Dialog.Title className="sr-only">{film.title}</Dialog.Title>

          <div className="flex h-14 flex-none items-center justify-between px-margin md:h-16">
            <p className="meta text-muted-foreground">
              {String(index + 1).padStart(2, '0')} / {String(films.length).padStart(2, '0')}
            </p>
            <Dialog.Close className="label inline-flex h-11 items-center gap-3 px-1 text-foreground transition-colors duration-(--duration-hover) ease-standard hover:text-primary-text focus-visible:text-primary-text">
              Close
              <span aria-hidden className="text-[18px] leading-none">
                ×
              </span>
            </Dialog.Close>
          </div>

          <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-margin pb-6">
            <div className="flex w-full flex-col items-center">
              <div
                data-lightbox-content
                className="film-player w-full"
                style={{ maxWidth: `calc((100svh - 190px) * ${ratio})`, aspectRatio: String(ratio) }}
              >
                <MediaPlayer
                  key={film.slug}
                  ref={playerRef}
                  title={film.title}
                  src={film.href}
                  poster={film.poster || undefined}
                  playsInline
                  autoPlay
                  className="size-full"
                  onLoadedMetadata={() => {
                    const { mediaWidth, mediaHeight } = playerRef.current?.state ?? {}
                    if (mediaWidth && mediaHeight) setRatio(mediaWidth / mediaHeight)
                  }}
                >
                  <MediaProvider>
                    {film.poster && <Poster className="vds-poster" alt="" />}
                  </MediaProvider>
                  <DefaultVideoLayout icons={defaultLayoutIcons} />
                </MediaPlayer>
              </div>

              <div data-lightbox-content className="mt-5 flex w-full max-w-3xl flex-col gap-3 md:mt-6 md:flex-row md:items-baseline md:justify-between md:gap-8">
                <div className="min-w-0">
                  <h2 className="font-display text-h3 text-foreground">{film.title}</h2>
                  {meta.length > 0 && (
                    <p className="meta mt-1.5 text-fg-secondary">{meta.join(' · ')}</p>
                  )}
                </div>
                <div className="flex flex-none items-center gap-5">
                  <Tag value={film.tag} />
                  {hasMultiple && (
                    <div className="flex items-center gap-5">
                      <NavButton onClick={() => step(-1)}>Previous</NavButton>
                      <NavButton onClick={() => step(1)}>Next</NavButton>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function NavButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="label inline-flex h-11 items-center text-fg-secondary transition-colors duration-(--duration-hover) ease-standard hover:text-primary-text focus-visible:text-primary-text"
    >
      {children}
    </button>
  )
}
