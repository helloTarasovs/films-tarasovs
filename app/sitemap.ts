import type { MetadataRoute } from 'next'
import { projectPath } from '@/lib/slug'
import { getProjectSlugs, getSiteContent } from '@/sanity/lib/data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ site }, slugs] = await Promise.all([getSiteContent(), getProjectSlugs()])
  return [
    { url: site.url, changeFrequency: 'monthly', priority: 1 },
    { url: `${site.url}/contact`, changeFrequency: 'yearly', priority: 0.5 },
    ...slugs.map((slug) => ({
      url: `${site.url}${projectPath(slug)}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
