# Header
Wordmark left, four links centred, "Start a project" right. 64px desktop, 56px mobile.

- Links: Inter 500 13px `fg-secondary`; hover `foreground`; current page `foreground` with a 1px `primary-text` underline and `aria-current="page"`.
- Over the hero it is transparent and relies on the top scrim (`--scrim-top`); after 80vh scroll it turns `background` with a `border` hairline.
- Mobile: brand + "Menu" text button. Open state is a full-screen `background` sheet (no blur) with Cormorant 44px links, mono indexes and a full-width primary button pinned to the bottom. Focus is trapped; Esc closes.
- Wordmark: the name "Yurii Tarasov" in Cormorant 600 plus a "Films" descriptor in `label` style (Inter 500, uppercase, 0.18em), split by a 1px `border-strong` rule. The descriptor matches the domain films.tarasovs.me. Over video the descriptor turns `foreground`.
