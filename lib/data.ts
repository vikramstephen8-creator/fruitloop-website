export const SITE = {
  name: "Fruitloop",
  tagline: "Independent 360° Creative Agency",
  location: "New Delhi",
  email: "fruitloopdelhi@gmail.com",
  phones: [
    { label: "Call", value: "+91 97119 70285", href: "tel:+919711970285" },
    { label: "Call", value: "+91 95605 87991", href: "tel:+919560587991" },
  ],
  description:
    "Fruitloop is an independent 360° creative agency. Concept development, pre to post production, brand content and content strategy that turns brand stories into scroll-stopping content.",
};

export const NAV_SERVICES = [
  { label: "Concept Development", href: "#services" },
  { label: "Pre to Post Production", href: "#services" },
  { label: "Brand Content", href: "#work" },
  { label: "Content Strategy", href: "#services" },
];

export const NAV_MOBILE = [
  { label: "Why Fruitloop", href: "#why" },
  { label: "What We Do", href: "#services" },
  { label: "Showreel", href: "#reel" },
  { label: "Work", href: "#work" },
  { label: "Who We Are", href: "#founders" },
  { label: "Brands", href: "#brands" },
  { label: "Contact", href: "#contact" },
];

export const HERO = {
  eyebrow: "Independent 360° Creative Agency — New Delhi",
  lines: [
    { text: "Turn the", style: "line" },
    { text: "Mundane", style: "em" },
    { text: "Into Memorable.", style: "line" },
  ],
  sub: `Let's face it — nobody wants another boring content factory. At Fruitloop, our ideas never slip
and our creativity stays a-peeling (couldn't resist). We turn brand stories
into snackable, scroll-stopping, soul-hugging content.`,
  ctaPrimary: "Let's Collaborate",
  ctaGhost: "Watch the showreel",
  marquee: [
    "Content Development",
    "Pre to Post Production",
    "Brand Content",
    "Content Strategy",
  ],
};

export const WHY = {
  eyebrow: "01 — Why Fruitloop",
  title: ["Be seen. Be heard. Actually resonate —", "instead of blending in."],
  body: "Lack creativity, lose visibility. Might as well pitch ice to penguins. We turn the mundane into memorable and brilliant, always with a cheeky flair — if your brand wants zest, welcome to the bunch.",
  vision:
    "To turn brand stories into snackable, scroll-stopping, soul-hugging content through creative strategy, bold production, and downright delightful storytelling.",
  mission:
    "Nobody wants another boring content factory. Our ideas never slip and our creativity stays a-peeling — we turn the mundane into memorable and brilliant, on every single brief.",
};

export const SERVICES = {
  eyebrow: "02 — What We Do",
  title: ["Four disciplines.", "One loop."],
  items: [
    {
    num: "01",
    title: "Concept Development",
    body: `From "let's just stick to the basics?" to "what if the CEO does parkour?" — we've got you covered.`,
  },
  {
    num: "02",
    title: "Pre to Post Production",
    body: "Lights, camera, banana action. We film, snap, and record everything from sassy shorts to full-on brand sagas.",
  },
  {
    num: "03",
    title: "Brand Content",
    body: "Campaigns, product launches, and those weird-but-viral videos your competitors wish they made.",
  },
  {
    num: "04",
    title: "Content Strategy",
    body: "We get your brand in all the right places… and some you didn't even know existed.",
  },
  ],
};

export const REEL = {
  eyebrow: "03 — Showreel",
  title: "See us in motion.",
  sub: "Drop your latest showreel here — this frame is wired up and ready for it.",
  poster: "/assets/hero/cinematic-2.jpg",
  note: "Showreel wired and ready — click play to watch.",
};

export const WORK_FILTERS = [
  { key: "all", label: "All" },
  { key: "ad", label: "Ad Campaign" },
  { key: "food", label: "Food" },
  { key: "hospitality", label: "Hospitality" },
];

export const WORK = {
  eyebrow: "04 — Selected Work",
  title: ["Campaigns that don't", "just break the internet.", "They rewire it."],
};

export type WorkItem = {
  cat: "ad" | "food" | "hospitality";
  title: string;
  img: string;
  slug: string;
};

