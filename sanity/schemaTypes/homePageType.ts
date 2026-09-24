import { defineArrayMember, defineField, defineType } from 'sanity'
import { altTextField, legacyField, noEmDash } from './fields'

/** Heading with an optional second phrase set in the quieter secondary colour. */
const heading = (name: string, group: string, example: string) => [
  defineField({
    name: `${name}Heading`,
    title: 'Heading',
    type: 'string',
    group,
    description: `First phrase, e.g. "${example}"`,
    validation: (rule) => rule.custom(noEmDash).warning(),
  }),
  defineField({
    name: `${name}HeadingContrast`,
    title: 'Heading, second phrase',
    type: 'string',
    group,
    description: 'Optional. Same size, quieter colour. No italics in this design.',
    validation: (rule) => rule.custom(noEmDash).warning(),
  }),
  defineField({
    name: `${name}Note`,
    title: 'Note',
    type: 'text',
    rows: 2,
    group,
    description: 'One short line beside the heading.',
    validation: (rule) => rule.custom(noEmDash).warning(),
  }),
]

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'work', title: 'Selected work' },
    { name: 'formats', title: 'What I make' },
    { name: 'approach', title: 'Approach' },
    { name: 'about', title: 'About' },
    { name: 'contact', title: 'Contact' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    /* ---------------------------------- Hero --------------------------------- */
    defineField({
      name: 'heroLines',
      title: 'Headline',
      type: 'array',
      group: 'hero',
      description: 'Two short lines, e.g. "Directed films," / "made with AI."',
      of: [defineArrayMember({ type: 'string' })],
      validation: (rule) => [rule.max(2), rule.custom(noEmDash).warning()],
    }),
    defineField({
      name: 'heroIntro',
      title: 'Intro',
      type: 'text',
      rows: 3,
      group: 'hero',
      description: 'Two sentences in first person, beside the headline on desktop.',
      validation: (rule) => rule.custom(noEmDash).warning(),
    }),
    defineField({
      name: 'heroIntroMobile',
      title: 'Intro, mobile',
      type: 'string',
      group: 'hero',
      description: 'Optional shorter version for phones. Leave empty to use the intro.',
      validation: (rule) => rule.custom(noEmDash).warning(),
    }),
    defineField({
      name: 'heroVideoUrl',
      title: 'Hero video URL',
      type: 'url',
      group: 'hero',
      description:
        'Muted loop (.mp4), ideally under 6 MB. Keep the bottom third darker than 85% lightness so the text stays readable.',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'heroPoster',
      title: 'Hero poster',
      type: 'image',
      group: 'hero',
      description: 'First frame of the loop. Shown until the video plays, and instead of it for reduced-motion visitors.',
      options: { hotspot: true },
      fields: [altTextField],
    }),
    defineField({
      name: 'nowShowing',
      title: '"Now showing" film',
      type: 'reference',
      group: 'hero',
      description: 'The film the hero loop comes from. Its title, category and runtime appear in the caption.',
      to: [{ type: 'project' }],
    }),

    /* ------------------------------ Selected work ----------------------------- */
    ...heading('work', 'work', 'Nine films.'),
    defineField({
      name: 'workNoteMobile',
      title: 'Note, mobile',
      type: 'string',
      group: 'work',
      description: 'Optional shorter note for phones.',
      validation: (rule) => rule.custom(noEmDash).warning(),
    }),
    defineField({
      name: 'featuredProjects',
      title: 'Films, in order',
      type: 'array',
      group: 'work',
      description:
        'Pick up to 9 films. Position sets the layout: 1 wide feature, 2–3 staggered pair (3 should be vertical), 4 text + film, 5–7 verticals, 8 full-bleed, 9 closing. Leave empty to use Display order.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'project' }] })],
      validation: (rule) => rule.max(9).unique(),
    }),
    defineField({
      name: 'phoneLabel',
      title: 'Verticals label',
      type: 'string',
      group: 'work',
      description: 'Small label above films 5–7, e.g. "Made for the phone".',
    }),
    defineField({
      name: 'archiveNote',
      title: 'Archive note',
      type: 'string',
      group: 'work',
      description: 'Beside the last film, e.g. "Case notes, stills and credits for every film live in the archive."',
      validation: (rule) => rule.custom(noEmDash).warning(),
    }),

    /* ------------------------------- What I make ------------------------------ */
    ...heading('formats', 'formats', 'Five formats.'),
    defineField({
      name: 'formats',
      title: 'Formats',
      type: 'array',
      group: 'formats',
      description: 'The typographic list. Five reads best.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'format',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required() }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'string',
              description: 'One sentence.',
              validation: (rule) => rule.custom(noEmDash).warning(),
            }),
            defineField({
              name: 'spec',
              title: 'Spec',
              type: 'array',
              description: 'Two short mono lines: ratios, then typical length, e.g. "16:9 · 2.39:1" and "0:30 – 1:30".',
              of: [defineArrayMember({ type: 'string' })],
              validation: (rule) => rule.max(2),
            }),
          ],
          preview: { select: { title: 'name', subtitle: 'description' } },
        }),
      ],
    }),

    /* -------------------------------- Approach -------------------------------- */
    ...heading('approach', 'approach', 'Directed first.'),
    defineField({
      name: 'approachSteps',
      title: 'Steps',
      type: 'array',
      group: 'approach',
      description: 'The stages in order; numbered automatically. Five fit one row on desktop.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'step',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required() }),
            defineField({
              name: 'line',
              title: 'Line',
              type: 'string',
              description: 'One precise sentence.',
              validation: (rule) => rule.custom(noEmDash).warning(),
            }),
          ],
          preview: { select: { title: 'name', subtitle: 'line' } },
        }),
      ],
      validation: (rule) => rule.max(5),
    }),

    /* ---------------------------------- About --------------------------------- */
    defineField({
      name: 'aboutLead',
      title: 'Lead',
      type: 'text',
      rows: 2,
      group: 'about',
      description: 'One sentence in first person, set large.',
      validation: (rule) => rule.custom(noEmDash).warning(),
    }),
    defineField({
      name: 'aboutBody',
      title: 'Body',
      type: 'text',
      rows: 4,
      group: 'about',
      validation: (rule) => rule.custom(noEmDash).warning(),
    }),
    defineField({
      name: 'aboutPortrait',
      title: 'Portrait',
      type: 'image',
      group: 'about',
      description: '4:5 portrait. A placeholder frame is shown until one is added.',
      options: { hotspot: true },
      fields: [altTextField],
    }),
    defineField({
      name: 'aboutFacts',
      title: 'Facts',
      type: 'array',
      group: 'about',
      description: 'Short, checkable facts, e.g. Based in / Works with / Languages. No ratings or counters.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'fact',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'value', title: 'Value', type: 'string', validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        }),
      ],
    }),

    /* --------------------------------- Contact -------------------------------- */
    defineField({
      name: 'contactLead',
      title: 'Question',
      type: 'string',
      group: 'contact',
      description: 'Above the email, e.g. "Have a film in mind?"',
      validation: (rule) => rule.custom(noEmDash).warning(),
    }),
    defineField({
      name: 'contactResponse',
      title: 'Response time',
      type: 'string',
      group: 'contact',
      description: 'Only if true, e.g. "Replies within two working days".',
    }),

    /* ----------------------------------- SEO ---------------------------------- */
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      group: 'seo',
      description: 'Browser tab and search result title. Leave empty to use "{Name}, {Role}".',
      validation: (rule) => [
        rule.max(70).warning('Search engines usually truncate after ~60 characters.'),
        rule.custom(noEmDash).warning(),
      ],
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Search result snippet. Leave empty to use the site default.',
      validation: (rule) => [rule.max(170).warning('Aim for 120–160 characters.'), rule.custom(noEmDash).warning()],
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph image',
      type: 'image',
      group: 'seo',
      description: 'A film still, shown when the site is shared. Cropped to 1200 × 630.',
      options: { hotspot: true },
      fields: [altTextField],
    }),

    /* --------------------- Legacy fields (previous design) --------------------- */
    defineField({ name: 'heroEyebrow', title: 'Hero eyebrow', type: 'string', group: 'hero', ...legacyField }),
    defineField({ name: 'heroHeading', title: 'Hero heading', type: 'text', group: 'hero', ...legacyField }),
    defineField({ name: 'heroParagraph', title: 'Hero paragraph', type: 'text', group: 'hero', ...legacyField }),
    defineField({ name: 'primaryCta', title: 'Primary CTA', type: 'navLink', group: 'hero', ...legacyField }),
    defineField({ name: 'secondaryCta', title: 'Secondary CTA', type: 'navLink', group: 'hero', ...legacyField }),
    defineField({ name: 'featuredHeading', title: 'Featured heading', type: 'string', group: 'work', ...legacyField }),
    defineField({ name: 'featuredLink', title: 'Featured link', type: 'navLink', group: 'work', ...legacyField }),
    defineField({ name: 'statement', title: 'Statement', type: 'text', group: 'work', ...legacyField }),
  ],
  preview: {
    prepare: () => ({ title: 'Home Page' }),
  },
})
