import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact-form'
import { stegaClean } from 'next-sanity'
import { getSiteContent } from '@/sanity/lib/data'

export async function generateMetadata(): Promise<Metadata> {
  const { site } = stegaClean(await getSiteContent())
  return {
    title: 'Contact',
    description: `Get in touch with ${site.name}, ${site.role}.`,
  }
}

export default async function ContactPage() {
  const { site } = await getSiteContent()
  const socials = site.social.filter((s) => s.href && s.href !== '#')

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
      <div className="grid gap-14 md:grid-cols-[1fr_1.1fr] md:gap-20">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Contact
          </p>
          <h1 className="mt-8 text-balance font-display text-4xl leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Let&apos;s talk about the work.
          </h1>
          <p className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
            I take on a small number of projects each quarter. If you&apos;re
            building something that deserves care, I&apos;d love to hear about it.
          </p>

          <dl className="mt-12 space-y-8">
            <div>
              <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                Email
              </dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${site.email}`}
                  className="font-display text-xl tracking-tight text-foreground underline-offset-4 hover:underline"
                >
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                Based in
              </dt>
              <dd className="mt-2 text-lg text-foreground">{site.location}</dd>
            </div>
            {socials.length > 0 && (
            <div>
              <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                Elsewhere
              </dt>
              <dd className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                {socials.map((s) => (
                  <a
                    key={`${s.href}-${s.label}`}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {s.label}
                  </a>
                ))}
              </dd>
            </div>
            )}
          </dl>
        </div>

        <div className="md:pt-16">
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
