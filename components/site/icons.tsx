// Inline icons in currentColor: 1.25px stroke, square caps (brand book, Iconography).

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden className={className ?? 'size-3.5'}>
      <path d="M1 7h11M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" />
    </svg>
  )
}

export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden className={className ?? 'size-3.5'}>
      <path d="M3 11 11 3M5 3h6v6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" />
    </svg>
  )
}

export function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 10" aria-hidden className={className ?? 'size-2.5'}>
      <path d="M1 0.5v9l8-4.5z" fill="currentColor" />
    </svg>
  )
}
