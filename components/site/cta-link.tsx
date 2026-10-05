'use client'

import { track } from '@vercel/analytics'

/** Primary "contact" action. Reports where it was clicked; never any personal data. */
export function CtaLink({
  location,
  onClick,
  ...props
}: React.ComponentProps<'a'> & { location: 'header' | 'menu' | 'hero' | 'contact-block' }) {
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content -- children come through props
    <a
      {...props}
      onClick={(e) => {
        track('contact_cta_click', { location })
        onClick?.(e)
      }}
    />
  )
}
