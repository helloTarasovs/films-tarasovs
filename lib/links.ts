/** Extra anchor attributes for links an editor marked "Open in new tab". */
export function linkTargetProps(link: { openInNewTab?: boolean }) {
  return link.openInNewTab
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}
}
