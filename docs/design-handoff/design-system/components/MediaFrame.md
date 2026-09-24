# MediaFrame
The container for every film: fixed ratio, `card` fill while loading, 2px radius, slow zoom on hover.

- Ratios: `sr-frame--169` (16:9), `--239` (2.39:1), `--916` (9:16), `--45` (4:5 for social cutdowns).
- Play affordance: a mono chip bottom-left, scrim at 70%, showing runtime ("Watch · 01:24"). Hover fills it plum `primary` with a cream label. The whole frame is the link; the chip is its visible label.
- Hover: media scales to 1.03 over `duration-media` with `ease-cine`. Reduced motion: no zoom, chip still fills.
- Loading: poster frame shown, 1px `primary-text` progress line on the bottom edge, chip reads "Loading film".
- Placeholder: `card` fill, crop-mark corners in `border-strong`, mono line with ratio and status. Use for films in edit.
- Disabled (private film): poster desaturated, chip reads "Private", no link.
- Consumer provides: poster (first frame, AVIF/WebP), muted MP4/WebM loop for hover previews, runtime, ratio. Autoplay only muted and only in view.
