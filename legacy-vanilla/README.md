# Fruitloop — Agency Website

A single static site built from your pitch deck (`Fruitloop_Agency_Pitch__pdf.pdf`).

## How to view it
Unzip the folder and double-click `index.html` — it opens directly in any browser,
no server or build step required. (An internet connection is needed once, to load
the Google Fonts — Anton, Bebas Neue, Space Grotesk, Space Mono.)

## What's inside
```
index.html        — all page content/structure
styles.css         — the full design system (colors, type, layout, animation)
script.js          — scroll reveals, work filters, showreel player, logo marquee, custom cursor
assets/work/       — portfolio photography pulled from the deck (Ad Campaign, Food, Hospitality)
assets/hero/       — large cinematic frames used for hero/showreel backgrounds
assets/logos/      — 22 client/association logos extracted from the "A-Peeling Associations" slide
```

## To add your real showreel
Open `index.html`, find the `<section class="reel" id="reel">` block. Two options:

**MP4 file:** drop your video into `assets/reel/showreel.mp4`, then uncomment this line:
```html
<source src="assets/reel/showreel.mp4" type="video/mp4">
```

**YouTube / Vimeo embed:** replace the `<video id="reelVideo">` block with an `<iframe>`
embed of your hosted reel, keeping it inside `#reelFrame`.

Swap `assets/hero/cinematic-2.jpg` for your own poster frame if you'd like a different
first impression before the video plays.

## To add/replace portfolio work
Each piece lives in `.work-grid` in `index.html` as a `<figure class="work-item" data-cat="...">`.
`data-cat` must be `ad`, `food`, or `hospitality` to work with the filter buttons — or add a
new category value and a matching filter button in `.work-filters`.

## Founders
Only Vikram and Pratik are featured as the two owners, per your note — their bios are pulled
directly from the deck. Update photos by replacing the `.founder-photo--a` / `--b` gradient
placeholders in `styles.css` with a real headshot (`background-image: url(...)`).

## Brand colors used
| Token | Hex | Use |
|---|---|---|
| `--ink` | `#15161B` | text, dark sections |
| `--cream` | `#FFF8E7` | page background |
| `--yellow` | `#F8D612` | primary accent |
| `--orange` | `#E9622A` | secondary accent |
| `--lime` | `#C7F135` | small highlight accents (loop motif) |

## Notes
- Fully responsive down to mobile, with a slide-down nav menu under ~860px.
- Respects `prefers-reduced-motion`.
- No build tools/frameworks — plain HTML/CSS/JS, easy to hand to any developer or host as-is
  (Netlify/Vercel/GitHub Pages all work by just dragging in this folder).
