import 'server-only'
import { draftMode } from 'next/headers'
import { client } from './client'
import { token } from './token'
import { isSanityConfigured } from '../env'

type FetchParams = {
  query: string
  params?: Record<string, unknown>
}

/**
 * Server-side fetch that:
 * - returns `null` when Sanity isn't configured yet (callers fall back to
 *   hardcoded content),
 * - uses the CDN + published perspective in normal rendering,
 * - switches to the draft perspective with the server-only read token when
 *   Next.js draft mode is enabled (draft preview support).
 */
export async function sanityFetch<T>({
  query,
  params = {},
}: FetchParams): Promise<T | null> {
  if (!isSanityConfigured) return null

  const isDraft = (await draftMode()).isEnabled

  try {
    return await client.fetch<T>(
      query,
      params,
      isDraft
        ? {
            perspective: 'drafts',
            useCdn: false,
            token,
            stega: true,
            next: { revalidate: 0 },
          }
        : {
            perspective: 'published',
            useCdn: true,
            next: { revalidate: 60 },
          },
    )
  } catch (error) {
    console.log('[v0] Sanity fetch failed:', (error as Error).message)
    return null
  }
}
