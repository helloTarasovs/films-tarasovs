import type { MetadataRoute } from 'next'
import { getSiteContent } from '@/sanity/lib/data'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { site } = await getSiteContent()
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/studio', '/api/'] },
    sitemap: `${site.url}/sitemap.xml`,
  }
}
