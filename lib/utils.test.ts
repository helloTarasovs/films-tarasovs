import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('joins class names and skips falsy values', () => {
    expect(cn('px-4', false && 'hidden', undefined, 'text-sm')).toBe('px-4 text-sm')
  })

  it('lets the last conflicting Tailwind class win', () => {
    expect(cn('px-4 py-2', 'px-6')).toBe('py-2 px-6')
  })
})
