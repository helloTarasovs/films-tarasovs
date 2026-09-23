export const site = {
  name: 'Aria Calloway',
  role: 'Design Engineer & Art Director',
  email: 'hello@ariacalloway.com',
  location: 'Brooklyn, New York',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Are.na', href: 'https://are.na' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'Read.cv', href: 'https://read.cv' },
  ],
}

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
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
    image: '/project-01.png',
  },
  {
    slug: 'the-quarterly',
    title: 'The Quarterly',
    category: 'Editorial · Art Direction',
    year: '2024',
    summary:
      'An independent print magazine on design and its discontents. Bold serifs, generous margins, ink on cream.',
    image: '/project-02.png',
  },
  {
    slug: 'lumen',
    title: 'Lumen',
    category: 'Mobile · Motion',
    year: '2024',
    summary:
      'A nightly reflection app built around a single warm light. Interface design, prototyping, and micro-interactions.',
    image: '/project-03.png',
  },
  {
    slug: 'foundry',
    title: 'Foundry',
    category: 'Brand · Identity',
    year: '2023',
    summary:
      'A full identity system for an independent type foundry — mark, stationery, and a living specimen site.',
    image: '/project-04.png',
  },
]
