import type { Tag as TagValue } from '@/content/site'

/** Commissioned carries a plum dot; the word is the meaning, the dot a second cue. */
export function Tag({ value }: { value: TagValue }) {
  return (
    <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-border-strong px-2.5 text-[10.5px] leading-none font-medium tracking-[0.14em] whitespace-nowrap text-fg-secondary uppercase">
      {value === 'Commissioned' && <span className="size-[5px] rounded-full bg-primary-text" aria-hidden />}
      {value}
    </span>
  )
}
