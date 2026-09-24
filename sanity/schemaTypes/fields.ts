import { defineField, type StringRule } from 'sanity'

/**
 * Accepts the link formats the site actually uses:
 * internal paths (/about, /#projects), in-page anchors (#projects),
 * absolute http(s) URLs, mailto: and tel: links.
 */
const HREF_PATTERN =
  /^(\/[^\s]*|#[A-Za-z][\w-]*|https?:\/\/[^\s]+|mailto:[^\s@]+@[^\s@]+|tel:\+?[\d\s()-]+)$/

export function validateHref(rule: StringRule) {
  return rule.custom((value) => {
    if (!value) return true
    return HREF_PATTERN.test(value.trim())
      ? true
      : 'Use a path (/about), an anchor (#projects), a full URL (https://…), or mailto:/tel:'
  })
}

/** Alt text that becomes required as soon as an image is uploaded. */
export const altTextField = defineField({
  name: 'alt',
  title: 'Alt text',
  type: 'string',
  description:
    'Describe the image for screen readers and search engines. Required when an image is set.',
  validation: (rule) =>
    rule.custom((alt, context) => {
      const parent = context.parent as { asset?: { _ref?: string } } | undefined
      if (parent?.asset?._ref && !alt?.trim()) {
        return 'Alt text is required when an image is provided'
      }
      return true
    }),
})

/**
 * Brand rule (docs/design-handoff/design-system/brand-book.md): no em dashes in
 * copy. Use as `rule.custom(noEmDash).warning()` so it never blocks publishing.
 */
export function noEmDash(value: unknown) {
  const text = Array.isArray(value) ? value.join(' ') : typeof value === 'string' ? value : ''
  return text.includes('—') ? 'Avoid em dashes (—): use a comma, colon, full stop or ·' : true
}

/** Fields kept only so existing data isn't lost: hidden while empty. */
export const legacyField = {
  hidden: ({ value }: { value?: unknown }) => value === undefined || value === null || value === '',
  description: 'Legacy field from the previous design. Not shown on the site; safe to clear.',
}
