'use client'

import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import type { LinkValue, SiteContent } from '@/content/site'
import { CtaLink } from './cta-link'
import { Eyebrow } from './eyebrow'
import { ArrowUpRight } from './icons'

/** The close: a quiet question, the email set large, one primary action. */
export function ContactBlock({
  contact,
  email,
  startProject,
}: {
  contact: SiteContent['contact']
  email: string
  startProject: LinkValue
}) {
  const emailRef = useRef<HTMLAnchorElement>(null)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      // Fallback: select the address so it can be copied manually.
      const el = emailRef.current?.querySelector('[data-email]')
      if (el) {
        const range = document.createRange()
        range.selectNodeContents(el)
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
      }
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="contact" className="scroll-mt-16 py-section-lg">
      <div className="container-wide">
        <Eyebrow>{contact.eyebrow}</Eyebrow>
        <p className="mt-6 font-display text-h2 text-fg-secondary">{contact.lead}</p>

        <a
          ref={emailRef}
          href={`mailto:${email}`}
          className="group mt-4 inline-flex max-w-full items-baseline gap-3 border-b border-border-strong pb-3 font-display text-[42px] leading-none font-medium tracking-[-0.02em] break-all text-foreground transition-colors duration-(--duration-hover) ease-standard hover:border-primary-text hover:text-primary-text md:gap-5 md:text-display"
        >
          <span data-email>{email}</span>
          <ArrowUpRight className="size-[0.36em] flex-none transition-transform duration-(--duration-ui) ease-cine group-hover:translate-x-1.5 group-hover:-translate-y-1.5" />
        </a>

        <div className="mt-8 grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-4 md:flex md:flex-wrap">
          <CtaLink
            location="contact-block"
            href={startProject.href}
            className={cn(buttonVariants(), 'col-span-2 w-full md:w-auto')}
          >
            {startProject.label}
          </CtaLink>
          <button
            type="button"
            onClick={copy}
            className="h-11 text-left text-[14px] font-medium tracking-[0.01em] text-foreground transition-colors duration-(--duration-hover) ease-standard hover:text-primary-text"
          >
            <span aria-live="polite">{copied ? contact.copiedLabel : contact.copyLabel}</span>
          </button>
          <p className="meta justify-self-end text-muted-foreground md:justify-self-auto">
            <span className="md:hidden">{contact.responseMobile}</span>
            <span className="hidden md:inline">{contact.response}</span>
          </p>
        </div>
      </div>
    </section>
  )
}
