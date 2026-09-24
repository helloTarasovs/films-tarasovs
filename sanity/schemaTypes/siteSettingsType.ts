import { defineArrayMember, defineField, defineType } from 'sanity'
import { legacyField, noEmDash, validateHref } from './fields'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'header', title: 'Header' },
    { name: 'footer', title: 'Footer & social' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Name',
      type: 'string',
      group: 'general',
      description: 'The wordmark in the header and footer, e.g. "Yurii Tarasov". Also used in page titles.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'descriptor',
      title: 'Descriptor',
      type: 'string',
      group: 'general',
      description: 'Small uppercase word after the name, e.g. "Films" (matches films.tarasovs.me).',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      group: 'general',
      description: 'e.g. "AI film & motion director". Used in the footer and page titles.',
      validation: (rule) => rule.custom(noEmDash).warning(),
    }),
    defineField({
      name: 'email',
      title: 'Contact email',
      type: 'string',
      group: 'general',
      description: 'Shown large in the Contact section, with "Copy email".',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'general',
      description: 'City shown in the footer fine print, e.g. "Timișoara".',
    }),
    defineField({
      name: 'startProject',
      title: '"Start a project" link',
      type: 'navLink',
      group: 'general',
      description:
        'Used by every "Start a project" button (header, hero, menu, contact). For now a mailto: link; later the brief form or a Calendly link.',
    }),

    defineField({
      name: 'navLinks',
      title: 'Navigation',
      type: 'array',
      group: 'header',
      description:
        'Header, mobile menu and footer. Point to homepage sections: /#work, /#approach, /#about, /#contact.',
      of: [defineArrayMember({ type: 'navLink' })],
      validation: (rule) => rule.max(5),
    }),

    defineField({
      name: 'agency',
      title: 'Agency credit',
      type: 'navLink',
      group: 'footer',
      description: 'The one footer link to the agency, e.g. "Part of Tarasovs Digital Agency" → https://tarasovs.me.',
    }),
    defineField({
      name: 'socials',
      title: 'Social links',
      type: 'array',
      group: 'footer',
      description: 'Footer, right side. Up to three reads best (e.g. Instagram, Vimeo, LinkedIn).',
      of: [defineArrayMember({ type: 'socialLink' })],
    }),

    // Legacy fields from the previous footer design. Hidden while empty.
    defineField({ name: 'footerHeading', title: 'Footer heading', type: 'string', group: 'footer', ...legacyField }),
    defineField({ name: 'footerCtaLabel', title: 'Footer CTA label', type: 'string', group: 'footer', ...legacyField }),
    defineField({ name: 'footerCtaHref', title: 'Footer CTA link', type: 'string', group: 'footer', ...legacyField, validation: (rule) => validateHref(rule) }),
    defineField({ name: 'footerNavHeading', title: 'Footer navigation heading', type: 'string', group: 'footer', ...legacyField }),
    defineField({ name: 'footerNav', title: 'Footer navigation', type: 'array', group: 'footer', of: [defineArrayMember({ type: 'navLink' })], ...legacyField }),
    defineField({ name: 'contactHeading', title: 'Footer contact heading', type: 'string', group: 'footer', ...legacyField }),
    defineField({ name: 'socialsHeading', title: 'Social links heading', type: 'string', group: 'footer', ...legacyField }),
    defineField({ name: 'copyrightText', title: 'Copyright text', type: 'string', group: 'footer', ...legacyField }),
    defineField({ name: 'footerNote', title: 'Footer note', type: 'string', group: 'footer', ...legacyField }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
})
