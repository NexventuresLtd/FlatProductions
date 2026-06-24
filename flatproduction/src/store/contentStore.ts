type Testimonial = { id: string; name: string; logoSrc: string; quote: string };
type PageHero    = { title: string; image: string };
type StatItem    = { value: string; label: string };
type ContactInfo = {
  phone: string;
  email: string;
  address: string;
  hours: string;
  whatsapp: string;
  socials: { instagram: string; youtube: string; linkedin: string };
};

export const GALLERY_CATEGORIES = [
  'Event Photography',
  'Sports Photography',
  'Wedding Photography',
  'Portrait Photography',
  'Advertising Photography',
  'Behind The Scenes',
] as const;
export type GalleryCategory = typeof GALLERY_CATEGORIES[number];
type GalleryItem = { src: string; category: string };

type SiteContent = {
  hero: { title: string; subtitle: string; images?: string[]; notes?: string[] };
  about: {
    heading: string;
    body: string;
    history?: string;
    mission?: string;
    vision?: string;
    value?: string;
    image1?: string;
    image2?: string;
    image3?: string;
    image4?: string;
    stats?: StatItem[];
    chips?: string[];
  };
  testimonials: Testimonial[];
  services: Array<{ id: string; title: string; description: string; image?: string; extendedDescription?: string }>;
  portfolio: Array<{ id: string; title: string; image?: string; videoUrl?: string; btsUrl?: string; description?: string; link?: string; serviceId?: string; category?: string }>;
  clientsIntro: string;
  clients: string[];
  clientLogos: string[];
  team: Array<{ id: string; name: string; role: string; bio?: string; photo?: string; position?: string }>;
  gallery: GalleryItem[];
  contact: ContactInfo;
  pageHeroes: {
    about:     PageHero;
    services:  PageHero;
    portfolio: PageHero;
    gallery:   PageHero;
    contact:   PageHero;
  };
};

