type Testimonial = { id: string; name: string; logoSrc: string; quote: string };
type PageHero    = { title: string; image: string };

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
  };
  testimonials: Testimonial[];
  services: Array<{ id: string; title: string; description: string; image?: string }>;
  portfolio: Array<{ id: string; title: string; image?: string; videoUrl?: string; btsUrl?: string; description?: string; link?: string; serviceId?: string; category?: string }>;
  clientsIntro: string;
  clients: string[];
  clientLogos: string[];
  team: Array<{ id: string; name: string; role: string; bio?: string; photo?: string; position?: string }>;
  gallery: string[];
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
  },
  testimonials: [
    { id: 'tm-1', name: 'MTN Rwanda',         logoSrc: '/mtn.png',      quote: 'Flat Production delivered event visuals and digital storytelling that elevated our customer engagement campaigns.' },
    { id: 'tm-2', name: 'Engen Rwanda',        logoSrc: '/engen.png',    quote: 'Their livestream and content team managed high-pressure launches smoothly and produced quality media in real time.' },
    { id: 'tm-3', name: 'Inyange Industries',  logoSrc: '/inyange.jpg',  quote: 'From photography to post-production, they helped us communicate our brand story with clarity and premium quality.' },
    { id: 'tm-4', name: 'NBG',                 logoSrc: '/nbg.jpg',      quote: 'We trusted Flat Production for documentary storytelling and campaign content, and the outcome was impactful and authentic.' },
  ],
  services: [
    { id: 'svc-1', title: 'PHOTOGRAPHY & VIDEO PRODUCTION', description: 'Delivering outstanding excellence in video production and photography: capturing moments, crafting stories, creating memories.', image: '/photo1.jpg' },
    { id: 'svc-2', title: 'LIVE STREAMING & FEED',          description: 'Lets you interact with your audience in real time with a video feed, chat, reactions, and more.',                               image: '/live1.jpeg' },
    { id: 'svc-3', title: 'WEBSITE DESIGN',                 description: 'You are best in your work; let us help you show world your excellent achievements digitally.',                                   image: '/web.jpg' },
    { id: 'svc-4', title: 'DESIGN - PRINTING & BRANDING',   description: "It's hard to build and easy to destroy by not branding your excellent work; we are here to express your great work through stunning branding.", image: '/graphy33.jpg' },
    { id: 'svc-5', title: 'EVENT & ENTERTAINMENT',          description: 'Here to help differentiate your event through outstanding creativity.',                                                          image: '/photo5.jpg' },
    { id: 'svc-6', title: 'DOCUMENTARY',                    description: 'A better way of storytelling through interviewing, research, reality filming, narration, and production excellence through experience.', image: '/photo12.jpg' },
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
    '/photo1.jpg', '/photo2.jpg', '/photo3.jpg', '/photo4.jpg', '/photo5.jpg', '/photo6.jpg',
    '/photo8.jpg', '/photo9.jpg', '/photo10.jpg', '/photo12.jpg', '/photo14.jpg',
    '/live1.jpeg', '/live2.jpeg', '/web.jpg', '/graphy33.jpg', '/iwacu1.jpg',
  ],
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
    gallery:      [...c.gallery],
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
    services:  parsed.services ?? [...DEFAULT_SITE_CONTENT.services],
    portfolio: (parsed.portfolio ?? [...DEFAULT_SITE_CONTENT.portfolio]).map(item => ({
      ...item,
      description: toOneSentence(item.description),
    })),
    clientsIntro: parsed.clientsIntro ?? DEFAULT_SITE_CONTENT.clientsIntro,
    clients:      parsed.clients      ?? [...DEFAULT_SITE_CONTENT.clients],
    clientLogos:  finalLogos,
    team:         parsed.team         ?? [...DEFAULT_SITE_CONTENT.team],
    gallery:      parsed.gallery      ?? [...DEFAULT_SITE_CONTENT.gallery],
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

  write(payload: Partial<SiteContent>) {
    const merged = normalize({ ...this.read(), ...payload });
    localStorage.setItem(KEY, JSON.stringify(merged));
    this.channel?.postMessage({ type: 'update', payload: merged });
    return merged;
  }

  clear() {
    localStorage.removeItem(KEY);
    this.channel?.postMessage({ type: 'clear' });
  }

  onUpdate(cb: (content: SiteContent) => void) {
    this.channel?.addEventListener('message', ev => {
      if (ev.data?.type === 'update') cb(ev.data.payload);
      if (ev.data?.type === 'clear')  cb(cloneContent(DEFAULT_SITE_CONTENT));
    });
  }
}

export const contentStore = new ContentStore();
export { DEFAULT_SITE_CONTENT };
export type { SiteContent, Testimonial, PageHero };
