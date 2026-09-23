import { defineArrayMember, defineField, defineType } from 'sanity'
import { validateHref } from './fields'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'header', title: 'Header' },
    { name: 'footer', title: 'Footer' },
    { name: 'social', title: 'Social' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Site name',
      type: 'string',
      group: 'general',
      description:
        'Shown as the wordmark in the header, in the copyright line, and in browser tab titles.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / tagline',
      type: 'string',
      group: 'general',
      description:
        'e.g. "Design Engineer & Art Director". Used in the default page title and as the homepage eyebrow fallback.',
    }),
    defineField({
      name: 'email',
      title: 'Contact email',
      type: 'string',
      group: 'general',
      description: 'Shown in the footer and on the Contact page as a mailto: link.',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'general',
      description: 'e.g. "Brooklyn, New York". Shown in the footer and Contact page.',
    }),
    defineField({
      name: 'navLinks',
      title: 'Header navigation',
      type: 'array',
      group: 'header',
      description:
        'Links in the top navigation. Also used for the footer "Pages" column unless Footer navigation is set.',
      of: [defineArrayMember({ type: 'navLink' })],
    }),
    defineField({
      name: 'footerHeading',
      title: 'Footer heading',
      type: 'string',
      group: 'footer',
      description: 'Large text at the top-left of the footer, e.g. "Have a project in mind?"',
    }),
    defineField({
      name: 'footerCtaLabel',
      title: 'Footer CTA label',
      type: 'string',
      group: 'footer',
      description: 'Link text under the footer heading.',
    }),
    defineField({
      name: 'footerCtaHref',
      title: 'Footer CTA link',
      type: 'string',
      group: 'footer',
      description: 'A path (/contact), a full URL, or a mailto: link.',
      validation: (rule) => validateHref(rule),
    }),
    defineField({
      name: 'footerNavHeading',
      title: 'Footer navigation heading',
      type: 'string',
      group: 'footer',
      description: 'Defaults to "Pages".',
    }),
    defineField({
      name: 'footerNav',
      title: 'Footer navigation',
      type: 'array',
      group: 'footer',
      description: 'Leave empty to repeat the header navigation.',
      of: [defineArrayMember({ type: 'navLink' })],
    }),
    defineField({
      name: 'contactHeading',
      title: 'Footer contact heading',
      type: 'string',
      group: 'footer',
      description: 'Defaults to "Contact".',
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright text',
      type: 'string',
      group: 'footer',
      description:
        'Shown after "© {current year}". Defaults to "{Site name}. All rights reserved."',
    }),
    defineField({
      name: 'footerNote',
      title: 'Footer note',
      type: 'string',
      group: 'footer',
      description:
        'Small text at the bottom-right of the footer. Defaults to "Designed & built in {Location}."',
    }),
    defineField({
      name: 'socialsHeading',
      title: 'Social links heading',
      type: 'string',
      group: 'social',
      description: 'Footer column heading. Defaults to "Elsewhere".',
    }),
    defineField({
      name: 'socials',
      title: 'Social links',
      type: 'array',
      group: 'social',
      description: 'Shown in the footer and on the Contact page. Open in a new tab.',
      of: [defineArrayMember({ type: 'socialLink' })],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
})