const DEFAULT_SITE_CONTENT: SiteContent = {
  hero: {
    title:    'Flat Productions',
    subtitle: 'Creative Solutions',
    images:   ['/photo12.jpg', '/photo6.jpg', '/photo3.jpg', '/photo10.jpg', '/photo5.jpg'],
    notes:    [
      'Cinematic light, real moments, and stories that linger.',
      'Live coverage shaped to feel immediate and polished.',
      'Creative visuals built to make brands feel alive.',
    ],
  },
  about: {
    heading: 'Where Light Becomes Memory',
    body:    'Every frame is crafted with patience, emotion, and intent, turning ordinary scenes into cinematic moments that feel personal, timeless, and alive.',
    history: 'FLAT PRODUCTION LIMITED is a Rwandan-based company with 8 years of comprehensive experience and a full portfolio of services. Since 2018, we have delivered event live streaming and feed, photography and video production, web design, content creation, social media management, graphic design, printing, branding, event and entertainment coverage, and documentary production.',
    mission: 'To transform ideas, emotions, and moments into unforgettable visuals and digital experiences that help people and brands connect with purpose.',
    vision:  'To become East Africa\'s most trusted creative production partner for stories that shape culture, business growth, and meaningful human impact.',
    value:   'Authenticity, excellence, teamwork, and innovation guide everything we produce from live events and documentaries to digital campaigns and branding.',
    image1:  '/photo3.jpg',
    image2:  '/photo6.jpg',
    image3:  '/live1.jpeg',
    image4:  '/photo10.jpg',
    stats: [
      { value: '8+',   label: 'Years Active' },
      { value: '200+', label: 'Projects Delivered' },
      { value: '50+',  label: 'Clients Served' },
    ],
    chips: ['Photography', 'Video Production', 'Live Streaming', 'Branding', 'Web Design', 'Documentary'],
  },
  testimonials: [
    { id: 'tm-1', name: 'MTN Rwanda',         logoSrc: '/mtn.png',      quote: 'Flat Production delivered event visuals and digital storytelling that elevated our customer engagement campaigns.' },
    { id: 'tm-2', name: 'Engen Rwanda',        logoSrc: '/engen.png',    quote: 'Their livestream and content team managed high-pressure launches smoothly and produced quality media in real time.' },
    { id: 'tm-3', name: 'Inyange Industries',  logoSrc: '/inyange.jpg',  quote: 'From photography to post-production, they helped us communicate our brand story with clarity and premium quality.' },
    { id: 'tm-4', name: 'NBG',                 logoSrc: '/nbg.jpg',      quote: 'We trusted Flat Production for documentary storytelling and campaign content, and the outcome was impactful and authentic.' },
  ],
  services: [
    { id: 'svc-1', title: 'PHOTOGRAPHY & VIDEO PRODUCTION', description: 'Delivering outstanding excellence in video production and photography: capturing moments, crafting stories, creating memories.', image: '/photo1.jpg', extendedDescription: 'From corporate events to weddings and product launches, we capture every visual moment with precision equipment and a storytelling eye. Our edits are polished, emotive, and built to work across every screen.' },
    { id: 'svc-2', title: 'LIVE STREAMING & FEED',          description: 'Lets you interact with your audience in real time with a video feed, chat, reactions, and more.',                               image: '/live1.jpeg', extendedDescription: 'We deploy professional multi-camera streaming rigs for any scale of event — from intimate church services to large-scale conferences. Low-latency, stable, with dedicated technical support on-site.' },
    { id: 'svc-3', title: 'WEBSITE DESIGN',                 description: 'You are best in your work; let us help you show world your excellent achievements digitally.',                                   image: '/web.jpg', extendedDescription: 'We build fast, clean, and modern websites that make your brand look credible online. Every site is mobile-optimized, SEO-ready, and designed to convert visitors into real clients.' },
    { id: 'svc-4', title: 'DESIGN - PRINTING & BRANDING',   description: "It's hard to build and easy to destroy by not branding your excellent work; we are here to express your great work through stunning branding.", image: '/graphy33.jpg', extendedDescription: 'Your brand should be recognizable everywhere. We create logos, typography systems, social graphics, and print-ready artwork that hold together across every touchpoint.' },
    { id: 'svc-5', title: 'EVENT & ENTERTAINMENT',          description: 'Here to help differentiate your event through outstanding creativity.',                                                          image: '/photo5.jpg', extendedDescription: "Whether it's a concert, gala, or product launch, we capture the energy and emotion with high-quality cameras and a genuine eye for the moments your guests will remember." },
    { id: 'svc-6', title: 'DOCUMENTARY',                    description: 'A better way of storytelling through interviewing, research, reality filming, narration, and production excellence through experience.', image: '/photo12.jpg', extendedDescription: 'Documentaries require patience, curiosity, and craft. We combine deep research, on-location filming, and precise editing to produce pieces that feel honest and compelling.' },
  ],
  portfolio: [
    { id: 'pf-1', title: 'Photography',     image: '/photo1.jpg',          link: '#', category: 'Photography',     description: 'We capture stunning visuals that tell your unique story with precision and artistic flair.' },
    { id: 'pf-2', title: 'Video Production',image: '/2I1A0386.JPG.jpeg',   link: '#', category: 'Video Production',videoUrl: 'https://youtu.be/RjXqY31jpy0', btsUrl: 'https://youtu.be/DHR85WBk4tY', description: 'We deliver high-end video production services tailored for commercials, events, and cinematic projects.' },
    { id: 'pf-3', title: 'Live Streaming',  image: '/2I1A0403.JPG.jpeg',   link: '#', category: 'Live Streaming', videoUrl: 'https://youtu.be/de6oWk6vGlM', btsUrl: 'https://youtu.be/zWTFpxzQaes', description: 'We provide professional multi-camera live streaming solutions to connect you with a global audience instantly.' },
    { id: 'pf-4', title: 'Web & Digital',   image: '/web.jpg',             link: '#', category: 'Web & Digital',  description: 'We offer comprehensive digital strategies including web design, development, and online marketing solutions.' },
    { id: 'pf-5', title: 'Branding',        image: '/graphy33.jpg',        link: '#', category: 'Branding',       description: 'We create memorable brand identities that resonate deeply with your target market and stand out.' },
    { id: 'pf-6', title: 'Documentary',     image: '/photo12.jpg',         link: '#', category: 'Documentary',    description: 'We specialize in in-depth documentary filmmaking that brings important real-world stories to light.' },
  ],
  clientsIntro: 'We work with brands, organizations, and creators who want visuals that feel sharp, memorable, and full of character. Every project is tailored to match your message, audience, and moment.',
  clients:     ['Corporate', 'Weddings', 'Events', 'Non-profits'],
  clientLogos: ['/mtn.png', '/engen.png', '/inyange.jpg', '/nbg.jpg'],
  team: [
    { id: 'team-1', name: 'KADAffI PRO',               role: 'Ceo & Founder',           bio: 'Leads the creative direction and keeps every project focused, sharp, and client-centered.', photo: '/kadaff.jpg',   position: '50% 18%' },
    { id: 'team-2', name: 'Kelly',                       role: 'Graphics Designer',        bio: 'Shapes visual identities, layouts, and brand assets with a clean, modern style.',          photo: '/ike.jpg',      position: '50% 20%' },
    { id: 'team-3', name: 'Chancelline niyotugendana',   role: 'Secretary & photographer', bio: 'Keeps the studio organized while capturing moments with a calm eye for detail.',            photo: '/chance.jpg',   position: '50% 22%' },
    { id: 'team-4', name: 'anura',                       role: 'Intern',                   bio: 'Supports the team across shoots, edits, and day-to-day production work.',                  photo: '/chelsea.jpg',  position: '50% 18%' },
    { id: 'team-5', name: 'ishimwe samuel kelly',        role: 'GRAPHICS DESIGNER',        bio: 'Brings bold concepts to life through graphics, branding, and polished design details.',    photo: '/onekelly.jpg', position: '50% 20%' },
  ],
  gallery: [
    { src: '/photo1.jpg',            category: 'Advertising Photography' },
    { src: '/photo2.jpg',            category: 'Portrait Photography'    },
    { src: '/photo3.jpg',            category: 'Portrait Photography'    },
    { src: '/photo4.jpg',            category: 'Event Photography'       },
    { src: '/photo5.jpg',            category: 'Advertising Photography' },
    { src: '/photo6.jpg',            category: 'Event Photography'       },
    { src: '/photo8.jpg',            category: 'Event Photography'       },
    { src: '/photo9.jpg',            category: 'Portrait Photography'    },
    { src: '/photo10.jpg',           category: 'Portrait Photography'    },
    { src: '/photo12.jpg',           category: 'Event Photography'       },
    { src: '/photo14.jpg',           category: 'Event Photography'       },
    { src: '/live1.jpeg',            category: 'Event Photography'       },
    { src: '/live2.jpeg',            category: 'Event Photography'       },
    { src: '/web.jpg',               category: 'Advertising Photography' },
    { src: '/graphy33.jpg',          category: 'Advertising Photography' },
    { src: '/iwacu1.jpg',            category: 'Event Photography'       },
    { src: '/2I1A0386.JPG.jpeg',     category: 'Behind The Scenes'       },
    { src: '/2I1A0403.JPG.jpeg',     category: 'Behind The Scenes'       },
    { src: '/2I1A0407.JPG.jpeg',     category: 'Behind The Scenes'       },
    { src: '/2I1A0410.JPG.jpeg',     category: 'Behind The Scenes'       },
    { src: '/MARR0034.JPG',          category: 'Wedding Photography'     },
    { src: '/MARR0039.JPG',          category: 'Wedding Photography'     },
    { src: '/MARR0058.JPG',          category: 'Wedding Photography'     },
  ],
  contact: {
    phone:    '+250 781 691 713',
    email:    'info@flatproduction.rw',
    address:  'TCB house, KN 4 Avenue, Kigali, Rwanda',
    hours:    'Mon – Sat, 8:00 AM – 6:00 PM',
    whatsapp: '250781691713',
    socials: {
      instagram: 'https://instagram.com',
      youtube:   'https://youtube.com',
      linkedin:  'https://linkedin.com',
    },
  },
  pageHeroes: {
    about:     { title: 'Real Moments.\nBold Stories.\nTimeless Impact.', image: '/photo12.jpg' },
    services:  { title: 'Creative services built to help your brand stand out.',              image: '/live2.jpeg' },
    portfolio: { title: 'Our Work',                                                           image: '/photo1.jpg' },
    gallery:   { title: 'Visual Stories',                                                     image: '/photo3.jpg' },
    contact:   { title: "Let's Create Something Extraordinary",                               image: '/live2.jpeg' },
  },
};

