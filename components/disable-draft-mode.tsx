'use client'

import { useIsPresentationTool } from 'next-sanity/hooks'

export function DisableDraftMode() {
  const isPresentation = useIsPresentationTool()

  // Inside the Studio Presentation tool the draft toggle is handled by the
  // tool itself, so only surface the exit control on the standalone live site.
  if (isPresentation !== false) {
    return null
  }

  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed bottom-4 right-4 z-[100] rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg"
    >
      Exit draft mode
    </a>
  )
}
