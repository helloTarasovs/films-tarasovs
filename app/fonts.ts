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
export const mono = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
});

// app/layout.tsx:
// <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