const KEY = 'flatproduction_site_content_v2';

function cloneContent(c: SiteContent): SiteContent {
  return {
    hero:         { ...c.hero, images: [...(c.hero.images ?? [])], notes: [...(c.hero.notes ?? [])] },
    about:        { ...c.about },
    testimonials: c.testimonials.map(t => ({ ...t })),
    services:     c.services.map(s => ({ ...s })),
    portfolio:    c.portfolio.map(p => ({ ...p })),
    clientsIntro: c.clientsIntro,
    clients:      [...c.clients],
    clientLogos:  [...c.clientLogos],
    team:         c.team.map(m => ({ ...m })),
    gallery:      c.gallery.map(g => ({ ...g })),
    contact:      { ...c.contact, socials: { ...c.contact.socials } },
    pageHeroes: {
      about:     { ...c.pageHeroes.about },
      services:  { ...c.pageHeroes.services },
      portfolio: { ...c.pageHeroes.portfolio },
      gallery:   { ...c.pageHeroes.gallery },
      contact:   { ...c.pageHeroes.contact },
    },
  };
}

export function toOneSentence(text?: string): string {
  const value = (text || '').trim();
  if (!value) return '';
  const m = value.match(/^(.+?[.!?])(?:\s|$)/);
  if (m) return m[1].trim();
  return `${value}.`;
}

