import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'
import { DisableDraftMode } from '@/components/disable-draft-mode'
import { Footer } from '@/components/site/footer'
import { Header } from '@/components/site/header'
import { getSiteContent } from '@/sanity/lib/data'

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [{ isEnabled: isDraft }, { site }] = await Promise.all([draftMode(), getSiteContent()])

  return (
    <>
      <a
        id="top"
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <div className="flex min-h-dvh flex-col">
        <Header site={site} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer site={site} />
      </div>
      {isDraft && (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      )}
    </>
  )
}
