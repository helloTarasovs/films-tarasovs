'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { Ratio } from '@/content/site'
import { PlayIcon } from './icons'
import { useFilmLightbox } from './film-lightbox-provider'

const ratioClass: Record<Ratio, string> = {
  '16:9': 'aspect-video',
  '2.39:1': 'aspect-[2.39/1]',
  '9:16': 'aspect-[9/16]',
  '4:5': 'aspect-[4/5]',
}
const ratioClassMd: Record<Ratio, string> = {
  '16:9': 'md:aspect-video',
  '2.39:1': 'md:aspect-[2.39/1]',
  '9:16': 'md:aspect-[9/16]',
  '4:5': 'md:aspect-[4/5]',
}

export type MediaFrameProps = {
  ratio: Ratio
  /** Different framing below 768px, e.g. a full-bleed 2.39:1 reframed to 4:5. */
  ratioMobile?: Ratio
  poster?: string
  /** Muted preview loop. With a poster it plays on hover/focus (desktop) or when
   *  60% in view (touch); without a poster it plays whenever in view. */
  preview?: string
  runtime?: string
  /** Film slug; opens the lightbox when the film is playable. */
  slug?: string
  title: string
  sizes: string
  priority?: boolean
  fullBleed?: boolean
  /** Status line for the placeholder state, e.g. "Film in edit" or "Portrait". */
  placeholderLabel?: string
  className?: string
}

/**
 * The container for every film (design-system/components/MediaFrame.md):
 * fixed ratio, card fill, 2px radius, slow zoom on hover, play chip.
 */
export function MediaFrame({
  ratio,
  ratioMobile,
  poster,
  preview,
  runtime,
  slug,
  title,
  sizes,
  priority = false,
  fullBleed = false,
  placeholderLabel = 'Film in edit',
  className,
}: MediaFrameProps) {
  const rootRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [wantsPlay, setWantsPlay] = useState(false)
  const [playing, setPlaying] = useState(false)

  const hasMedia = Boolean(poster || preview)
  const lightbox = useFilmLightbox()
  const linked = Boolean(slug && lightbox?.canPlay(slug))
  const loading = wantsPlay && !playing

  // Touch devices, and previews without a poster, play while at least 60% visible.
  useEffect(() => {
    const el = rootRef.current
    if (!preview || !el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const touch = window.matchMedia('(hover: none)').matches
    if (poster && !touch) return

    const io = new IntersectionObserver(([entry]) => setWantsPlay(entry.intersectionRatio >= 0.6), {
      threshold: [0, 0.6],
    })
    io.observe(el)
    return () => io.disconnect()
  }, [preview, poster])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (wantsPlay) video.play().catch(() => setWantsPlay(false))
    else video.pause()
  }, [wantsPlay])

  const hoverStart = () => {
    if (linked) lightbox?.prefetch()
    if (!preview || !poster) return
    if (window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) setWantsPlay(true)
  }
  const hoverEnd = () => {
    if (preview && poster && window.matchMedia('(hover: hover)').matches) setWantsPlay(false)
  }

  const frameClasses = cn(
    'group/frame relative block overflow-hidden bg-card isolate',
    ratioMobile ? cn(ratioClass[ratioMobile], ratioClassMd[ratio]) : ratioClass[ratio],
    fullBleed ? 'rounded-none' : 'rounded-media',
    hasMedia && 'media-zoom',
    className,
  )

  const media = hasMedia ? (
    <>
      {poster && (
        <Image src={poster} alt="" fill sizes={sizes} priority={priority} className="object-cover" />
      )}
      {preview && (
        <video
          ref={videoRef}
          src={preview}
          muted
          loop
          playsInline
          preload={poster ? 'none' : 'metadata'}
          aria-hidden
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className={cn(
            'absolute inset-0 size-full object-cover',
            poster &&
              cn(
                'transition-opacity duration-(--duration-media) ease-in-out-cine',
                playing ? 'opacity-100' : 'opacity-0',
              ),
          )}
        />
      )}
      {loading && (
        <span className="absolute bottom-0 left-0 z-[3] h-px w-[38%] bg-primary-text" aria-hidden />
      )}
      {runtime && (
        <span
          className={cn(
            'meta absolute bottom-3 left-3 z-[2] inline-flex h-8 items-center gap-2.5 rounded-media bg-scrim/70 pr-3 pl-2.5 text-[12px] tracking-[0.04em] text-foreground transition-colors duration-(--duration-hover) ease-standard md:bottom-4 md:left-4',
            linked && 'group-hover/frame:bg-primary group-hover/frame:text-primary-foreground group-focus-visible/frame:bg-primary',
          )}
        >
          <PlayIcon />
          {loading ? 'Loading film' : linked ? `Watch · ${runtime}` : runtime}
        </span>
      )}
    </>
  ) : (
    <Placeholder label={`${ratio} · ${placeholderLabel}`} />
  )

  const events = { onMouseEnter: hoverStart, onMouseLeave: hoverEnd, onFocus: hoverStart, onBlur: hoverEnd }

  if (linked && slug) {
    return (
      <button
        type="button"
        ref={rootRef as React.RefObject<HTMLButtonElement>}
        onClick={(e) => lightbox?.open(slug, e.currentTarget)}
        aria-haspopup="dialog"
        aria-label={`Watch ${title}${runtime ? `, ${runtime}` : ''}`}
        className={cn(frameClasses, 'w-full cursor-pointer text-left')}
        {...events}
      >
        {media}
      </button>
    )
  }
  return (
    <div
      ref={rootRef as React.RefObject<HTMLDivElement>}
      className={frameClasses}
      {...events}
      {...(!hasMedia && { role: 'img', 'aria-label': `${title}, ${placeholderLabel.toLowerCase()}` })}
    >
      {media}
    </div>
  )
}

/** Card fill, crop-mark corners and a mono status line. */
function Placeholder({ label }: { label: string }) {
  const corner = 'absolute size-4 border-border-strong'
  return (
    <div className="absolute inset-0 grid place-items-center">
      <span className={cn(corner, 'top-3 left-3 border-t border-l')} aria-hidden />
      <span className={cn(corner, 'top-3 right-3 border-t border-r')} aria-hidden />
      <span className={cn(corner, 'bottom-3 left-3 border-b border-l')} aria-hidden />
      <span className={cn(corner, 'right-3 bottom-3 border-r border-b')} aria-hidden />
      <span className="meta px-6 text-center text-[12px] tracking-[0.04em] text-muted-foreground">{label}</span>
    </div>
  )
}