function normalize(parsed: Partial<SiteContent>): SiteContent {
  const incomingLogos = parsed.clientLogos || [];
  const cleanLogos    = incomingLogos.filter(logo => !logo.includes('clients.jpg'));
  const finalLogos    = cleanLogos.length > 0 ? cleanLogos : [...DEFAULT_SITE_CONTENT.clientLogos];

  const dph = DEFAULT_SITE_CONTENT.pageHeroes;
  const pph = (parsed.pageHeroes ?? {}) as Partial<SiteContent['pageHeroes']>;

  return {
    hero: {
      title:    parsed.hero?.title    ?? DEFAULT_SITE_CONTENT.hero.title,
      subtitle: parsed.hero?.subtitle ?? DEFAULT_SITE_CONTENT.hero.subtitle,
      images:   (parsed.hero?.images && parsed.hero.images.length > 0) ? parsed.hero.images : DEFAULT_SITE_CONTENT.hero.images || [],
      notes:    (parsed.hero?.notes  && parsed.hero.notes.length  > 0) ? parsed.hero.notes  : DEFAULT_SITE_CONTENT.hero.notes  || [],
    },
    about: { ...DEFAULT_SITE_CONTENT.about, ...parsed.about },
    testimonials: parsed.testimonials ?? [...DEFAULT_SITE_CONTENT.testimonials],
    services: (parsed.services ?? [...DEFAULT_SITE_CONTENT.services]).map((svc, i) => ({
      extendedDescription: DEFAULT_SITE_CONTENT.services[i]?.extendedDescription,
      ...svc,
    })),
    portfolio: (parsed.portfolio ?? [...DEFAULT_SITE_CONTENT.portfolio]).map(item => ({
      ...item,
      description: toOneSentence(item.description),
    })),
    clientsIntro: parsed.clientsIntro ?? DEFAULT_SITE_CONTENT.clientsIntro,
    clients:      parsed.clients      ?? [...DEFAULT_SITE_CONTENT.clients],
    clientLogos:  finalLogos,
    team:         parsed.team         ?? [...DEFAULT_SITE_CONTENT.team],
    gallery: (() => {
      const raw: any[] = (parsed.gallery && (parsed.gallery as any[]).length)
        ? (parsed.gallery as any[])
        : DEFAULT_SITE_CONTENT.gallery;
      return raw.map((item: any, i: number): GalleryItem =>
        typeof item === 'string'
          ? { src: item, category: DEFAULT_SITE_CONTENT.gallery[i]?.category ?? 'Event Photography' }
          : { src: item.src ?? '', category: item.category ?? 'Event Photography' }
      );
    })(),
    contact: {
      ...DEFAULT_SITE_CONTENT.contact,
      ...parsed.contact,
      socials: { ...DEFAULT_SITE_CONTENT.contact.socials, ...(parsed.contact?.socials ?? {}) },
    },
    pageHeroes: {
      about:     { ...dph.about,     ...(pph.about     ?? {}) },
      services:  { ...dph.services,  ...(pph.services  ?? {}) },
      portfolio: { ...dph.portfolio, ...(pph.portfolio ?? {}) },
      gallery:   { ...dph.gallery,   ...(pph.gallery   ?? {}) },
      contact:   { ...dph.contact,   ...(pph.contact   ?? {}) },
    },
  };
}

