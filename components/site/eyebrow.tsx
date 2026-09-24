import { cn } from '@/lib/utils'

/** Section label with a 24px plum rule. `plain` drops the rule (captions, video). */
export function Eyebrow({
  children,
  plain = false,
  className,
}: {
  children: React.ReactNode
  plain?: boolean
  className?: string
}) {
  return (
    <p className={cn('label inline-flex items-center gap-3 text-fg-secondary', className)}>
      {!plain && <span className="h-px w-6 flex-none bg-primary-text" aria-hidden />}
      {children}
    </p>
  )
}
