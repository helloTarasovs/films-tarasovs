# VideoScrim
The recipe that keeps type legible over light and dark footage without a grey wash.

- Bottom scrim: `scrim` (warm black) eased from 74% at the bottom to 62% at 40% height, then 30%, 8%, 0 by 90%. All copy sits inside the bottom 40%.
- Top scrim: 50% to 0 over 160px, for the header only.
- Only `foreground` text over video. At 62% scrim over a near-white pixel it holds 5.35:1. `fg-secondary` drops to 3.54 there, so never use it on footage.
- Small captions ("Now showing") get their own solid chip at 70%, with cream text. Plum appears only as the dot: light plum text on that chip over white footage is 2.94:1.
- The plum primary button keeps a 1px cream edge on video; its fill is 1.04:1 against the scrim, so without the edge the shape disappears on light footage.
- Why it doesn't go muddy: the scrim is warm black matched to the page, not neutral grey, and the stops are eased, so pastels darken rather than turn beige. If a loop is extremely bright in the lower third, grade it to keep that area under 85% lightness.