class ContentStore {
  private channel?: BroadcastChannel;

  constructor() {
    try { this.channel = new BroadcastChannel('flatproduction_content'); }
    catch { this.channel = undefined; }
  }

  read(): SiteContent {
    const raw = localStorage.getItem(KEY);
    if (!raw) return cloneContent(DEFAULT_SITE_CONTENT);
    try   { return normalize(JSON.parse(raw) as Partial<SiteContent>); }
    catch { return cloneContent(DEFAULT_SITE_CONTENT); }
  }

  write(payload: Partial<SiteContent>): SiteContent {
    const merged = normalize({ ...this.read(), ...payload });
    try {
      localStorage.setItem(KEY, JSON.stringify(merged));
    } catch {
      console.warn('[contentStore] localStorage write failed (quota exceeded?)');
      return this.read();
    }
    this.channel?.postMessage({ type: 'update', payload: merged });
    /* Also dispatch a CustomEvent so same-tab listeners (e.g. bfcache-restored
       pages or components that missed the BroadcastChannel) pick up the change. */
    window.dispatchEvent(new CustomEvent('flatproduction_update', { detail: merged }));
    return merged;
  }

  clear() {
    localStorage.removeItem(KEY);
    this.channel?.postMessage({ type: 'clear' });
    window.dispatchEvent(new CustomEvent('flatproduction_update', { detail: cloneContent(DEFAULT_SITE_CONTENT) }));
  }

  /** Subscribe to content changes from any tab.
   *  Returns an unsubscribe function — use it as the useEffect cleanup. */
  onUpdate(cb: (content: SiteContent) => void): () => void {
    /* BroadcastChannel: fires when ANOTHER tab calls write() */
    const msgHandler = (ev: MessageEvent) => {
      if (ev.data?.type === 'update') cb(ev.data.payload as SiteContent);
      if (ev.data?.type === 'clear')  cb(cloneContent(DEFAULT_SITE_CONTENT));
    };
    /* window.storage: native cross-tab localStorage change event (reliable fallback) */
    const storageHandler = (e: StorageEvent) => {
      if (e.key !== KEY) return;
      if (e.newValue) {
        try { cb(normalize(JSON.parse(e.newValue) as Partial<SiteContent>)); } catch {}
      } else {
        cb(cloneContent(DEFAULT_SITE_CONTENT));
      }
    };
    /* CustomEvent: fires in the SAME tab when write() is called directly
       (covers bfcache-restored pages and any non-admin same-tab consumers) */
    const customHandler = (e: Event) => {
      cb((e as CustomEvent<SiteContent>).detail);
    };

    this.channel?.addEventListener('message', msgHandler);
    window.addEventListener('storage', storageHandler);
    window.addEventListener('flatproduction_update', customHandler);

    return () => {
      this.channel?.removeEventListener('message', msgHandler);
      window.removeEventListener('storage', storageHandler);
      window.removeEventListener('flatproduction_update', customHandler);
    };
  }
}

export const contentStore = new ContentStore();
export { DEFAULT_SITE_CONTENT };
export type { SiteContent, Testimonial, PageHero, StatItem, ContactInfo, GalleryItem };
