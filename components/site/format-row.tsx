/** Typographic row: mono index · Cormorant name · one sentence · mono spec. No images. */
export function FormatRow({
  index,
  name,
  description,
  spec,
}: {
  index: number
  name: string
  description: string
  spec: string[]
}) {
  return (
    <li className="group grid grid-cols-[2.25rem_1fr] items-baseline gap-x-4 border-t border-border py-7 md:grid-cols-[3.5rem_minmax(0,1.2fr)_minmax(0,1fr)_11.25rem] md:gap-x-6">
      <span className="meta text-muted-foreground transition-colors duration-(--duration-hover) ease-standard group-hover:text-primary-text">
        {String(index).padStart(2, '0')}
      </span>
      <h3 className="font-display text-[40px] leading-none font-medium tracking-[-0.015em] transition-[color,translate] duration-(--duration-ui) ease-cine group-hover:translate-x-2 group-hover:text-primary-text md:text-[64px]">
        {name}
      </h3>
      <p className="col-start-2 mt-4 max-w-[34ch] text-body-s text-fg-secondary md:col-start-3 md:mt-0">
        {description}
      </p>
      <p className="meta col-start-2 mt-3 leading-[1.6] text-muted-foreground md:col-start-4 md:mt-0 md:text-right">
        <span className="md:hidden">{spec.join(' · ')}</span>
        <span className="hidden md:inline">
          {spec[0]}
          <br />
          {spec[1]}
        </span>
      </p>
    </li>
  )
}
