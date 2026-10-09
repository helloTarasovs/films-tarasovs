export const site = {
  name: 'Yurii Tarasov',
  role: 'AI film & motion director',
  email: 'hello@tarasovs.me',
  location: 'Timișoara, Romania',
  socials: [{ label: 'Instagram', href: 'https://www.instagram.com/tarasovs.me/' }],
}

// Landing page sections. Used until Header navigation is set in Sanity.
export const navLinks = [
  { label: 'Work', href: '/#work' },
  { label: 'Approach', href: '/#approach' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
]

export type Project = {
  slug: string
  title: string
  category: string
  year: string
  summary: string
  image: string
}

export const projects: Project[] = [
  {
    slug: 'meridian',
    title: 'Meridian',
    category: 'Product Design · Engineering',
    year: '2025',
    summary:
      'A calm financial dashboard rethinking how people read their money. Warm, quiet, and legible under pressure.',
    image: '',
  },
  {
    slug: 'the-quarterly',
    title: 'The Quarterly',
    category: 'Editorial · Art Direction',
    year: '2024',
    summary:
      'An independent print magazine on design and its discontents. Bold serifs, generous margins, ink on cream.',
    image: '',
  },
  {
    slug: 'lumen',
    title: 'Lumen',
    category: 'Mobile · Motion',
    year: '2024',
    summary:
      'A nightly reflection app built around a single warm light. Interface design, prototyping, and micro-interactions.',
    image: '',
  },
  {
    slug: 'foundry',
    title: 'Foundry',
    category: 'Brand · Identity',
    year: '2023',
    summary:
      'A full identity system for an independent type foundry — mark, stationery, and a living specimen site.',
    image: '',
  },
]
