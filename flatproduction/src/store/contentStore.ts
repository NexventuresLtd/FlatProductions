type SiteContent = {
  hero: { title: string; subtitle: string; images?: string[]; notes?: string[] };
  about: { heading: string; body: string };
  services: Array<{ id: string; title: string; description: string; image?: string }>;
  // UPDATED: Added 'link' property here to match your Gallery component usage
  portfolio: Array<{ id: string; title: string; image?: string; videoUrl?: string; description?: string; link?: string }>;
  clientsIntro: string;
  clients: string[];
  clientLogos: string[];
  team: Array<{ id: string; name: string; role: string; bio?: string; photo?: string; position?: string }>;
  gallery: string[];
};

const DEFAULT_SITE_CONTENT: SiteContent = {
  hero: {
    title: 'Flat Productions',
    subtitle: 'Creative Solutions',
    images: [
      '/photo12.jpg',
      '/photo6.jpg',
      '/photo3.jpg',
      '/photo10.jpg',
      '/photo5.jpg',
    ],
    notes: [
      'Cinematic light, real moments, and stories that linger.',
      'Live coverage shaped to feel immediate and polished.',
      'Creative visuals built to make brands feel alive.'
    ]
  },
  about: {
    heading: 'Where Light Becomes Memory',
    body: 'Every frame is crafted with patience, emotion, and intent, turning ordinary scenes into cinematic moments that feel personal, timeless, and alive.',
  },
  services: [
    {
      id: 'svc-1',
      title: 'PHOTOGRAPHY & VIDEO PRODUCTION',
      description:
        'Delivering outstanding excellence in video production and photography: capturing moments, crafting stories, creating memories.',
      image: '/photo1.jpg',
    },
    {
      id: 'svc-2',
      title: 'LIVE STREAMING & FEED',
      description: 'Lets you interact with your audience in real time with a video feed, chat, reactions, and more.',
      image: '/live1.jpeg',
    },
    {
      id: 'svc-3',
      title: 'WEBSITE DESIGN',
      description: 'You are best in your work; let us help you show world your excellent achievements digitally.',
      image: '/web.jpg',
    },
    {
      id: 'svc-4',
      title: 'DESIGN - PRINTING & BRANDING',
      description:
        "It's hard to build and easy to destroy by not branding your excellent work; we are here to express your great work through stunning branding.",
      image: '/graphy33.jpg',
    },
    {
      id: 'svc-5',
      title: 'EVENT & ENTERTAINMENT',
      description: 'Here to help differentiate your event through outstanding creativity.',
      image: '/photo5.jpg',
    },
    {
      id: 'svc-6',
      title: 'DOCUMENTARY',
      description:
        'A better way of storytelling through interviewing, research, reality filming, narration, and production excellence through experience.',
      image: '/photo12.jpg',
    },
  ],
  // UPDATED: Portfolio now matches the 3-sentence descriptions and includes links
  portfolio: [
    { 
      id: 'pf-1', 
      title: 'Photography', 
      image: '/photo1.jpg', 
      link: '#',
      description: 'We capture stunning visuals that tell your unique story with precision and artistic flair.' 
    },
    { 
      id: 'pf-2', 
      title: 'Video Production', 
      image: '/photo3.jpg', 
      link: '#',
      description: 'We deliver high-end video production services tailored for commercials, events, and cinematic projects.' 
    },
    { 
      id: 'pf-3', 
      title: 'Live Streaming', 
      image: '/live1.jpeg', 
      link: '#',
      description: 'We provide professional multi-camera live streaming solutions to connect you with a global audience instantly.' 
    },
    { 
      id: 'pf-4', 
      title: 'Web & Digital', 
      image: '/web.jpg', 
      link: '#',
      description: 'We offer comprehensive digital strategies including web design, development, and online marketing solutions.' 
    },
    { 
      id: 'pf-5', 
      title: 'Branding', 
      image: '/graphy33.jpg', 
      link: '#',
      description: 'We create memorable brand identities that resonate deeply with your target market and stand out.' 
    },
    { 
      id: 'pf-6', 
      title: 'Documentary', 
      image: '/photo12.jpg', 
      link: '#',
      description: 'We specialize in in-depth documentary filmmaking that brings important real-world stories to light.' 
    },
  ],
  clientsIntro:
    'We work with brands, organizations, and creators who want visuals that feel sharp, memorable, and full of character. Every project is tailored to match your message, audience, and moment.',
  clients: ['Corporate', 'Weddings', 'Events', 'Non-profits'],
  clientLogos: ['/mtn.png', '/engen.png', '/inyange.jpg', '/nbg.jpg'],
  team: [
    { id: 'team-1', name: 'KADAffI PRO', role: 'Ceo & Founder', bio: 'Leads the creative direction and keeps every project focused, sharp, and client-centered.', photo: '/kadaff.jpg', position: '50% 18%' },
    { id: 'team-2', name: 'Kelly', role: 'Graphics Designer', bio: 'Shapes visual identities, layouts, and brand assets with a clean, modern style.', photo: '/ike.jpg', position: '50% 20%' },
    {
      id: 'team-3',
      name: 'Chancelline niyotugendana',
      role: 'Secretary & photographer',
      bio: 'Keeps the studio organized while capturing moments with a calm eye for detail.',
      photo: '/chance.jpg',
      position: '50% 22%',
    },
    { id: 'team-4', name: 'anura', role: 'Intern', bio: 'Supports the team across shoots, edits, and day-to-day production work.', photo: '/chelsea.jpg', position: '50% 18%' },
    {
      id: 'team-5',
      name: 'ishimwe samuel kelly',
      role: 'GRAPHICS DESIGNER',
      bio: 'Brings bold concepts to life through graphics, branding, and polished design details.',
      photo: '/onekelly.jpg',
      position: '50% 20%',
    },
  ],
  gallery: [
    '/photo1.jpg',
    '/photo2.jpg',
    '/photo3.jpg',
    '/photo4.jpg',
    '/photo5.jpg',
    '/photo6.jpg',
    '/photo8.jpg',
    '/photo9.jpg',
    '/photo10.jpg',
    '/photo12.jpg',
    '/photo14.jpg',
    '/live1.jpeg',
    '/live2.jpeg',
    '/web.jpg',
    '/graphy33.jpg',
    '/iwacu1.jpg',
  ],
};

