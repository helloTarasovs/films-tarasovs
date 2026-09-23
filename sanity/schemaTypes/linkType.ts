import { defineField, defineType } from 'sanity'
import { validateHref } from './fields'

export const linkType = defineType({
  name: 'navLink',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL or path',
      type: 'string',
      description:
        'An internal path (/about), a homepage section (/#projects, or #projects on the homepage only), a full URL (https://…), or a mailto: link.',
      validation: (rule) => validateHref(rule).required(),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'href' },
  },
})
