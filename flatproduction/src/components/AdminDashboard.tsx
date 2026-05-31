import React, { useEffect, useState } from 'react';
import { contentStore, type SiteContent, DEFAULT_SITE_CONTENT, toOneSentence } from '../store/contentStore';
import './AdminDashboard.css';

type SectionKey = 'hero' | 'about' | 'services' | 'portfolio' | 'gallery' | 'clients' | 'team';

type ServiceItem = SiteContent['services'][number];
type PortfolioItem = SiteContent['portfolio'][number];
type TeamItem = SiteContent['team'][number];

const IMAGE_SUGGESTIONS = [
  '/photo1.jpg',
  '/photo3.jpg',
  '/photo12.jpg',
  '/photo14.jpg',
  '/live1.jpeg',
  '/web.jpg',
  '/graphy33.jpg',
  '/clients.jpg',
  '/kadaff.jpg',
  '/ike.jpg',
  '/chance.jpg',
  '/onekelly.jpg',
];

const VIDEO_LINK_SUGGESTIONS = [
  'https://youtu.be/RjXqY31jpy0',
  'https://youtu.be/de6oWk6vGlM',
];

const BTS_LINK_SUGGESTIONS = [
  'https://youtu.be/DHR85WBk4tY',
  'https://youtu.be/zWTFpxzQaes',
];

const EMPTY_SERVICE = (): ServiceItem => ({
  id: cryptoId(),
  title: 'New service',
  description: 'Short caption here.',
  image: '/photo1.jpg',
});

const EMPTY_PORTFOLIO = (): PortfolioItem => ({
  id: cryptoId(),
  title: 'New portfolio item',
  image: '/photo1.jpg',
  videoUrl: '',
  btsUrl: '',
  description: '',
});

const EMPTY_TEAM = (): TeamItem => ({
  id: cryptoId(),
  name: 'Team member',
  role: 'Role',
  bio: 'Short bio goes here.',
  photo: '/kadaff.jpg',
  position: '50% 20%',
});

function cryptoId() {
  return `id-${Math.random().toString(36).slice(2, 9)}`;
}

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

function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  if (toIndex < 0 || toIndex >= items.length) return items;
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

// Icons
const Icons = {
  Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>,
  Layout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="3" x2="21" y1="9" y2="9" /><line x1="9" x2="9" y1="21" y2="9" /></svg>,
  Layers: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" /><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" /><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" /></svg>,
  Users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  Briefcase: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
  Image: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>,
  LogOut: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>,
  ChevronUp: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>,
  ChevronDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>,
  Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>,
  ExternalLink: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" /></svg>,
  RotateCcw: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>,
};

