import { defineArrayMember, defineField, defineType } from 'sanity'
import { altTextField } from './fields'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'details', title: 'Details' },
    { name: 'media', title: 'Media' },
    { name: 'link', title: 'Link' },
    { name: 'settings', title: 'Display' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: 'Generated from the title. Used as the project identifier in URLs.',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Short description',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'One or two sentences shown on project cards.',
      validation: (rule) => rule.max(240).warning('Cards read best under ~200 characters.'),
    }),
    defineField({
      name: 'description',
      title: 'Full description',
      type: 'array',
      group: 'content',
      description:
        'Longer case-study text. Stored for a future project detail page; not shown on the site yet.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
        }),
      ],
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      group: 'details',
      description: 'Four-digit year, e.g. 2025.',
      validation: (rule) =>
        rule.regex(/^\d{4}$/, { name: 'year' }).warning('Use a four-digit year, e.g. 2025.'),
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      group: 'details',
      description: 'e.g. Product Design, Engineering. Press Enter after each one.',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'category',
      title: 'Card label',
      type: 'string',
      group: 'details',
      description:
        'Label shown on project cards, e.g. "Product Design · Engineering". Leave empty to join the services with " · ".',
    }),
    defineField({
      name: 'image',
      title: 'Cover image',
      type: 'image',
      group: 'media',
      description: 'Shown on project cards, cropped to 4:3. Use the hotspot to control the crop.',
      options: { hotspot: true },
      fields: [altTextField],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'media',
      description: 'Additional images. Stored for a future project detail page; not shown on the site yet.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [altTextField],
        }),
      ],
    }),
    defineField({
      name: 'projectUrl',
      title: 'Project URL',
      type: 'url',
      group: 'link',
      description: 'Live site or case study link. Not shown on the site yet.',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA label',
      type: 'string',
      group: 'link',
      description: 'Link text for the project URL, e.g. "Visit site".',
      hidden: ({ parent }) => !parent?.projectUrl,
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'settings',
      description:
        'Show on the homepage when no projects are hand-picked in Home Page → Featured projects.',
      initialValue: false,
    }),
    defineField({
      name: 'orderRank',
      title: 'Display order',
      type: 'number',
      group: 'settings',
      description: 'Lower numbers appear first on the Projects page.',
      validation: (rule) => rule.integer().min(0),
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'orderRankAsc',
      by: [
        { field: 'orderRank', direction: 'asc' },
        { field: 'year', direction: 'desc' },
      ],
    },
    {
      title: 'Year, newest first',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      year: 'year',
      featured: 'featured',
      media: 'image',
    },
    prepare: ({ title, category, year, featured, media }) => ({
      title: featured ? `★ ${title ?? ''}` : title,
      subtitle: [category, year].filter(Boolean).join(' · '),
      media,
    }),
  },
})
