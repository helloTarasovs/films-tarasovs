import type { SiteInfo } from '@/content/site'
import { ArrowUpRight } from './icons'
import { TextLink } from './text-link'
import { Wordmark } from './wordmark'

/** Brand, repeated nav, social and fine print on a hairline. */
export function Footer({ site }: { site: SiteInfo }) {
  const social = site.social.filter((s) => s.href && s.href !== '#')
  const link = 'text-body-s text-fg-secondary transition-colors duration-(--duration-hover) ease-standard hover:text-foreground'

  return (
    <footer>
      <div className="container-wide">
        <div className="grid-12 items-start gap-y-6 border-t border-border pt-8 pb-7">
          <div className="col-span-12 md:col-span-4">
            <Wordmark name={site.name} descriptor={site.descriptor} />
            <p className="mt-3 hidden text-body-s text-fg-secondary md:block">
              {site.role.charAt(0).toUpperCase() + site.role.slice(1)}
            </p>
            <a
              href={site.agency.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-[13px] leading-[1.4] text-muted-foreground transition-colors duration-(--duration-hover) ease-standard hover:text-primary-text"
            >
              {site.agency.label}
              <ArrowUpRight className="size-[11px]" />
            </a>
          </div>

          <nav aria-label="Footer" className="col-span-12 md:col-span-4 md:col-start-5">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {site.nav.map((l) => (
                <li key={l.id}>
                  <a href={l.href} className={link}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {social.length > 0 && (
            <ul className="col-span-12 flex flex-wrap gap-x-6 gap-y-2 md:col-span-4 md:col-start-9 md:justify-end">
              {social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={link}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          <div className="col-span-12 mt-4 flex items-center justify-between gap-4">
            <p className="meta text-muted-foreground">© {new Date().getFullYear()} · {site.location}</p>
            <TextLink href="#top" arrow={false}>
              Back to top
            </TextLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