const KEY = 'flatproduction_site_content_v2';

function cloneContent(content: SiteContent): SiteContent {
  return {
    hero: { 
      ...content.hero,
      images: content.hero.images ? [...content.hero.images] : [],
      notes: content.hero.notes ? [...content.hero.notes] : []
    },
    about: { ...content.about },
    services: content.services.map((service) => ({ ...service })),
    portfolio: content.portfolio.map((item) => ({ ...item })),
    clientsIntro: content.clientsIntro,
    clients: [...content.clients],
    clientLogos: [...content.clientLogos],
    team: content.team.map((member) => ({ ...member })),
    gallery: [...content.gallery],
  };
}

export function toOneSentence(text?: string): string {
  const value = (text || '').trim();

  if (!value) {
    return '';
  }

  const firstSentenceMatch = value.match(/^(.+?[.!?])(?:\s|$)/);

  if (firstSentenceMatch) {
    return firstSentenceMatch[1].trim();
  }

  return `${value}.`;
}

function normalize(parsed: Partial<SiteContent>): SiteContent {
  // --- AUTO-CLEAN LOGIC ---
  // 1. Get saved logos (or empty array)
  const incomingLogos = parsed.clientLogos || [];
  
  // 2. Filter out 'clients.jpg' specifically to prevent it from ever showing
  const cleanLogos = incomingLogos.filter(logo => !logo.includes('clients.jpg'));

  // 3. Decide: Use cleaned logos if any remain, otherwise fallback to defaults
  const finalLogos = cleanLogos.length > 0 ? cleanLogos : [...DEFAULT_SITE_CONTENT.clientLogos];
  // -----------------------

  return {
    hero: {
      title: parsed.hero?.title ?? DEFAULT_SITE_CONTENT.hero.title,
      subtitle: parsed.hero?.subtitle ?? DEFAULT_SITE_CONTENT.hero.subtitle,
      images: (parsed.hero?.images && parsed.hero.images.length > 0) 
        ? parsed.hero.images 
        : DEFAULT_SITE_CONTENT.hero.images || [],
      notes: (parsed.hero?.notes && parsed.hero.notes.length > 0)
        ? parsed.hero.notes
        : DEFAULT_SITE_CONTENT.hero.notes || [],
    },
    about: { ...DEFAULT_SITE_CONTENT.about, ...parsed.about },
    services: parsed.services ?? [...DEFAULT_SITE_CONTENT.services],
    portfolio: (parsed.portfolio ?? [...DEFAULT_SITE_CONTENT.portfolio]).map((item) => ({
      ...item,
      description: toOneSentence(item.description),
    })),
    clientsIntro: parsed.clientsIntro ?? DEFAULT_SITE_CONTENT.clientsIntro,
    clients: parsed.clients ?? [...DEFAULT_SITE_CONTENT.clients],
    
    // Use the calculated safe logos
    clientLogos: finalLogos,
    
    team: parsed.team ?? [...DEFAULT_SITE_CONTENT.team],
    gallery: parsed.gallery ?? [...DEFAULT_SITE_CONTENT.gallery],
  };
}

class ContentStore {
  private channel?: BroadcastChannel;

  constructor() {
    try {
      this.channel = new BroadcastChannel('flatproduction_content');
    } catch (e) {
      this.channel = undefined;
    }
  }

  read(): SiteContent {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      return cloneContent(DEFAULT_SITE_CONTENT);
    }

    try {
      const parsed = JSON.parse(raw) as Partial<SiteContent>;
      return normalize(parsed);
    } catch (e) {
      return cloneContent(DEFAULT_SITE_CONTENT);
    }
  }

  write(payload: Partial<SiteContent>) {
    const cur = this.read();
    const merged = normalize({ ...cur, ...payload });
    localStorage.setItem(KEY, JSON.stringify(merged));
    this.channel?.postMessage({ type: 'update', payload: merged });
    return merged;
  }

  clear() {
    localStorage.removeItem(KEY);
    this.channel?.postMessage({ type: 'clear' });
  }

  onUpdate(cb: (content: SiteContent) => void) {
    this.channel?.addEventListener('message', (ev) => {
      if (ev.data?.type === 'update') cb(ev.data.payload);
      if (ev.data?.type === 'clear') cb(cloneContent(DEFAULT_SITE_CONTENT));
    });
  }
}

export const contentStore = new ContentStore();
export { DEFAULT_SITE_CONTENT };
export type { SiteContent };