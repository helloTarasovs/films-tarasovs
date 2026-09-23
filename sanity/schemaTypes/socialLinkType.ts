import { defineField, defineType } from 'sanity'
import { socialPlatforms } from '../lib/socialPlatforms'

export const socialLinkType = defineType({
  name: 'socialLink',
  title: 'Social link',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: { list: [...socialPlatforms] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Text shown on the site. Defaults to the platform name.',
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'url',
      validation: (rule) =>
        rule.required().uri({ scheme: ['http', 'https', 'mailto'] }),
    }),
  ],
  preview: {
    select: { title: 'label', platform: 'platform', subtitle: 'href' },
    prepare: ({ title, platform, subtitle }) => ({
      title:
        title ||
        socialPlatforms.find((p) => p.value === platform)?.title ||
        'Social link',
      subtitle,
    }),
  },
})
