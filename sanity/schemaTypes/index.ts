import { type SchemaTypeDefinition } from 'sanity'
import { linkType } from './linkType'
import { socialLinkType } from './socialLinkType'
import { siteSettingsType } from './siteSettingsType'
import { homePageType } from './homePageType'
import { projectType } from './projectType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [linkType, socialLinkType, siteSettingsType, homePageType, projectType],
}

/** Document types that must only ever exist once, at a fixed `_id`. */
export const singletonTypes = new Set(['siteSettings', 'homePage'])
