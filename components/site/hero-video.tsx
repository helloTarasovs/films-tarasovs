'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
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

export function HeroVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const video = ref.current
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduced(prefersReduced)
    if (!video) return
    if (prefersReduced) video.pause()
    else if (video.readyState >= 3) setReady(true)
  }, [])

  const play = () => {
    setStarted(true)
    ref.current?.play().catch(() => undefined)
  }

  return (
    <div className="absolute inset-0">
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          data-poster-fallback
          src={poster}
          alt=""
          className={cn('absolute inset-0 size-full object-cover', framing)}
        />
      )}
      <video
        ref={ref}
        src={src}
        poster={poster || undefined}
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
