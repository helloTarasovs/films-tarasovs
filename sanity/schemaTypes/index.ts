import { type SchemaTypeDefinition } from 'sanity'
import { linkType } from './linkType'
import { siteSettingsType } from './siteSettingsType'
import { homePageType } from './homePageType'
import { projectType } from './projectType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [linkType, siteSettingsType, homePageType, projectType],
}
