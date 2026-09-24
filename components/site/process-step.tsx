/** One stage of the approach. A 40px plum segment draws in over the rule on hover. */
export function ProcessStep({ index, name, line }: { index: number; name: string; line: string }) {
  return (
    <li className="group relative grid grid-cols-[2.5rem_1fr] border-t border-border-strong pt-5 pb-6 md:block md:pb-0">
      <span
        className="absolute -top-px left-0 h-px w-0 bg-primary-text transition-[width] duration-(--duration-reveal) ease-cine group-hover:w-10"
        aria-hidden
      />
      <p className="meta text-muted-foreground md:mb-5">{String(index).padStart(2, '0')}</p>
      <div>
        <h3 className="text-h3 md:text-[28px]">{name}</h3>
        <p className="mt-2.5 text-body-s text-fg-secondary">{line}</p>
      </div>
    </li>
  )
}
