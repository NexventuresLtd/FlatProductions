# Flat Productions — Website & Admin Dashboard

A full-featured creative agency website for **Flat Productions Limited** (Kigali, Rwanda) with a built-in admin dashboard for live content management. All public pages update in real time when content is changed from the dashboard — no server, no database, no redeploy needed.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19.2.5 + TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4.2.2 via `@tailwindcss/vite` |
| Font | Montserrat (Google Fonts — 400/500/600/700/800/900) |
| Icons | lucide-react v0.268.0 |
| Storage | `localStorage` + `BroadcastChannel` + `window.storage` event (no backend) |
| Routing | Custom pathname-based routing in `App.tsx` |

---

## Project Structure

```
flatproduction/
├── public/                  # Static assets (photos, logos, videos)
├── src/
│   ├── App.tsx              # Router, AdminBar, visit counter, session helpers
│   ├── store/
│   │   └── contentStore.ts  # Central data store (localStorage + BroadcastChannel)
│   ├── pages/
│   │   ├── HomePage.tsx         # Landing page (assembles components)
│   │   ├── AboutPage.tsx        # /about
│   │   ├── ServicesPage.tsx     # /services
│   │   ├── PortfolioPage.tsx    # /portfolio
│   │   ├── GalleryPage.tsx      # /gallery
│   │   ├── ContactPage.tsx      # /contact
│   │   ├── AdminLogin.tsx       # /login
│   │   └── AdminDashboard.tsx   # /admin
│   └── components/
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── Hero.tsx             # Homepage hero slideshow
│       ├── About.tsx            # Homepage about section
│       ├── Services.tsx         # Homepage services grid
│       ├── Gallery.tsx          # Homepage portfolio preview
│       ├── Clients.tsx          # Homepage client logos marquee
│       └── Team.tsx             # Homepage team grid
```

---

## Getting Started

```bash
# Install dependencies (uses pnpm lock file)
npm install
# or
pnpm install

# Start development server
npm run dev
# → http://localhost:5173

# Type check
npx tsc --noEmit

# Production build
npm run build

# Preview production build
npm run preview
```

---

## Routing

Routing is handled by `window.location.pathname` matching in `App.tsx` — no React Router dependency.

| Path | Page |
|---|---|
| `/` | Homepage |
| `/about` | About page |
| `/services` | Services page |
| `/portfolio` | Portfolio page |
| `/gallery` | Gallery page |
| `/contact` | Contact page |
| `/login` | Admin login |
| `/admin` | Admin dashboard (requires auth) |

---

## Content Store

**File:** [`src/store/contentStore.ts`](src/store/contentStore.ts)

All site content is stored in `localStorage` under the key `flatproduction_site_content_v2`. Changes broadcast to other tabs via `BroadcastChannel('flatproduction_content')`.

### Data shape (`SiteContent`)

```typescript
{
  hero: {
    title: string;
    subtitle: string;
    images: string[];    // slideshow background images
    notes: string[];     // per-slide caption text
  };
  about: {
    heading: string;
    body: string;        // legacy fallback body text
    history?: string;    // main long-form text (editable from dashboard)
    mission?: string;
    vision?: string;
    value?: string;
    image1?: string;     // photo mosaic images (used on About page + homepage About section)
    image2?: string;
    image3?: string;
    image4?: string;
    stats?: Array<{ value: string; label: string }>;   // e.g. "8+ Years Active"
    chips?: string[];    // service capability tags shown on About/homepage
  };
  testimonials: Array<{ id, name, logoSrc, quote }>;
  services: Array<{
    id, title, description, image?,
    extendedDescription?,  // long-form text shown in the service detail modal
  }>;
  portfolio: Array<{
    id, title, image?, description?,
    videoUrl?,    // YouTube link → enables video play on Portfolio page
    btsUrl?,      // YouTube BTS link → appears in BTS filter tab
    category?,    // display category (e.g. 'Photography', 'Live Streaming')
    link?,        // optional project URL
    serviceId?,   // links to a service for filtering
  }>;
  clientsIntro: string;
  clients: string[];        // category tags shown in Clients section
  clientLogos: string[];    // logo image paths
  team: Array<{ id, name, role, bio?, photo?, position? }>;
  gallery: Array<{ src: string; category: string }>;  // GalleryItem — image path + category
  contact: {
    phone: string;
    email: string;
    address: string;
    hours: string;
    whatsapp: string;   // number only, no "+", e.g. "250781691713"
    socials: {
      instagram: string;
      youtube: string;
      linkedin: string;
    };
  };
  pageHeroes: {
    about:     { title: string; image: string };
    services:  { title: string; image: string };
    portfolio: { title: string; image: string };
    gallery:   { title: string; image: string };
    contact:   { title: string; image: string };
  };
}
```

