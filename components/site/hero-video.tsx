'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { PlayIcon } from './icons'

/**
 * Framing for the Napoleon loop: his hat sits at the very top of the frame, right
 * of centre (~68%), in all three scenes. Anchor to the top so vertical cropping
 * (viewports wider than 16:9) never cuts the hat; on portrait screens, where the
 * sides are cropped instead, shift the focal point right to keep him in frame.
 */
const framing = 'object-[68%_0%] landscape:object-[50%_0%]'

type NetworkInformation = { saveData?: boolean; effectiveType?: string }

/** No autoplay with reduced motion, Save-Data or a slow connection. */
function canAutoplayVideo() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection
  if (connection?.saveData) return false
  if (connection?.effectiveType && /(^|-)(2g|3g)$/.test(connection.effectiveType)) return false
  return true
}

/**
 * Muted hero loop, no poster: the section's dark background shows until the first
 * frame plays, then the video fades in. Where autoplay is not appropriate the video
 * is not requested at all and a "Play film" button starts it on demand.
 */
export function HeroVideo({ src }: { src: string }) {
  // null until the client has checked reduced motion / connection.
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => setAllowed(canAutoplayVideo()), [])

  const showVideo = allowed === true || started

  return (
    <div className="absolute inset-0">
      {showVideo && (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          onPlaying={() => setPlaying(true)}
          className={cn(
            'absolute inset-0 size-full object-cover transition-opacity duration-500 ease-in-out-cine',
            framing,
            playing ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}
      {allowed === false && !started && (
        <button
          type="button"
          onClick={() => setStarted(true)}
          className={cn(buttonVariants({ variant: 'onMedia', size: 'sm' }), 'absolute top-1/3 left-1/2 z-[3] -translate-x-1/2')}
        >
          <PlayIcon />
          Play film
        </button>
      )}
    </div>
  )
}
