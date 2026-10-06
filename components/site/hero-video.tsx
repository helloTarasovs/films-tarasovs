'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { HERO_WIDTHS, sanityImageAttrs } from '@/lib/sanity-srcset'
import { PlayIcon } from './icons'

/**
 * Muted hero loop. Poster (if any) shows until the video can play, then the
 * video crossfades in. With reduced motion it never autoplays: poster + "Play film".
 */
/**
 * Framing for the Napoleon loop: his hat sits at the very top of the frame, right
 * of centre (~68%), in all three scenes. Anchor to the top so vertical cropping
 * (viewports wider than 16:9) never cuts the hat; on portrait screens, where the
 * sides are cropped instead, shift the focal point right to keep him in frame.
 * Applied to the <video> (and its poster attribute) and the reduced-motion <img>.
 */
const framing = 'object-[68%_0%] landscape:object-[50%_0%]'

/** Same sizes string is used by the preload in hero.tsx, so both pick the same candidate. */
export const HERO_POSTER_SIZES = '100vw'

type NetworkInformation = { saveData?: boolean; effectiveType?: string }

/** Autoplaying the loop is worth 2 MB only on a wide screen with a decent connection. */
function canAutoplayVideo() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (!window.matchMedia('(min-width: 768px)').matches) return false
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection
  if (connection?.saveData) return false
  if (connection?.effectiveType && /(^|-)(2g|3g)$/.test(connection.effectiveType)) return false
  return true
}

export function HeroVideo({ src, poster }: { src: string; poster?: string }) {
  const [ready, setReady] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [started, setStarted] = useState(false)
  // The <video> is not in the server HTML: nothing is requested until it is mounted.
  const [mountVideo, setMountVideo] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    if (!canAutoplayVideo()) return

    let idle: number | undefined
    let timer: ReturnType<typeof setTimeout> | undefined
    const mount = () => {
      if ('requestIdleCallback' in window) idle = window.requestIdleCallback(() => setMountVideo(true), { timeout: 2000 })
      else timer = setTimeout(() => setMountVideo(true), 300)
    }
    if (document.readyState === 'complete') mount()
    else window.addEventListener('load', mount, { once: true })

    return () => {
      window.removeEventListener('load', mount)
      if (idle !== undefined) window.cancelIdleCallback(idle)
      if (timer) clearTimeout(timer)
    }
  }, [])

  // "Play film" (reduced motion) mounts the video on demand and autoplays it.
  const play = () => setStarted(true)
  // Without a poster there is nothing to show first, so the video loads right away.
  const showVideo = mountVideo || started || !poster
  const posterImage = poster ? sanityImageAttrs(poster, HERO_WIDTHS) : null

  return (
    <div className="absolute inset-0">
      {posterImage && (
        // LCP element: eager, high priority, preloaded in hero.tsx; the video fades in over it.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          data-poster-fallback
          src={posterImage.src}
          srcSet={posterImage.srcSet}
          sizes={HERO_POSTER_SIZES}
          alt=""
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className={cn('absolute inset-0 size-full object-cover', framing)}
        />
      )}
      {showVideo && (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          {...(!started && { 'data-autoplay': '' })}
          onCanPlayThrough={() => setReady(true)}
          onPlaying={() => setReady(true)}
          className={cn(
            'absolute inset-0 size-full object-cover transition-opacity duration-(--duration-media) ease-in-out-cine',
            framing,
            ready || started ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}
      {reduced && !started && (
        <button
          type="button"
          onClick={play}
          className={cn(buttonVariants({ variant: 'onMedia', size: 'sm' }), 'absolute top-1/3 left-1/2 z-[3] -translate-x-1/2')}
        >
          <PlayIcon />
          Play film
        </button>
      )}
    </div>
  )
}
