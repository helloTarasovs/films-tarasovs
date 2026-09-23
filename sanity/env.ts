export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01'

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || ''

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''

/**
 * Sanity only works once a project ID and dataset are provided. Until then the
 * site renders with hardcoded fallback content instead of throwing.
 */
export const isSanityConfigured = Boolean(projectId && dataset)
