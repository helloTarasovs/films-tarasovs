import { defineArrayMember, defineField, defineType } from 'sanity'

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'featured', title: 'Featured work' },
    { name: 'statement', title: 'Statement' },
  ],
  fields: [
    defineField({
      name: 'heroEyebrow',
      title: 'Hero eyebrow',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero heading',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),
    defineField({
      name: 'heroParagraph',
      title: 'Hero paragraph',
      type: 'text',
      rows: 4,
      group: 'hero',
    }),
    defineField({
      name: 'primaryCta',
      title: 'Primary CTA',
      type: 'navLink',
      group: 'hero',
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Secondary CTA',
      type: 'navLink',
      group: 'hero',
    }),
    defineField({
      name: 'featuredHeading',
      title: 'Section heading',
      type: 'string',
      group: 'featured',
    }),
    defineField({
      name: 'featuredLink',
      title: 'Section link',
      type: 'navLink',
      group: 'featured',
    }),
    defineField({
      name: 'featuredProjects',
      title: 'Featured projects',
      type: 'array',
      group: 'featured',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'project' }],
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: 'statement',
      title: 'Statement',
      type: 'text',
      rows: 3,
      group: 'statement',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Home Page' }),
  },
})
