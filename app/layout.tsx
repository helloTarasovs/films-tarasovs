import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { stegaClean } from 'next-sanity'
import { getSiteContent } from '@/sanity/lib/data'
import { display, mono, sans } from './fonts'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  // <head> strings: strip draft-mode stega markers.
  const { site } = stegaClean(await getSiteContent())
  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name}, ${site.role}`,
      template: `%s · ${site.name}`,
    },
    description:
      'Directed films, made with AI. Product films, brand films, launch visuals and motion identity for brands, agencies and creative teams.',
    alternates: { canonical: '/' },
  }
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0f0b09',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="min-h-dvh">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
