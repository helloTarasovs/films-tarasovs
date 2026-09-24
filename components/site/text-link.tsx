import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ArrowRight } from './icons'

const base =
  'group/link inline-flex items-center gap-2.5 border-b pb-1.5 text-[14px] leading-[1.2] font-medium tracking-[0.01em] whitespace-nowrap transition-colors duration-(--duration-hover) ease-standard'

/** Inline action with a hairline underline and an arrow that nudges on hover. */
export function TextLink({
  href,
  children,
  external = false,
  arrow = true,
  className,
}: {
  href?: string
  children: React.ReactNode
  external?: boolean
  arrow?: boolean
  className?: string
}) {
  if (!href || href === '#') {
    return (
      <span aria-disabled className={cn(base, 'cursor-not-allowed border-border text-fg-disabled', className)}>
        {children}
      </span>
    )
  }

  const classes = cn(
    base,
    'border-border-strong text-foreground hover:border-primary-text hover:text-primary-text',
    className,
  )
  const content = (
    <>
      {children}
      {arrow && (
        <ArrowRight className="size-3.5 transition-transform duration-(--duration-ui) ease-cine group-hover/link:translate-x-1" />
      )}
    </>
  )

  return external || !href.startsWith('/') ? (
    <a href={href} className={classes} {...(external && { target: '_blank', rel: 'noopener noreferrer' })}>
      {content}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {content}
    </Link>
  )
}
