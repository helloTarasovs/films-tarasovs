import { defineArrayMember, defineField, defineType } from 'sanity'
import { altTextField } from './fields'

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'featured', title: 'Featured work' },
    { name: 'statement', title: 'Statement' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'heroEyebrow',
      title: 'Hero eyebrow',
      type: 'string',
      group: 'hero',
      description:
        'Small uppercase label above the heading. Defaults to the role from Site Settings.',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero heading',
      type: 'text',
      rows: 2,
      group: 'hero',
      description: 'The large page heading (H1).',
      validation: (rule) => rule.max(120).warning('Long headings wrap awkwardly at this size.'),
    }),
    defineField({
      name: 'heroParagraph',
      title: 'Hero paragraph',
      type: 'text',
      rows: 4,
      group: 'hero',
      description: 'Intro text under the heading.',
    }),
    defineField({
      name: 'primaryCta',
      title: 'Primary CTA',
      type: 'navLink',
      group: 'hero',
      description: 'Filled button, e.g. "View selected work" → /projects.',
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Secondary CTA',
      type: 'navLink',
      group: 'hero',
      description: 'Text link next to the button, e.g. "More about me" → /about.',
    }),
    defineField({
      name: 'featuredHeading',
      title: 'Section heading',
      type: 'string',
      group: 'featured',
      description: 'e.g. "Selected work".',
    }),
    defineField({
      name: 'featuredLink',
      title: 'Section link',
      type: 'navLink',
      group: 'featured',
      description: 'Link at the right of the heading (hidden on mobile), e.g. "All projects".',
    }),
    defineField({
      name: 'featuredProjects',
      title: 'Featured projects',
      type: 'array',
      group: 'featured',
      description:
        'Pick and order up to 4 projects. Leave empty to show projects marked "Featured", or the first two projects.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'project' }],
        }),
      ],
      validation: (rule) => rule.max(4).unique(),
    }),
    defineField({
      name: 'statement',
      title: 'Statement',
      type: 'text',
      rows: 3,
      group: 'statement',
      description: 'Large quote-style paragraph at the bottom of the homepage.',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      group: 'seo',
      description:
        'Browser tab and search result title. Leave empty to use "{Site name} — {Role}".',
      validation: (rule) => rule.max(70).warning('Search engines usually truncate after ~60 characters.'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Search result snippet. Leave empty to use the site default.',
      validation: (rule) => rule.max(170).warning('Aim for 120–160 characters.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph image',
      type: 'image',
      group: 'seo',
      description: 'Shown when the site is shared on social media. Cropped to 1200 × 630.',
      options: { hotspot: true },
      fields: [altTextField],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Home Page' }),
  },
})