const AdminDashboard: React.FC = () => {
  const [active, setActive] = useState<SectionKey>('hero');
  const [draft, setDraft] = useState<SiteContent>(() => cloneContent(contentStore.read()));

  useEffect(() => {
    const onUpdate = (content: SiteContent) => setDraft(cloneContent(content));
    contentStore.onUpdate(onUpdate);
  }, []);

  const persist = (next: SiteContent) => {
    const safeNext = cloneContent(next);
    setDraft(safeNext);
    contentStore.write(safeNext);
  };

  const resetActiveSection = () => {
    if (active === 'hero') { persist({ ...draft, hero: { ...DEFAULT_SITE_CONTENT.hero, images: DEFAULT_SITE_CONTENT.hero?.images || [], notes: DEFAULT_SITE_CONTENT.hero?.notes || [] } }); return; }
    if (active === 'about') { persist({ ...draft, about: { ...DEFAULT_SITE_CONTENT.about } }); return; }
    if (active === 'services') { persist({ ...draft, services: DEFAULT_SITE_CONTENT.services.map((item) => ({ ...item })) }); return; }
    if (active === 'portfolio') { persist({ ...draft, portfolio: DEFAULT_SITE_CONTENT.portfolio.map((item) => ({ ...item })) }); return; }
    if (active === 'gallery') { persist({ ...draft, gallery: [...DEFAULT_SITE_CONTENT.gallery] }); return; }
    if (active === 'clients') { persist({ ...draft, clientsIntro: DEFAULT_SITE_CONTENT.clientsIntro, clients: [...DEFAULT_SITE_CONTENT.clients], clientLogos: [...DEFAULT_SITE_CONTENT.clientLogos] }); return; }
    persist({ ...draft, team: DEFAULT_SITE_CONTENT.team.map((item) => ({ ...item })) });
  };

  // Update functions
  const updateHero = (field: 'title' | 'subtitle', value: string) => persist({ ...draft, hero: { ...draft.hero, [field]: value } });
  const updateHeroNote = (index: number, value: string) => {
    const currentNotes = draft.hero.notes || [];
    const nextNotes = [...currentNotes];
    while (nextNotes.length < index) nextNotes.push('');
    nextNotes[index] = value;
    persist({ ...draft, hero: { ...draft.hero, notes: nextNotes } });
  };
  const getHeroImages = () => draft.hero.images || [];
  const updateHeroImage = (index: number, value: string) => persist({ ...draft, hero: { ...draft.hero, images: getHeroImages().map((img, i) => (i === index ? value : img)) } });
  const addHeroImage = () => persist({ ...draft, hero: { ...draft.hero, images: [...getHeroImages(), '/photo1.jpg'], notes: [...(draft.hero.notes || []), 'Short slide caption'] } });
  const moveHeroImage = (index: number, direction: -1 | 1) => persist({ ...draft, hero: { ...draft.hero, images: moveItem(getHeroImages(), index, index + direction), notes: moveItem(draft.hero.notes || [], index, index + direction) } });
  const removeHeroImage = (index: number) => persist({ ...draft, hero: { ...draft.hero, images: getHeroImages().filter((_, i) => i !== index), notes: (draft.hero.notes || []).filter((_, i) => i !== index) } });
  const clearHeroImages = () => persist({ ...draft, hero: { ...draft.hero, images: [], notes: [] } });

  const updateAbout = (field: 'heading' | 'body', value: string) => persist({ ...draft, about: { ...draft.about, [field]: value } });

  const updateService = (index: number, field: 'title' | 'description' | 'image', value: string) => persist({ ...draft, services: draft.services.map((s, i) => (i === index ? { ...s, [field]: value } : s)) });
  const addService = () => persist({ ...draft, services: [...draft.services, EMPTY_SERVICE()] });
  const moveService = (index: number, direction: -1 | 1) => persist({ ...draft, services: moveItem(draft.services, index, index + direction) });
  const clearServices = () => persist({ ...draft, services: [] });
  const removeService = (index: number) => persist({ ...draft, services: draft.services.filter((_, i) => i !== index) });

  const updatePortfolio = (index: number, field: 'title' | 'image' | 'btsUrl', value: string) => persist({ ...draft, portfolio: draft.portfolio.map((item, i) => (i === index ? { ...item, [field]: value } : item)) });
  const updatePortfolioVideo = (index: number, value: string) => persist({ ...draft, portfolio: draft.portfolio.map((item, i) => (i === index ? { ...item, videoUrl: value } : item)) });
  const updatePortfolioBts = (index: number, value: string) => persist({ ...draft, portfolio: draft.portfolio.map((item, i) => (i === index ? { ...item, btsUrl: value } : item)) });
  const updatePortfolioDescription = (index: number, value: string) => persist({ ...draft, portfolio: draft.portfolio.map((item, i) => (i === index ? { ...item, description: toOneSentence(value) } : item)) });
  const addPortfolio = () => persist({ ...draft, portfolio: [...draft.portfolio, EMPTY_PORTFOLIO()] });
  const movePortfolio = (index: number, direction: -1 | 1) => persist({ ...draft, portfolio: moveItem(draft.portfolio, index, index + direction) });
  const clearPortfolio = () => persist({ ...draft, portfolio: [] });
  const removePortfolio = (index: number) => persist({ ...draft, portfolio: draft.portfolio.filter((_, i) => i !== index) });

  const updateGalleryImage = (index: number, value: string) => persist({ ...draft, gallery: draft.gallery.map((img, i) => (i === index ? value : img)) });
  const addGalleryImage = () => persist({ ...draft, gallery: [...draft.gallery, '/photo1.jpg'] });
  const moveGalleryImage = (index: number, direction: -1 | 1) => persist({ ...draft, gallery: moveItem(draft.gallery, index, index + direction) });
  const clearGallery = () => persist({ ...draft, gallery: [] });
  const removeGalleryImage = (index: number) => persist({ ...draft, gallery: draft.gallery.filter((_, i) => i !== index) });

  const updateClientsIntro = (value: string) => persist({ ...draft, clientsIntro: value });
  const updateClient = (index: number, value: string) => persist({ ...draft, clients: draft.clients.map((c, i) => (i === index ? value : c)) });
  const addClient = () => persist({ ...draft, clients: [...draft.clients, 'New client category'] });
  const moveClient = (index: number, direction: -1 | 1) => persist({ ...draft, clients: moveItem(draft.clients, index, index + direction) });
  const clearClients = () => persist({ ...draft, clients: [] });
  const removeClient = (index: number) => persist({ ...draft, clients: draft.clients.filter((_, i) => i !== index) });
  const updateClientLogo = (index: number, value: string) => persist({ ...draft, clientLogos: draft.clientLogos.map((l, i) => (i === index ? value : l)) });
  const addClientLogo = () => persist({ ...draft, clientLogos: [...draft.clientLogos, '/clients.jpg'] });
  const moveClientLogo = (index: number, direction: -1 | 1) => persist({ ...draft, clientLogos: moveItem(draft.clientLogos, index, index + direction) });
  const clearClientLogos = () => persist({ ...draft, clientLogos: [] });
  const removeClientLogo = (index: number) => persist({ ...draft, clientLogos: draft.clientLogos.filter((_, i) => i !== index) });

  const updateTeam = (index: number, field: 'name' | 'role' | 'bio' | 'photo' | 'position', value: string) => persist({ ...draft, team: draft.team.map((m, i) => (i === index ? { ...m, [field]: value } : m)) });
  const addTeamMember = () => persist({ ...draft, team: [...draft.team, EMPTY_TEAM()] });
  const moveTeamMember = (index: number, direction: -1 | 1) => persist({ ...draft, team: moveItem(draft.team, index, index + direction) });
  const clearTeam = () => persist({ ...draft, team: [] });
  const removeTeamMember = (index: number) => persist({ ...draft, team: draft.team.filter((_, i) => i !== index) });

  const previewWebsite = () => window.open('/', '_blank', 'noopener,noreferrer');
  const logout = () => { sessionStorage.removeItem('flat_admin_auth'); window.location.pathname = '/login'; };

  const getActiveItemCount = () => {
    if (active === 'hero') return `${getHeroImages().length} slides`;
    if (active === 'about') return '1 section';
    if (active === 'services') return `${draft.services.length} services`;
    if (active === 'portfolio') return `${draft.portfolio.length} items`;
    if (active === 'gallery') return `${draft.gallery.length} images`;
    if (active === 'clients') return `${draft.clients.length} tags + ${draft.clientLogos.length} logos`;
    return `${draft.team.length} members`;
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Flat Admin</h1>
        </div>

        <nav className="sidebar-nav">
          {(['hero', 'about', 'services', 'portfolio', 'gallery', 'clients', 'team'] as SectionKey[]).map((section) => (
            <button
              key={section}
              className={`nav-item ${active === section ? 'active' : ''}`}
              onClick={() => setActive(section)}
            >
              <span className="nav-icon">
                {section === 'hero' && <Icons.Dashboard />}
                {section === 'about' && <Icons.Layout />}
                {section === 'services' && <Icons.Briefcase />}
                {section === 'portfolio' && <Icons.Layers />}
                {section === 'gallery' && <Icons.Image />}
                {section === 'clients' && <Icons.Users />}
                {section === 'team' && <Icons.Users />}
              </span>
              <span className="nav-text">{section.charAt(0).toUpperCase() + section.slice(1)}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            <Icons.LogOut /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div>
            <h2>{active.charAt(0).toUpperCase() + active.slice(1)}</h2>
            <p className="breadcrumbs">Dashboard / {active}</p>
          </div>
          
          <div className="topbar-actions">
            <div className="status-badge">
              <span className="status-dot"></span>
              <span>All changes saved</span>
            </div>
            <button className="btn btn-ghost" onClick={resetActiveSection}>
              <Icons.RotateCcw /> Reset
            </button>
            <button className="btn btn-primary" onClick={previewWebsite}>
              <Icons.ExternalLink /> Preview Site
            </button>
          </div>
        </header>

        <div className="content-area">
          
          {/* HERO SECTION */}
          {active === 'hero' && (
            <div className="section">
              <div className="section-header-row">
                <h3>Hero Slider</h3>
                <div className="actions">
                  <button className="btn btn-danger" onClick={clearHeroImages} disabled={!getHeroImages().length}>Clear All</button>
                  <button className="btn btn-primary" onClick={addHeroImage}>Add Slide</button>
                </div>
              </div>

              <div className="card card--no-padding">
                <div className="form-group-grid">
                  <Field label="Headline">
                    <input value={draft.hero.title} onChange={(e) => updateHero('title', e.target.value)} placeholder="Enter headline..." />
                  </Field>
                  <Field label="Subtitle">
                    <textarea rows={3} value={draft.hero.subtitle} onChange={(e) => updateHero('subtitle', e.target.value)} placeholder="Enter subtitle..." />
                  </Field>
                </div>
              </div>

              <div className="items-container">
                {getHeroImages().map((image, index) => (
                  <div className="item-card item-card--horizontal" key={`${image}-${index}`}>
                    <div className="item-image-preview">
                      <img src={image} alt={`Slide ${index}`} />
                    </div>
                    <div className="item-details">
                      <div className="item-header">
                        <h4>Slide {index + 1}</h4>
                        <div className="item-controls">
                          <button className="icon-btn" onClick={() => moveHeroImage(index, -1)} disabled={index === 0} title="Move Up"><Icons.ChevronUp /></button>
                          <button className="icon-btn" onClick={() => moveHeroImage(index, 1)} disabled={index === getHeroImages().length - 1} title="Move Down"><Icons.ChevronDown /></button>
                          <button className="icon-btn icon-btn-danger" onClick={() => removeHeroImage(index)} title="Delete"><Icons.Trash /></button>
                        </div>
                      </div>
                      <div className="form-group">
                        <Field label="Image URL">
                          <input value={image} onChange={(e) => updateHeroImage(index, e.target.value)} />
                        </Field>
                        <Field label="Caption">
                          <input value={draft.hero.notes?.[index] ?? ''} onChange={(e) => updateHeroNote(index, e.target.value)} />
                        </Field>
                      </div>
                      <SuggestionRow values={IMAGE_SUGGESTIONS} onPick={(val) => updateHeroImage(index, val)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABOUT SECTION */}
          {active === 'about' && (
            <div className="section">
              <div className="section-header-row">
                <h3>About Section</h3>
              </div>
              <div className="card">
                <div className="form-group">
                  <Field label="Heading">
                    <input value={draft.about.heading} onChange={(e) => updateAbout('heading', e.target.value)} />
                  </Field>
                  <Field label="Body Content">
                    <textarea rows={10} value={draft.about.body} onChange={(e) => updateAbout('body', e.target.value)} />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {/* SERVICES SECTION */}
          {active === 'services' && (
            <div className="section">
              <div className="section-header-row">
                <h3>Services</h3>
                <div className="actions">
                  <button className="btn btn-danger" onClick={clearServices}>Clear All</button>
                  <button className="btn btn-primary" onClick={addService}>Add Service</button>
                </div>
              </div>
              <div className="items-container">
                {draft.services.map((service, index) => (
                  <div className="item-card" key={service.id}>
                    <div className="item-image-preview">
                      <img src={service.image ?? '/photo1.jpg'} alt={service.title} />
                    </div>
                    <div className="item-details">
                      <div className="item-header">
                        <h4>Service {index + 1}</h4>
                        <div className="item-controls">
                          <button className="icon-btn" onClick={() => moveService(index, -1)} disabled={index === 0}><Icons.ChevronUp /></button>
                          <button className="icon-btn" onClick={() => moveService(index, 1)} disabled={index === draft.services.length - 1}><Icons.ChevronDown /></button>
                          <button className="icon-btn icon-btn-danger" onClick={() => removeService(index)}><Icons.Trash /></button>
                        </div>
                      </div>
                      <div className="form-group-grid">
                        <Field label="Title"><input value={service.title} onChange={(e) => updateService(index, 'title', e.target.value)} /></Field>
                        <Field label="Image URL"><input value={service.image ?? ''} onChange={(e) => updateService(index, 'image', e.target.value)} /></Field>
                        <Field label="Description" className="col-span-2"><textarea rows={3} value={service.description} onChange={(e) => updateService(index, 'description', e.target.value)} /></Field>
                      </div>
                      <SuggestionRow values={IMAGE_SUGGESTIONS} onPick={(val) => updateService(index, 'image', val)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PORTFOLIO SECTION */}
          {active === 'portfolio' && (
            <div className="section">
              <div className="section-header-row">
                <h3>Portfolio</h3>
                <div className="actions">
                  <button className="btn btn-danger" onClick={clearPortfolio}>Clear All</button>
                  <button className="btn btn-primary" onClick={addPortfolio}>Add Project</button>
                </div>
              </div>
              <div className="items-container">
                {draft.portfolio.map((item, index) => (
                  <div className="item-card item-card--horizontal" key={item.id}>
                    <div className="item-image-preview">
                      <img src={item.image ?? '/photo1.jpg'} alt={item.title} />
                    </div>
                    <div className="item-details">
                      <div className="item-header">
                        <h4>Project {index + 1}</h4>
                        <div className="item-controls">
                          <button className="icon-btn" onClick={() => movePortfolio(index, -1)} disabled={index === 0}><Icons.ChevronUp /></button>
                          <button className="icon-btn" onClick={() => movePortfolio(index, 1)} disabled={index === draft.portfolio.length - 1}><Icons.ChevronDown /></button>
                          <button className="icon-btn icon-btn-danger" onClick={() => removePortfolio(index)}><Icons.Trash /></button>
                        </div>
                      </div>
                      <div className="form-group-grid">
                        <Field label="Title"><input value={item.title} onChange={(e) => updatePortfolio(index, 'title', e.target.value)} /></Field>
                        <Field label="Image URL"><input value={item.image ?? ''} onChange={(e) => updatePortfolio(index, 'image', e.target.value)} /></Field>
                        <Field label="Video URL"><input value={item.videoUrl ?? ''} onChange={(e) => updatePortfolioVideo(index, e.target.value)} placeholder="YouTube Link" /></Field>
                        <Field label="BTS URL"><input value={item.btsUrl ?? ''} onChange={(e) => updatePortfolioBts(index, e.target.value)} placeholder="YouTube Link" /></Field>
                        <Field label="Description" className="col-span-2"><textarea rows={2} value={item.description ?? ''} onChange={(e) => updatePortfolioDescription(index, e.target.value)} /></Field>
                      </div>
                      <SuggestionRow label="Images" values={IMAGE_SUGGESTIONS} onPick={(val) => updatePortfolio(index, 'image', val)} />
                      <SuggestionRow label="Videos" values={VIDEO_LINK_SUGGESTIONS} onPick={(val) => updatePortfolioVideo(index, val)} />
                      <SuggestionRow label="BTS" values={BTS_LINK_SUGGESTIONS} onPick={(val) => updatePortfolioBts(index, val)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GALLERY SECTION */}
          {active === 'gallery' && (
            <div className="section">
              <div className="section-header-row">
                <h3>Gallery</h3>
                <div className="actions">
                  <button className="btn btn-danger" onClick={clearGallery}>Clear All</button>
                  <button className="btn btn-primary" onClick={addGalleryImage}>Add Image</button>
                </div>
              </div>
              <div className="grid-container">
                {draft.gallery.map((image, index) => (
                  <div className="grid-card" key={`${image}-${index}`}>
                    <div className="grid-preview">
                      <img src={image} alt={`Gallery ${index}`} />
                      <div className="grid-overlay">
                         <button className="icon-btn icon-btn-light" onClick={() => moveGalleryImage(index, -1)} disabled={index === 0}><Icons.ChevronUp /></button>
                         <button className="icon-btn icon-btn-light" onClick={() => moveGalleryImage(index, 1)} disabled={index === draft.gallery.length - 1}><Icons.ChevronDown /></button>
                         <button className="icon-btn icon-btn-danger" onClick={() => removeGalleryImage(index)}><Icons.Trash /></button>
                      </div>
                    </div>
                    <div className="grid-details">
                      <Field label="URL" compact><input value={image} onChange={(e) => updateGalleryImage(index, e.target.value)} /></Field>
                      <SuggestionRow values={IMAGE_SUGGESTIONS} onPick={(val) => updateGalleryImage(index, val)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CLIENTS SECTION */}
          {active === 'clients' && (
            <div className="section">
              <div className="section-header-row"><h3>Clients</h3></div>
              
              <div className="subsection">
                <h4>Intro Text</h4>
                <div className="card">
                  <Field label="Introduction">
                    <textarea rows={2} value={draft.clientsIntro} onChange={(e) => updateClientsIntro(e.target.value)} />
                  </Field>
                </div>
              </div>

              <div className="subsection">
                <div className="subsection-header">
                  <h4>Client Tags</h4>
                  <div className="actions">
                    <button className="btn-sm btn-danger" onClick={clearClients}>Clear</button>
                    <button className="btn-sm btn-primary" onClick={addClient}>Add Tag</button>
                  </div>
                </div>
                <div className="tags-list">
                  {draft.clients.map((client, index) => (
                    <div key={index} className="tag-row">
                      <div className="tag-input-wrapper">
                        <Field label={`Tag ${index+1}`} compact>
                          <div className="input-group">
                            <input value={client} onChange={(e) => updateClient(index, e.target.value)} />
                            <button className="icon-btn icon-btn-danger" onClick={() => removeClient(index)}><Icons.Trash /></button>
                          </div>
                        </Field>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="subsection">
                <div className="subsection-header">
                  <h4>Client Logos</h4>
                  <div className="actions">
                    <button className="btn-sm btn-danger" onClick={clearClientLogos}>Clear</button>
                    <button className="btn-sm btn-primary" onClick={addClientLogo}>Add Logo</button>
                  </div>
                </div>
                <div className="grid-container">
                  {draft.clientLogos.map((logo, index) => (
                    <div className="grid-card" key={`${logo}-${index}`}>
                      <div className="grid-preview">
                        <img src={logo} alt={`Logo ${index}`} />
                        <div className="grid-overlay">
                          <button className="icon-btn icon-btn-light" onClick={() => moveClientLogo(index, -1)} disabled={index === 0}><Icons.ChevronUp /></button>
                          <button className="icon-btn icon-btn-light" onClick={() => moveClientLogo(index, 1)} disabled={index === draft.clientLogos.length - 1}><Icons.ChevronDown /></button>
                          <button className="icon-btn icon-btn-danger" onClick={() => removeClientLogo(index)}><Icons.Trash /></button>
                        </div>
                      </div>
                      <div className="grid-details">
                        <Field label="URL" compact><input value={logo} onChange={(e) => updateClientLogo(index, e.target.value)} /></Field>
                        <SuggestionRow values={IMAGE_SUGGESTIONS} onPick={(val) => updateClientLogo(index, val)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TEAM SECTION */}
          {active === 'team' && (
            <div className="section">
              <div className="section-header-row">
                <h3>Team</h3>
                <div className="actions">
                  <button className="btn btn-danger" onClick={clearTeam}>Clear All</button>
                  <button className="btn btn-primary" onClick={addTeamMember}>Add Member</button>
                </div>
              </div>
              <div className="items-container">
                {draft.team.map((member, index) => (
                  <div className="item-card" key={member.id}>
                    <div className="item-image-preview">
                      <img src={member.photo ?? '/kadaff.jpg'} alt={member.name} />
                    </div>
                    <div className="item-details">
                      <div className="item-header">
                        <h4>Member {index + 1}</h4>
                        <div className="item-controls">
                          <button className="icon-btn" onClick={() => moveTeamMember(index, -1)} disabled={index === 0}><Icons.ChevronUp /></button>
                          <button className="icon-btn" onClick={() => moveTeamMember(index, 1)} disabled={index === draft.team.length - 1}><Icons.ChevronDown /></button>
                          <button className="icon-btn icon-btn-danger" onClick={() => removeTeamMember(index)}><Icons.Trash /></button>
                        </div>
                      </div>
                      <div className="form-group-grid">
                        <Field label="Name"><input value={member.name} onChange={(e) => updateTeam(index, 'name', e.target.value)} /></Field>
                        <Field label="Role"><input value={member.role} onChange={(e) => updateTeam(index, 'role', e.target.value)} /></Field>
                        <Field label="Photo URL"><input value={member.photo ?? ''} onChange={(e) => updateTeam(index, 'photo', e.target.value)} /></Field>
                        <Field label="Bio" className="col-span-2"><textarea rows={2} value={member.bio ?? ''} onChange={(e) => updateTeam(index, 'bio', e.target.value)} /></Field>
                      </div>
                      <SuggestionRow values={IMAGE_SUGGESTIONS} onPick={(val) => updateTeam(index, 'photo', val)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const Field = ({ label, children, className, compact }: { label: string; children: React.ReactNode; className?: string; compact?: boolean }) => (
  <div className={`field ${compact ? 'field-compact' : ''} ${className ?? ''}`.trim()}>
    <label>{label}</label>
    {children}
  </div>
);

const SuggestionRow = ({ label, values, onPick }: { label?: string; values: string[]; onPick: (value: string) => void }) => (
  <div className="suggestions">
    {label && <span className="suggestions-label">{label}</span>}
    <div className="chips">
      {values.map((value) => (
        <button key={value} type="button" className="chip" onClick={() => onPick(value)} title={value}>
          {value.length > 20 ? `...${value.slice(-15)}` : value}
        </button>
      ))}
    </div>
  </div>
);

export default AdminDashboard;