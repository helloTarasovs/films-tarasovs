import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About',
  description: `About ${site.name} — ${site.role}, based in ${site.location}.`,
}

const capabilities = [
  'Product & UI Design',
  'Design Engineering',
  'Art Direction',
  'Editorial & Print',
  'Design Systems',
  'Prototyping & Motion',
]

const timeline = [
  {
    year: '2022 — Now',
    role: 'Independent Design Engineer',
    place: 'Studio practice',
    note: 'Partnering with founders and editors to ship considered products and publications.',
  },
  {
    year: '2019 — 2022',
    role: 'Senior Product Designer',
    place: 'Meridian',
    note: 'Led the design system and end-to-end flows for a consumer finance platform.',
  },
  {
    year: '2016 — 2019',
    role: 'Designer',
    place: 'The Quarterly',
    note: 'Art direction and layout for an independent print and digital magazine.',
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-border/60">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            About
          </p>
          <div className="mt-10 grid gap-12 md:grid-cols-[1.4fr_1fr] md:items-start md:gap-16">
            <div>
              <h1 className="text-balance font-display text-4xl leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
                I build the thing and the thing that makes the thing.
              </h1>
              <div className="mt-8 space-y-6 text-pretty text-lg leading-relaxed text-muted-foreground">
                <p>
                  I&apos;m {site.name}, a {site.role.toLowerCase()} based in{' '}
                  {site.location}. My work lives where editorial sensibility meets
                  engineering rigor — I care as much about a well-set paragraph as a
                  well-typed function.
                </p>
                <p>
                  Over the last decade I&apos;ve moved between print magazines,
                  product teams, and independent practice. That range taught me to
                  treat every project as a piece of communication first: what is it
                  trying to say, to whom, and how should it feel while it says it?
                </p>
                <p>
                  When I&apos;m not designing, you&apos;ll find me setting type for
                  small presses, collecting out-of-print design books, and walking
                  the same three neighborhoods far too often.
                </p>
              </div>
            </div>

            <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border/60 bg-card md:sticky md:top-28">
              <Image
                src="/portrait.png"
                alt={`Portrait of ${site.name}`}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
        <h2 className="font-display text-2xl tracking-tight text-foreground md:text-3xl">
          Capabilities
        </h2>
        <ul className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border/60 bg-border/60 sm:grid-cols-2 md:grid-cols-3">
          {capabilities.map((c) => (
            <li
              key={c}
              className="bg-background px-6 py-6 text-lg text-foreground"
            >
              {c}
            </li>
          ))}
        </ul>
      </section>

      {/* Timeline */}
      <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
          <h2 className="font-display text-2xl tracking-tight text-foreground md:text-3xl">
            Selected experience
          </h2>
          <ol className="mt-10 divide-y divide-border/60">
            {timeline.map((item) => (
              <li
                key={item.year}
                className="grid gap-2 py-8 md:grid-cols-[180px_1fr] md:gap-10"
              >
                <p className="text-sm uppercase tracking-widest text-muted-foreground">
                  {item.year}
                </p>
                <div>
                  <h3 className="font-display text-xl tracking-tight text-foreground md:text-2xl">
                    {item.role}
                    <span className="text-muted-foreground"> · {item.place}</span>
                  </h3>
                  <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
                    {item.note}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm tracking-wide text-primary-text underline-offset-4 hover:underline"
            >
              Work with me
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
