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
