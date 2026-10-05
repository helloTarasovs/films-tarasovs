import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import type { LinkValue, SiteContent } from '@/content/site'
import { CtaLink } from './cta-link'
import { HeroVideo } from './hero-video'

type HeroContent = SiteContent['hero']

function NowShowing({ hero, className }: { hero: HeroContent; className?: string }) {
  const { title, note, runtime } = hero.nowShowing
  return (
    <p
      className={cn(
        'meta inline-flex items-center gap-2.5 rounded-media bg-scrim/70 px-2.5 py-1.5 text-[12px] leading-none tracking-[0.04em] text-foreground',
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-primary-text" aria-hidden />
      Now showing
      <span>
        <b className="font-medium">{title}</b>
        {note && <span className="hidden md:inline"> · {note}</span>}
        {runtime && <> · {runtime}</>}
      </span>
    </p>
  )
}

/** Full-screen loop; all copy in the bottom 40% over the eased warm-black scrim. */
export function Hero({ hero, startProject }: { hero: HeroContent; startProject: LinkValue }) {
  return (
    <section
      aria-label="Introduction"
      className="relative -mt-14 flex h-svh min-h-[40rem] flex-col justify-end overflow-hidden bg-scrim md:-mt-16"
    >
      <HeroVideo src={hero.video.src} poster={hero.video.poster} />
      <div className="scrim-bottom absolute inset-0 z-[1]" aria-hidden />
      <div className="scrim-top absolute inset-x-0 top-0 z-[1] h-40" aria-hidden />

      <div className="absolute inset-x-0 top-[4.25rem] z-[2] md:hidden">
        <div className="container-wide">
          <NowShowing hero={hero} />
        </div>
      </div>

      <div className="relative z-[2]">
        <div className="container-wide pb-8 md:pb-12">
          <div className="grid-12 items-end gap-y-6">
            <h1 className="col-span-12 text-display-xl text-foreground lg:col-span-8">
              {hero.headline.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <div className="col-span-12 md:col-span-8 lg:col-span-4 lg:col-start-9 lg:pb-2">
              <p className="max-w-measure text-body-l text-foreground">
                <span className="md:hidden">{hero.introMobile}</span>
                <span className="hidden md:inline">{hero.intro}</span>
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:flex md:flex-wrap">
                <a href={hero.primary.href} className={cn(buttonVariants(), 'btn-on-media')}>
                  {hero.primary.label}
                </a>
                <CtaLink location="hero" href={startProject.href} className={buttonVariants({ variant: 'onMedia' })}>
                  {startProject.label}
                </CtaLink>
              </div>
            </div>
          </div>

          <div className="mt-10 hidden items-center justify-between border-t border-foreground/25 pt-5 md:flex">
            <NowShowing hero={hero} />
            <a href="#work" className="meta text-foreground transition-colors duration-(--duration-hover) hover:text-fg-secondary">
              Scroll
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
