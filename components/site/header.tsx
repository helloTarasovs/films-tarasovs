'use client'

import { Dialog } from '@base-ui/react/dialog'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import type { SiteInfo } from '@/content/site'
import { CtaLink } from './cta-link'
import { Wordmark } from './wordmark'

/**
 * Transparent over the homepage hero (relies on the hero's top scrim); after 80vh
 * of scroll, and on every other page, it turns solid with a bottom hairline.
 */
export function Header({ site }: { site: SiteInfo }) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [solid, setSolid] = useState(!isHome)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (!isHome) {
      setSolid(true)
      return
    }
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  // Current section for aria-current and the plum underline.
  useEffect(() => {
    if (!isHome) return
    const sections = site.nav
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null)
    const visible = new Set<string>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id)
          else visible.delete(e.target.id)
        }
        // Nothing in the middle band (e.g. back on the hero) clears the highlight.
        setActive(site.nav.find((l) => visible.has(l.id))?.id ?? null)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [isHome, site.nav])

  const overMedia = isHome && !solid

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-colors duration-(--duration-ui) ease-standard',
        overMedia ? 'border-transparent bg-transparent' : 'border-border bg-background',
      )}
    >
      <div className="container-wide">
        <div className="grid h-14 grid-cols-[1fr_auto] items-center md:h-16 lg:grid-cols-[1fr_auto_1fr]">
          <Wordmark name={site.name} descriptor={site.descriptor} onMedia={overMedia} />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {site.nav.map((link) => {
                const current = isHome && active === link.id
                return (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      aria-current={current ? 'true' : undefined}
                      className={cn(
                        'relative block py-2 text-[13px] leading-none font-medium tracking-[0.02em] transition-colors duration-(--duration-hover) ease-standard hover:text-foreground',
                        current || overMedia ? 'text-foreground' : 'text-fg-secondary',
                        current && 'after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-primary-text',
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="hidden justify-end lg:flex">
            <CtaLink
              location="header"
              href={site.startProject.href}
              className={cn(buttonVariants({ size: 'sm' }), overMedia && 'btn-on-media')}
            >
              {site.startProject.label}
            </CtaLink>
          </div>

          <MobileMenu site={site} active={active} />
        </div>
      </div>
    </header>
  )
}

/** Full-screen solid sheet: Cormorant links with mono indexes, primary action pinned low. */
function MobileMenu({ site, active }: { site: SiteInfo; active: string | null }) {
  const [open, setOpen] = useState(false)
  const menuLabel = 'label inline-flex h-11 items-center gap-2.5 text-[12px] text-foreground'

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={cn(menuLabel, 'justify-self-end lg:hidden')}>
        Menu
        <span className="grid w-5 gap-[5px]" aria-hidden>
          <span className="h-px bg-current" />
          <span className="h-px bg-current" />
        </span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Popup className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-background lg:hidden">
          <Dialog.Title className="sr-only">Menu</Dialog.Title>
          <div>
            <div className="container-wide flex h-14 items-center justify-between border-b border-border">
              <Wordmark name={site.name} descriptor={site.descriptor} />
              <Dialog.Close className={menuLabel}>Close</Dialog.Close>
            </div>
          </div>
          <nav aria-label="Mobile" className="pt-6">
            <ol className="container-wide">
              {site.nav.map((link, i) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={active === link.id ? 'true' : undefined}
                    className="flex items-baseline gap-4 border-b border-border py-3.5 font-display text-[44px] leading-none font-medium tracking-[-0.01em] text-foreground aria-[current]:text-primary-text"
                  >
                    <span className="meta w-5 text-[12px] text-muted-foreground">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="mt-auto pt-6 pb-7">
            <div className="container-wide">
              <CtaLink location="menu" href={site.startProject.href} className={cn(buttonVariants(), 'w-full')}>
                {site.startProject.label}
              </CtaLink>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
