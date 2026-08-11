# Fruitloop — project conventions

A Next.js 16 (App Router) static site for the Fruitloop creative agency. Rebuilt from the vanilla
prototype now kept in `legacy-vanilla/` (reference only — do not edit).

## File map
- `app/globals.css` — the ONLY design system. All tokens, fonts, breakpoints, animations.
- `lib/data.ts` — the ONLY content source. All sections import from here; never hardcode copy.
- `app/layout.tsx` — fonts, metadata, grain, cursor, nav, footer shell.
- `app/page.tsx` — section composition.
- `components/*` — one file per section, named after its `<section>` (Hero, Why, Services, Reel, Work, Choose, Founders, Brands, Contact, Nav, Footer).
- `hooks/*` — interactions (reveal on scroll, work filter, showreel, logo marquee).
- `public/assets/` — hero/, work/, logos/ imagery. Serve via `/assets/...` paths.

## Design system (non-negotiable)
- Colors: only tokens `--ink #15161B`, `--cream #FFF8E7`, `--yellow #F8D612`, `--orange #E9622A`, `--orange-deep #C94414`, `--lime #C7F135`, `--paper #FFFDF6`.
- Fonts: `--font-display` (Anton), `--font-label` (Bebas Neue), `--font-body` (Space Grotesk), `--font-mono` (Space Mono). Imported via next/font/google.
- Breakpoints: 980px, 900px, 860px, 760px, 560px, 520px — already defined in globals.css. Do not add new colors/fonts/breakpoints without the design-guardian.
- Respect `prefers-reduced-motion` (already handled globally in globals.css).
- Class names map 1:1 to globals.css — copy the markup patterns from `legacy-vanilla/index.html`.

## Brand voice
Cheeky, fruit-punny, confident. "A-peeling", "boring? not in our vocabulary", "let's get you noticed."
Never corporate-dry. All copy lives in `lib/data.ts`.

## Components contract
- Every section component: `export default function <Name>()` — takes no props, reads from `lib/data`.
- Use plain `<img>` for these local assets (Next Image optimization off via `next.config.ts` if preferred).
- Client interactivity (cursor, filters, mobile nav, reveal, reel) lives in components marked `"use client"` or in `hooks/`.
