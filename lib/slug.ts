/** URL-safe form of a project slug ("Centra DataCore" -> "centra-datacore"). */
export function urlSlug(slug: string): string {
  return slug
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const projectPath = (slug: string) => `/projects/${urlSlug(slug)}`
