import type { MetadataRoute } from 'next'
import { getSiteContent } from '@/sanity/lib/data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { site } = await getSiteContent()
  return [
    { url: site.url, changeFrequency: 'monthly', priority: 1 },
    { url: `${site.url}/contact`, changeFrequency: 'yearly', priority: 0.5 },
  ]
}
