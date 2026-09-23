/** Shared by the Studio schema and the frontend (label fallback). No deps. */
export const socialPlatforms = [
  { title: 'Instagram', value: 'instagram' },
  { title: 'LinkedIn', value: 'linkedin' },
  { title: 'Are.na', value: 'arena' },
  { title: 'Read.cv', value: 'readcv' },
  { title: 'X / Twitter', value: 'x' },
  { title: 'GitHub', value: 'github' },
  { title: 'Dribbble', value: 'dribbble' },
  { title: 'Behance', value: 'behance' },
  { title: 'Other', value: 'other' },
] as const

export function socialPlatformTitle(value: string | undefined) {
  return socialPlatforms.find((p) => p.value === value)?.title
}
