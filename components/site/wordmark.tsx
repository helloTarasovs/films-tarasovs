import Link from 'next/link'
import { cn } from '@/lib/utils'

/** "Yurii Tarasov | FILMS". Descriptor turns foreground over video. */
export function Wordmark({
  name,
  descriptor,
  onMedia = false,
  className,
}: {
  name: string
  descriptor: string
  onMedia?: boolean
  className?: string
}) {
  return (
    <Link
      href="/"
      aria-label={`${name} ${descriptor}, home`}
      className={cn('inline-flex items-center gap-3 whitespace-nowrap', className)}
    >
      <span className="font-display text-[20px] leading-none font-semibold tracking-[0.005em] text-foreground md:text-[22px]">
        {name}
      </span>
      <span
        className={cn(
          'inline-flex h-3.5 items-center border-l pl-3 text-[10.5px] leading-none font-medium tracking-[0.18em] uppercase transition-colors duration-(--duration-ui) ease-standard',
          onMedia ? 'border-foreground/50 text-foreground' : 'border-border-strong text-muted-foreground',
        )}
      >
        {descriptor}
      </span>
    </Link>
  )
}
