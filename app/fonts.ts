import { Cormorant, Inter, IBM_Plex_Mono } from "next/font/google";

// Display + headings. Roman only: the system uses no italic.
export const display = Cormorant({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["500", "600"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});

// UI + body.
export const sans = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});

// Metadata only: indexes, runtimes, aspect ratios.
// Above-the-fold label ("Now showing"), so the single latin file is preloaded and the
// fallback is a monospace stack: every one of them is 0.6em wide like Plex Mono, so the
// swap does not move anything.
export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: true,
  fallback: ["ui-monospace", "Menlo", "Consolas", "monospace"],
  adjustFontFallback: false,
});

// app/layout.tsx:
// <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
