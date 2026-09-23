import { defineArrayMember, defineField, defineType } from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'header', title: 'Header' },
    { name: 'footer', title: 'Footer' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Site name',
      type: 'string',
      group: 'general',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / tagline',
      type: 'string',
      group: 'general',
    }),
    defineField({
      name: 'email',
      title: 'Contact email',
      type: 'string',
      group: 'general',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'general',
    }),
    defineField({
      name: 'navLinks',
      title: 'Header navigation',
      type: 'array',
      group: 'header',
      of: [defineArrayMember({ type: 'navLink' })],
    }),
    defineField({
      name: 'socials',
      title: 'Social links',
      type: 'array',
      group: 'footer',
      of: [defineArrayMember({ type: 'navLink' })],
    }),
    defineField({
      name: 'footerHeading',
      title: 'Footer heading',
      type: 'string',
      group: 'footer',
    }),
    defineField({
      name: 'footerCtaLabel',
      title: 'Footer CTA label',
      type: 'string',
      group: 'footer',
    }),
    defineField({
      name: 'footerCtaHref',
      title: 'Footer CTA link',
      type: 'string',
      group: 'footer',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
})
