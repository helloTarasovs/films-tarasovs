'use client'

import { cn } from '@/lib/utils'
import { ArrowRight } from './icons'
import { useFilmLightbox } from './film-lightbox-provider'
import { TextLink, textLinkActive, textLinkBase } from './text-link'

/** "Watch film" action: opens the lightbox, or shows the disabled "Film in edit" state. */
export function WatchLink({ slug, className }: { slug: string; className?: string }) {
  const lightbox = useFilmLightbox()
  if (!lightbox?.canPlay(slug)) return <TextLink className={className}>Film in edit</TextLink>

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onPointerEnter={lightbox.prefetch}
      onFocus={lightbox.prefetch}
      onClick={(e) => lightbox.open(slug, e.currentTarget)}
      className={cn(textLinkBase, textLinkActive, 'group/link cursor-pointer', className)}
    >
      Watch film
      <ArrowRight className="size-3.5 transition-transform duration-(--duration-ui) ease-cine group-hover/link:translate-x-1" />
    </button>
  )
}
