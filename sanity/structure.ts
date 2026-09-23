import type { StructureResolver } from 'sanity/structure'

// Singletons for Site Settings and Home Page (fixed document IDs, so opening
// them always edits the same document), plus a normal Projects list.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings'),
        ),
      S.listItem()
        .title('Home Page')
        .id('homePage')
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.divider(),
      S.documentTypeListItem('project')
        .title('Projects')
        .child(
          S.documentTypeList('project')
            .title('Projects')
            .defaultOrdering([
              { field: 'orderRank', direction: 'asc' },
              { field: 'year', direction: 'desc' },
            ]),
        ),
    ])
