import Link from 'next/link'
import { linkTargetProps } from '@/lib/links'
import type { SiteSettings } from '@/sanity/lib/types'

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear()
  const footerNav = settings.footerNav.length ? settings.footerNav : settings.navLinks

  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 md:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-sm">
            {settings.footerHeading && (
              <p className="font-serif text-2xl leading-tight tracking-tight text-foreground md:text-3xl">
                {settings.footerHeading}
              </p>
            )}
            {settings.footerCtaLabel && settings.footerCtaHref && (
              <Link
                href={settings.footerCtaHref}
                className="mt-6 inline-block text-sm tracking-wide text-primary underline-offset-4 hover:underline"
              >
                {settings.footerCtaLabel}
              </Link>
            )}
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <nav aria-label="Footer">
              <h2 className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">
                {settings.footerNavHeading}
              </h2>
              <ul className="space-y-2.5">
                {footerNav.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      {...linkTargetProps(link)}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">
                {settings.socialsHeading}
              </h2>
              <ul className="space-y-2.5">
                {settings.socials.map((s) => (
                  <li key={`${s.href}-${s.label}`}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h2 className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">
                {settings.contactHeading}
              </h2>
              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {settings.email}
                </a>
              )}
              {settings.location && (
                <p className="mt-2.5 text-sm text-muted-foreground">
                  {settings.location}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-border/40 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {settings.copyrightText}
          </p>
          {settings.footerNote && <p>{settings.footerNote}</p>}
        </div>
      </div>
    </footer>
  )
}
