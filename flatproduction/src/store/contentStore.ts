type SiteContent = {
  hero: { title: string; subtitle: string; images?: string[]; notes?: string[] };
  about: { heading: string; body: string };
  services: Array<{ id: string; title: string; description: string; image?: string }>;
  portfolio: Array<{ id: string; title: string; image?: string; videoUrl?: string; description?: string }>;
  clientsIntro: string;
  clients: string[];
  clientLogos: string[];
  team: Array<{ id: string; name: string; role: string; photo?: string; position?: string }>;
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
      'Photography. Video. Design.',
      'Live streaming for events and launches.',
      'Creative content built for brands.'
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
  portfolio: [
    { id: 'pf-1', title: 'Photography', image: '/photo1.jpg', description: 'Portrait and event storytelling.' },
    { id: 'pf-2', title: 'Video Production', image: '/photo3.jpg', description: 'Creative video campaigns and edits.' },
    { id: 'pf-3', title: 'Live Streaming', image: '/live1.jpeg', description: 'Live events and production feeds.' },
    { id: 'pf-4', title: 'Web & Digital', image: '/web.jpg', description: 'Website and digital presence projects.' },
    { id: 'pf-5', title: 'Branding', image: '/graphy33.jpg', description: 'Design, print, and visual identity.' },
    { id: 'pf-6', title: 'Documentary', image: '/photo12.jpg', description: 'Long-form visual storytelling.' },
  ],
  clientsIntro:
    'We work with brands, organizations, and creators who want visuals that feel sharp, memorable, and full of character. Every project is tailored to match your message, audience, and moment.',
  clients: ['Corporate', 'Weddings', 'Events', 'Non-profits'],
  clientLogos: ['/clients.jpg'],
  team: [
    { id: 'team-1', name: 'KADAffI PRO', role: 'Ceo & Founder', photo: '/kadaff.jpg', position: '50% 18%' },
    { id: 'team-2', name: 'Kelly', role: 'Graphics Designer', photo: '/ike.jpg', position: '50% 20%' },
    {
      id: 'team-3',
      name: 'Chancelline niyotugendana',
      role: 'Secretary & photographer',
      photo: '/chance.jpg',
      position: '50% 22%',
    },
    { id: 'team-4', name: 'anura', role: 'Intern', photo: '/chelsea.jpg', position: '50% 18%' },
    {
      id: 'team-5',
      name: 'ishimwe samuel kelly',
      role: 'GRAPHICS DESIGNER',
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
      // Ensure images and notes arrays are deeply copied
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

function normalize(parsed: Partial<SiteContent>): SiteContent {
  return {
    hero: {
      // Fallback title/subtitle
      title: parsed.hero?.title ?? DEFAULT_SITE_CONTENT.hero.title,
      subtitle: parsed.hero?.subtitle ?? DEFAULT_SITE_CONTENT.hero.subtitle,
      // RESTORE IMAGES IF EMPTY OR MISSING
      images: (parsed.hero?.images && parsed.hero.images.length > 0) 
        ? parsed.hero.images 
        : DEFAULT_SITE_CONTENT.hero.images || [],
      // RESTORE NOTES IF EMPTY OR MISSING
      notes: (parsed.hero?.notes && parsed.hero.notes.length > 0)
        ? parsed.hero.notes
        : DEFAULT_SITE_CONTENT.hero.notes || [],
    },
    about: { ...DEFAULT_SITE_CONTENT.about, ...parsed.about },
    services: parsed.services ?? [...DEFAULT_SITE_CONTENT.services],
    portfolio: parsed.portfolio ?? [...DEFAULT_SITE_CONTENT.portfolio],
    clientsIntro: parsed.clientsIntro ?? DEFAULT_SITE_CONTENT.clientsIntro,
    clients: parsed.clients ?? [...DEFAULT_SITE_CONTENT.clients],
    clientLogos: parsed.clientLogos ?? [...DEFAULT_SITE_CONTENT.clientLogos],
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