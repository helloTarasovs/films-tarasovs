import { defineArrayMember, defineField, defineType } from 'sanity'
import { altTextField, legacyField, noEmDash } from './fields'

/** One film. Field names predate the redesign; titles describe the current use. */
export const projectType = defineType({
  name: 'project',
  title: 'Film',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'media', title: 'Media' },
    { name: 'details', title: 'Details' },
    { name: 'settings', title: 'Display' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => [rule.required(), rule.custom(noEmDash).warning()],
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: 'Generated from the title. Used as the film identifier in URLs.',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      description: 'Short and concrete, e.g. "Launch film", "Product film", "Motion study".',
      validation: (rule) => [rule.required(), rule.custom(noEmDash).warning()],
    }),
    defineField({
      name: 'kind',
      title: 'Type',
      type: 'string',
      group: 'content',
      description: 'Commissioned = made for a client. Self-initiated = your own concept.',
      options: {
        list: [
          { title: 'Commissioned', value: 'commissioned' },
          { title: 'Self-initiated', value: 'self-initiated' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'self-initiated',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Description',
      type: 'text',
      rows: 3,
      group: 'content',
      description:
        'One or two sentences in first person. Shown when the film sits in the text + film layout.',
      validation: (rule) => [
        rule.max(240).warning('Keep it to one or two sentences.'),
        rule.custom(noEmDash).warning(),
      ],
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      group: 'content',
      description: 'What you did, e.g. "Direction, edit, sound".',
      validation: (rule) => rule.custom(noEmDash).warning(),
    }),

    defineField({
      name: 'ratio',
      title: 'Aspect ratio',
      type: 'string',
      group: 'media',
      description: 'The frame keeps this ratio, so vertical films are never cropped into landscape.',
      options: {
        list: [
          { title: '16:9 (landscape)', value: '16:9' },
          { title: '2.39:1 (cinema wide)', value: '2.39:1' },
          { title: '9:16 (vertical)', value: '9:16' },
          { title: '4:5 (social)', value: '4:5' },
        ],
        layout: 'radio',
      },
      initialValue: '16:9',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Poster',
      type: 'image',
      group: 'media',
      description:
        'The first graded frame, at the film’s aspect ratio. Shown until the preview plays. Use the hotspot to keep the subject in frame.',
      options: { hotspot: true },
      fields: [altTextField],
    }),
    defineField({
      name: 'previewUrl',
      title: 'Preview loop URL',
      type: 'url',
      group: 'media',
      description:
        'Muted 6–8 s loop, 720p, under 2 MB (e.g. your CloudFront .mp4). Plays on hover, or when in view on phones.',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'projectUrl',
      title: 'Watch link',
      type: 'url',
      group: 'media',
      description: 'Where "Watch film" leads: the full film file, Vimeo or YouTube. Leave empty while the film is in edit.',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'gallery',
      title: 'Stills',
      type: 'array',
      group: 'media',
      description: 'Additional stills for a future film page. Not shown on the site yet.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [altTextField],
        }),
      ],
    }),

    defineField({
      name: 'runtime',
      title: 'Runtime',
      type: 'string',
      group: 'details',
      description: 'Minutes and seconds, e.g. 01:24 or 0:15.',
      validation: (rule) =>
        rule.regex(/^\d{1,2}:\d{2}$/, { name: 'runtime' }).warning('Use m:ss or mm:ss, e.g. 01:24.'),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      group: 'details',
      description: 'Four-digit year, e.g. 2026.',
      validation: (rule) =>
        rule.regex(/^\d{4}$/, { name: 'year' }).warning('Use a four-digit year, e.g. 2026.'),
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      group: 'details',
      description: 'Only for commissioned work, and only if you may name them.',
      hidden: ({ parent }) => parent?.kind === 'self-initiated',
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      group: 'details',
      description: 'Optional tags, e.g. Direction, Edit, Sound. Press Enter after each one.',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'description',
      title: 'Case notes',
      type: 'array',
      group: 'details',
      description: 'Longer notes for a future film page. Not shown on the site yet.',
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
      name: 'orderRank',
      title: 'Display order',
      type: 'number',
      group: 'settings',
      description:
        'Lower numbers come first. Unless films are hand-picked on the Home Page, this order defines the editorial sequence (01 wide feature, 02–03 pair, 04 text + film, 05–07 verticals, 08 full-bleed, 09 closing).',
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: 'featured',
      title: 'Show on homepage',
      type: 'boolean',
      group: 'settings',
      description: 'Used when no films are hand-picked on the Home Page.',
      initialValue: true,
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA label',
      type: 'string',
      group: 'settings',
      ...legacyField,
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
      ratio: 'ratio',
      runtime: 'runtime',
      kind: 'kind',
      media: 'image',
    },
    prepare: ({ title, category, ratio, runtime, kind, media }) => ({
      title,
      subtitle: [category, ratio, runtime, kind === 'commissioned' ? 'Commissioned' : 'Self-initiated']
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
})
