import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { stegaClean } from 'next-sanity'
import { getSiteSettings } from '@/sanity/lib/data'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  // Clean draft-mode stega markers: these strings end up in <head>.
  const settings = stegaClean(await getSiteSettings())
  return {
    title: {
      default: `${settings.title} — ${settings.role}`,
      template: `%s — ${settings.title}`,
    },
    description: `Portfolio of ${settings.title}, ${settings.role.toLowerCase()} based in ${settings.location}. Editorial, product, and brand work.`,
    generator: 'v0.app',
  }
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#161513',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-dvh font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