### How live updates work

Every component that displays content:
1. Initialises state from `contentStore.read()` on mount
2. Subscribes to updates via `contentStore.onUpdate(callback)` and returns the cleanup function so React removes listeners on unmount

```typescript
// Pattern used in every component
const [data, setData] = useState(() => contentStore.read().someField);
useEffect(() => {
  return contentStore.onUpdate(c => setData(c.someField));
}, []);
```

`onUpdate` listens on three channels simultaneously so updates are reliable regardless of scenario:

| Channel | What it covers |
|---|---|
| `BroadcastChannel` | Changes made in **another browser tab** |
| `window.storage` event | Native cross-tab localStorage fallback (more reliable than BroadcastChannel in some browsers) |
| `flatproduction_update` CustomEvent | Changes made **within the same tab** (e.g. dashboard and preview open together) |

`write()` dispatches to all three and wraps `localStorage.setItem` in a try/catch — if storage is full (e.g. too many large base64 images), it logs a warning and returns the current state unchanged instead of silently corrupting data.

`App.tsx` also listens for the browser's `pageshow` event. When `event.persisted === true` (the page was restored from the back/forward cache), it forces a full reload so React re-reads fresh data from localStorage.

---

## Admin Dashboard

**Route:** `/admin` (requires authentication)

### Authentication & Session Lock

Login is at `/login`. On successful login:
- A random token is written to both `sessionStorage.flat_admin_tok` and `localStorage.flat_admin_tok`
- `isAdminAuthed()` checks `sessionStorage.flat_admin_tok === localStorage.flat_admin_tok`
- Logging in from a second browser overwrites the `localStorage` token, invalidating the first session — only one active admin session at a time

Puzzle-based login: one of three randomly selected challenges (arithmetic, number sequence, or word copy) must be solved before the password is accepted.

### Dashboard Sections

| Section | What you can edit |
|---|---|
| **Overview** | View stats, website visit counter, quick navigation |
| **Hero** | Slideshow images + per-slide captions, headline, subtitle |
| **About** | Heading, history text, 4 photo mosaic images, mission, vision, value, stats, chips |
| **Services** | Add / edit / delete / reorder services (title, description, extended description, image) |
| **Portfolio** | Add / edit / delete / reorder projects (title, image, category, video URL, BTS URL, link) |
| **Gallery** | Add / edit / delete / reorder gallery images (with category per image) |
| **Clients** | Intro text, client category tags, client logo images |
| **Team** | Add / edit / delete / reorder team members (name, role, bio, photo) |
| **Testimonials** | Add / edit / delete / reorder client testimonials (logo, name, quote) |
| **Page Heroes** | Banner image + headline for each of the 5 public pages |
| **Contact** | Phone, email, address, hours, WhatsApp number, social links |

### Admin Bar

When logged in, a floating "Dashboard" button appears on every public page (bottom-right corner). It only appears if `isAdminAuthed()` returns true and disappears when the session ends.

### Website Visit Counter

A visit is counted (via `localStorage.flat_visit_count`) on every non-admin page load. The counter is displayed on the Overview screen and can be reset from there.

---

## Public Pages — Data Connections

Every public page reads live from `contentStore` and re-renders when the dashboard saves.

### Homepage (`/`)

| Component | Data source |
|---|---|
| `Hero` | `hero.images`, `hero.notes`, `hero.title`, `hero.subtitle`, `contact.whatsapp`, `contact.socials` |
| `About` | `about.heading`, `about.history \|\| about.body`, `about.image1–3`, `about.stats`, `about.chips` |
| `Services` | `services[]`, `contact.whatsapp` |
| `Gallery` | `portfolio[]` (preview cards with video/BTS links) |
| `Clients` | `clientsIntro`, `clients[]`, `clientLogos[]` |
| `Team` | `team[]` |

### About Page (`/about`)

- Hero banner: `pageHeroes.about.title` + `pageHeroes.about.image`
- 4-image mosaic: `about.image1–4`
- History text: `about.history || about.body`
- Mission / Vision / Value cards (hidden when empty)
- Testimonials grid: `testimonials[]`

### Services Page (`/services`)

- Hero: `pageHeroes.services`
- Service cards: `services[]` with modal detail view (uses `extendedDescription` when available)
- Book button links to WhatsApp: `contact.whatsapp`

### Portfolio Page (`/portfolio`)

