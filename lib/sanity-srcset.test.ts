import { describe, expect, it } from 'vitest'
import { CARD_WIDTHS, sanityImageAttrs } from './sanity-srcset'

const sanityUrl = (query: string) =>
  `https://cdn.sanity.io/images/abc123/production/poster-1600x900.jpg?${query}`

describe('sanityImageAttrs', () => {
  it('returns the URL unchanged for non-Sanity images', () => {
    const url = 'https://media.tarasovs.me/poster.jpg'
    expect(sanityImageAttrs(url, CARD_WIDTHS)).toEqual({ src: url })
  })

  it('returns the input unchanged when it is not a valid URL', () => {
    expect(sanityImageAttrs('/local/poster.jpg', CARD_WIDTHS)).toEqual({ src: '/local/poster.jpg' })
  })

  it('never requests a width larger than the original', () => {
    const { srcSet } = sanityImageAttrs(sanityUrl('w=720&h=405'), CARD_WIDTHS)
    const widths = srcSet!.split(', ').map((entry) => Number(entry.split(' ').pop()!.replace('w', '')))
    expect(widths).toEqual([360, 540, 720])
  })

  it('keeps the aspect ratio when the original has a height', () => {
    const { srcSet } = sanityImageAttrs(sanityUrl('w=1600&h=900'), [800])
    const variant = new URL(srcSet!.split(' ')[0])
    expect(variant.searchParams.get('w')).toBe('800')
    expect(variant.searchParams.get('h')).toBe('450')
  })

  it('keeps crop parameters such as rect and fit', () => {
    const { srcSet } = sanityImageAttrs(sanityUrl('rect=0,0,1600,900&fit=crop&w=1600&h=900'), [640])
    const variant = new URL(srcSet!.split(' ')[0])
    expect(variant.searchParams.get('rect')).toBe('0,0,1600,900')
    expect(variant.searchParams.get('fit')).toBe('crop')
  })

  it('offers every width when the original has no width parameter', () => {
    const { srcSet } = sanityImageAttrs(sanityUrl('fm=webp'), CARD_WIDTHS)
    expect(srcSet!.split(', ')).toHaveLength(CARD_WIDTHS.length)
  })

  it('falls back to src only when no width fits', () => {
    const url = sanityUrl('w=200&h=100')
    expect(sanityImageAttrs(url, CARD_WIDTHS)).toEqual({ src: url })
  })
})
