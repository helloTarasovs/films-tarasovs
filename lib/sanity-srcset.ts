/**
 * Responsive variants of a Sanity image URL. Sanity's CDN resizes on the fly, but the
 * site builds poster URLs at one fixed size and `images.unoptimized` disables next/image
 * resizing, so we generate the `srcset` ourselves. Keeps the crop (rect/fit) and the
 * aspect ratio; never asks for more than the URL's own width.
 */
export type ImageAttrs = { src: string; srcSet?: string }

export const CARD_WIDTHS = [360, 540, 720, 960, 1280, 1600]
export const HERO_WIDTHS = [640, 828, 1080, 1440, 1920]

export function sanityImageAttrs(url: string, widths: number[]): ImageAttrs {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return { src: url }
  }
  if (parsed.hostname !== 'cdn.sanity.io') return { src: url }

  const baseW = Number(parsed.searchParams.get('w')) || 0
  const baseH = Number(parsed.searchParams.get('h')) || 0
  const variants = widths.filter((w) => !baseW || w <= baseW)
  if (variants.length === 0) return { src: url }

  const at = (width: number) => {
    const u = new URL(parsed)
    u.searchParams.set('w', String(width))
    if (baseW && baseH) u.searchParams.set('h', String(Math.round((width * baseH) / baseW)))
    return `${u.toString()} ${width}w`
  }
  return { src: url, srcSet: variants.map(at).join(', ') }
}
