import { cn } from '@/lib/utils'

/** Label and value on a hairline. `stacked` puts the label above the value. */
export function FactRow({
  label,
  value,
  stacked = false,
  className,
}: {
  label: string
  value: React.ReactNode
  stacked?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid border-b border-border py-3.5',
        stacked ? 'gap-1.5' : 'grid-cols-[7.5rem_1fr] items-baseline gap-6',
        className,
      )}
    >
      <dt className="label text-[11px] text-muted-foreground">{label}</dt>
      <dd className="text-body-m text-foreground">{value}</dd>
    </div>
  )
}
