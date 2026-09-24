import { cn } from '@/lib/utils'

/** Section label: names the section, it is not the heading. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <p className={cn('label inline-flex items-center text-fg-secondary', className)}>{children}</p>
}
