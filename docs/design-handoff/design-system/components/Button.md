# Button
Two buttons, one job each: primary starts a project, secondary moves someone through the work.

- **Primary** (`sr-btn sr-btn--primary`): plum `primary` fill with cream `primary-foreground` label (5.55:1). Hover `primary-hover` (4.90:1), pressed `primary-pressed` (6.56:1). Over video it gets a 1px cream inner edge, because the plum fill alone is 1.04:1 against the scrim. One per view; in the header and the contact block it is always "Start a project".
- **Secondary** (`sr-btn--secondary`): transparent, `input` border (3.40:1). Hover: border goes to `foreground`, fill 6% cream.
- **On media** (`sr-btn--on-media`): for use over the hero scrim. 55% scrim fill with a 70% cream border. No blur, no glass.
- Sizes: 48px default, 40px (`sr-btn--sm`) in the header. Radius `radius-control`.
- Focus: 2px `ring` (light plum), 3px offset. Disabled: `secondary` fill, `fg-disabled` text, `aria-disabled`, not-allowed cursor.
- Consumer provides: label (verb first), href or onClick. Arrow icon optional, secondary only.
- shadcn: map to `<Button variant="default">` and `<Button variant="outline">`.