- Hero: `pageHeroes.portfolio`
- Hero accent images: first two `portfolio[]` item images
- All portfolio items from `portfolio[]` — each item appears once in 'All' view
- 'Video' filter tab: items where `videoUrl` is set (opens YouTube embed)
- 'BTS' filter tab: items where `btsUrl` is set
- Other filter tabs: dynamically generated from each item's `category` field
- Click image → full-screen lightbox; click video thumbnail → embedded player

### Gallery Page (`/gallery`)

- Hero: `pageHeroes.gallery`
- Image grid: `gallery[]` — each item is `{ src, category }` — click to open lightbox with category filter

### Contact Page (`/contact`)

- Hero: `pageHeroes.contact`
- All accent colors: red (`#dc2626`)
- Contact info cards: `contact.phone`, `contact.email`, `contact.address`, `contact.hours`
- WhatsApp CTA: `contact.whatsapp`
- Social links: `contact.socials.instagram`, `.youtube`, `.linkedin`
- Contact form (no backend — extend with email service as needed)
- Google Maps embed uses `contact.address` as search query

---

## Portfolio Category System

When adding or editing a project in the dashboard, you select a **category** from:

> Photography · Video Production · Live Streaming · Web & Digital · Graphics Design · Branding · Documentary · Event & Entertainment

This category determines which filter tab the project appears under on the Portfolio page. Items also automatically appear in:
- **Video** tab — if a YouTube `videoUrl` is set
- **BTS** tab — if a `btsUrl` is set

Legacy items with `category: 'video'` or `'image'` fall back to using their title as the display category.

---

## Gallery Category System

Each `gallery[]` item has a `category` field. The available categories are defined in `GALLERY_CATEGORIES` (exported from `contentStore.ts`):

> Event Photography · Sports Photography · Wedding Photography · Portrait Photography · Advertising Photography · Behind The Scenes

The Gallery page renders a filter bar from these categories and shows a count badge for each.

---

## Color System

The site uses a **red accent** color scheme (`#dc2626` / Tailwind `red-600`). Blue, indigo, and violet have been replaced throughout. Neutral grays (`#64748b`, `#374151`, etc.) are kept as-is since they are UI structural colors, not brand colors.

---

## Typography

All text uses **Montserrat** (Google Fonts). The font is loaded via `@import` in [`src/index.css`](src/index.css) with weights 400, 500, 600, 700, 800, and 900 (including italic variants). It is set as the base `--font-sans` CSS variable and applied globally to `body`.

---

## Development Notes

### Adding a new page

1. Create `src/pages/NewPage.tsx` — read from `contentStore.read()` and subscribe with `contentStore.onUpdate()`
2. Add the route in `App.tsx` alongside the other `currentPath` checks
3. If it needs a hero banner, add `newpage: PageHero` to the `pageHeroes` type in `contentStore.ts` with a default, and add a `PageHeroCard` in the dashboard `pages` section

### Resetting content

The dashboard header has a **Reset Content** button that restores all defaults. Alternatively, clear `localStorage` key `flatproduction_site_content_v2` in DevTools.

### localStorage key

`flatproduction_site_content_v2` — the `v2` suffix was added when the schema was extended with `testimonials`, `pageHeroes`, and expanded `about` fields. A `normalize()` function in `contentStore.ts` merges stored data with defaults so old saved data doesn't break new fields.

---

## Key Files Reference

| File | Purpose |
|---|---|
| [`src/store/contentStore.ts`](src/store/contentStore.ts) | Single source of truth — types, defaults, normalize, read/write, BroadcastChannel |
| [`src/App.tsx`](src/App.tsx) | Route matching, `isAdminAuthed()`, visit counter, AdminBar |
| [`src/pages/AdminDashboard.tsx`](src/pages/AdminDashboard.tsx) | Full dashboard UI — all section editors, modals, CRUD handlers |
| [`src/pages/AdminLogin.tsx`](src/pages/AdminLogin.tsx) | Puzzle-gated login, session token generation |
| [`src/pages/PortfolioPage.tsx`](src/pages/PortfolioPage.tsx) | Fully store-driven portfolio with dynamic category tabs |
| [`src/pages/AboutPage.tsx`](src/pages/AboutPage.tsx) | About page with history, 4-image mosaic, mission/vision/value, testimonials |
| [`src/pages/ContactPage.tsx`](src/pages/ContactPage.tsx) | Contact form, WhatsApp CTA, contact info cards, Google Maps embed |
| [`src/pages/GalleryPage.tsx`](src/pages/GalleryPage.tsx) | Gallery grid with category filter tabs and full-screen lightbox |
| [`src/index.css`](src/index.css) | Global styles, Montserrat font import, Tailwind theme, animations |

---

## License

Private project — Flat Productions Limited, Kigali, Rwanda.