export const WORK_ITEMS: WorkItem[] = [
  { cat: "ad", title: "Product Launch Film", img: "/assets/work/ad-campaign-1.jpg", slug: "product-launch-film" },
  { cat: "ad", title: "Brand Hero Shot", img: "/assets/work/ad-campaign-2.jpg", slug: "brand-hero-shot" },
  { cat: "ad", title: "Lifestyle Story", img: "/assets/work/ad-campaign-3.jpg", slug: "lifestyle-story" },
  { cat: "ad", title: "Colour Campaign", img: "/assets/work/ad-campaign-4.jpg", slug: "colour-campaign" },
  { cat: "food", title: "Menu Launch", img: "/assets/work/food-1.jpg", slug: "menu-launch" },
  { cat: "food", title: "Dessert Feature", img: "/assets/work/food-2.jpg", slug: "dessert-feature" },
  { cat: "food", title: "Bakery Content", img: "/assets/work/food-3.jpg", slug: "bakery-content" },
  { cat: "food", title: "Cafe Brand Film", img: "/assets/work/food-4.jpg", slug: "cafe-brand-film" },
  { cat: "hospitality", title: "Resort High Tea", img: "/assets/work/hospitality-1.jpg", slug: "resort-high-tea" },
  { cat: "hospitality", title: "Spa & Wellness", img: "/assets/work/hospitality-2.jpg", slug: "spa-wellness" },
  { cat: "hospitality", title: "Taj Theog Resort & Spa", img: "/assets/work/hospitality-3.jpg", slug: "taj-theog-resort-spa" },
  { cat: "hospitality", title: "Bar Menu Film", img: "/assets/work/hospitality-4.jpg", slug: "bar-menu-film" },
];

export const CASE_STUDY = {
  back: "← Back to all work",
  publishedLabel: "Published",
  categoryLabel: "Discipline",
  related: "More like this.",
};

export const CHOOSE = {
  eyebrow: "05 — Why Choose Us",
  title: ["Boring? Not in our", "vocabulary."],
  body: "Expect bold, curious, and unforgettable creativity. We deliver more than just creativity.",
  items: [
    {
      index: "01",
      title: "Strategic Creativity",
      body: "Every idea is tied to a reason it should exist — trend-aware, brand-true, never creative for creativity's sake.",
    },
    {
      index: "02",
      title: "Results-Driven Approach",
      body: "Hope is not a strategy. We get your brand in all the right places, and a few you didn't know existed.",
    },
    {
      index: "03",
      title: "End-to-End Support",
      body: "Concept, shoot, edit, strategy, delivery — one team owns the loop from the first idea to the last export.",
    },
  ],
};

export const FOUNDERS = {
  eyebrow: "06 — Who We Are",
  title: ["Two obsessions.", "One agency."],
  sub: "Fruitloop is an independent 360° creative media agency. Pre to post-production, we craft stories that stick, visuals that pop, and campaigns that don't just break the internet — they rewire it.",
  people: [
    {
      name: "Vikram Stephen Singh",
      role: "Co-Founder — Strategy & Culture",
      photoClass: "founder-photo--a",
      bio: "Part spreadsheet, part stand-up comic, all strategy. Vikram can spot a trend before it's cool and meme your campaign into the stratosphere — all without breaking a sweat or a punchline.",
    },
    {
      name: "Pratik Oscar Kelvin Minj",
      role: "Co-Founder — Production",
      photoClass: "founder-photo--b",
      bio: `Call him "the fixer." Broken dolly? Rain on shoot day? Pratik handles it with zero sweat and impeccable hair. If you want your vision brought to life without a hitch, he's your ringleader.`,
    },
  ],
};

export const BRANDS = {
  eyebrow: "07 — A-Peeling Associations",
  title: ["Brands we've gone", "fruitloop for."],
  logoCount: 22,
};

export const CONTACT = {
  eyebrow: "08 — Get In Touch",
  title: ["Let's", "Collaborate"],
  sub: "If your brand wants zest, welcome to the bunch. Tell us what you're building and we'll bring the concept, the crew, and the cheeky flair.",
};

export const FOOTER = {
  words: [
    { text: "GO", variant: "fill" },
    { text: "FRUITLOOP.", variant: "outline" },
    { text: "GET", variant: "fill" },
    { text: "NOTICED.", variant: "fill--accent" },
  ],
  links: NAV_SERVICES,
  entity: "Fruitloop LLP",
  back: "Back to top ↑",
};
