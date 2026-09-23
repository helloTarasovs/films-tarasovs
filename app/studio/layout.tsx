import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Studio',
  // Keep the CMS out of search engines.
  robots: { index: false, follow: false },
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
