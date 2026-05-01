import React, { useEffect, useState } from 'react';
import { contentStore, type SiteContent, DEFAULT_SITE_CONTENT } from '../store/contentStore';
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

const EMPTY_SERVICE = (): ServiceItem => ({
  id: cryptoId(),
  title: 'New service',
  description: 'Describe the service here.',
  image: '/photo1.jpg',
});

const EMPTY_PORTFOLIO = (): PortfolioItem => ({
  id: cryptoId(),
  title: 'New portfolio item',
  image: '/photo1.jpg',
  videoUrl: '',
  description: '',
});

const EMPTY_TEAM = (): TeamItem => ({
  id: cryptoId(),
  name: 'Team member',
  role: 'Role',
  photo: '/kadaff.jpg',
  position: '50% 20%',
});

function cryptoId() {
  return `id-${Math.random().toString(36).slice(2, 9)}`;
}

function cloneContent(content: SiteContent): SiteContent {
  return {
    hero: { ...content.hero },
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
  if (toIndex < 0 || toIndex >= items.length) {
    return items;
  }

  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

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
    if (active === 'hero') {
      persist({ ...draft, hero: { ...DEFAULT_SITE_CONTENT.hero } });
      return;
    }

    if (active === 'about') {
      persist({ ...draft, about: { ...DEFAULT_SITE_CONTENT.about } });
      return;
    }

    if (active === 'services') {
      persist({ ...draft, services: DEFAULT_SITE_CONTENT.services.map((item) => ({ ...item })) });
      return;
    }

    if (active === 'portfolio') {
      persist({ ...draft, portfolio: DEFAULT_SITE_CONTENT.portfolio.map((item) => ({ ...item })) });
      return;
    }

    if (active === 'gallery') {
      persist({ ...draft, gallery: [...DEFAULT_SITE_CONTENT.gallery] });
      return;
    }

    if (active === 'clients') {
      persist({
        ...draft,
        clientsIntro: DEFAULT_SITE_CONTENT.clientsIntro,
        clients: [...DEFAULT_SITE_CONTENT.clients],
        clientLogos: [...DEFAULT_SITE_CONTENT.clientLogos],
      });
      return;
    }

    persist({ ...draft, team: DEFAULT_SITE_CONTENT.team.map((item) => ({ ...item })) });
  };

  const updateHero = (field: 'title' | 'subtitle', value: string) => {
    persist({ ...draft, hero: { ...draft.hero, [field]: value } });
  };

  const updateAbout = (field: 'heading' | 'body', value: string) => {
    persist({ ...draft, about: { ...draft.about, [field]: value } });
  };

  const updateService = (index: number, field: 'title' | 'description' | 'image', value: string) => {
    const services = draft.services.map((service, serviceIndex) =>
      serviceIndex === index ? { ...service, [field]: value } : service,
    );
    persist({ ...draft, services });
  };

  const addService = () => persist({ ...draft, services: [...draft.services, EMPTY_SERVICE()] });
  const moveService = (index: number, direction: -1 | 1) =>
    persist({ ...draft, services: moveItem(draft.services, index, index + direction) });
  const clearServices = () => persist({ ...draft, services: [] });
  const removeService = (index: number) => persist({ ...draft, services: draft.services.filter((_, i) => i !== index) });

  const updatePortfolio = (index: number, field: 'title' | 'image', value: string) => {
    const portfolio = draft.portfolio.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: value } : item,
    );
    persist({ ...draft, portfolio });
  };

  const updatePortfolioVideo = (index: number, value: string) => {
    const portfolio = draft.portfolio.map((item, itemIndex) =>
      itemIndex === index ? { ...item, videoUrl: value } : item,
    );
    persist({ ...draft, portfolio });
  };

  const updatePortfolioDescription = (index: number, value: string) => {
    const portfolio = draft.portfolio.map((item, itemIndex) =>
      itemIndex === index ? { ...item, description: value } : item,
    );
    persist({ ...draft, portfolio });
  };

  const addPortfolio = () => persist({ ...draft, portfolio: [...draft.portfolio, EMPTY_PORTFOLIO()] });
  const movePortfolio = (index: number, direction: -1 | 1) =>
    persist({ ...draft, portfolio: moveItem(draft.portfolio, index, index + direction) });
  const clearPortfolio = () => persist({ ...draft, portfolio: [] });
  const removePortfolio = (index: number) =>
    persist({ ...draft, portfolio: draft.portfolio.filter((_, i) => i !== index) });

  const updateGalleryImage = (index: number, value: string) => {
    const gallery = draft.gallery.map((image, imageIndex) => (imageIndex === index ? value : image));
    persist({ ...draft, gallery });
  };

  const addGalleryImage = () => persist({ ...draft, gallery: [...draft.gallery, '/photo1.jpg'] });
  const moveGalleryImage = (index: number, direction: -1 | 1) =>
    persist({ ...draft, gallery: moveItem(draft.gallery, index, index + direction) });
  const clearGallery = () => persist({ ...draft, gallery: [] });
  const removeGalleryImage = (index: number) =>
    persist({ ...draft, gallery: draft.gallery.filter((_, i) => i !== index) });

  const updateClientsIntro = (value: string) => persist({ ...draft, clientsIntro: value });

  const updateClient = (index: number, value: string) => {
    const clients = draft.clients.map((client, clientIndex) => (clientIndex === index ? value : client));
    persist({ ...draft, clients });
  };

  const addClient = () => persist({ ...draft, clients: [...draft.clients, 'New client category'] });
  const moveClient = (index: number, direction: -1 | 1) =>
    persist({ ...draft, clients: moveItem(draft.clients, index, index + direction) });
  const clearClients = () => persist({ ...draft, clients: [] });
  const removeClient = (index: number) => persist({ ...draft, clients: draft.clients.filter((_, i) => i !== index) });

  const updateClientLogo = (index: number, value: string) => {
    const clientLogos = draft.clientLogos.map((logo, logoIndex) => (logoIndex === index ? value : logo));
    persist({ ...draft, clientLogos });
  };

  const addClientLogo = () => persist({ ...draft, clientLogos: [...draft.clientLogos, '/clients.jpg'] });
  const moveClientLogo = (index: number, direction: -1 | 1) =>
    persist({ ...draft, clientLogos: moveItem(draft.clientLogos, index, index + direction) });
  const clearClientLogos = () => persist({ ...draft, clientLogos: [] });
  const removeClientLogo = (index: number) =>
    persist({ ...draft, clientLogos: draft.clientLogos.filter((_, i) => i !== index) });

  const updateTeam = (index: number, field: 'name' | 'role' | 'photo' | 'position', value: string) => {
    const team = draft.team.map((member, memberIndex) =>
      memberIndex === index ? { ...member, [field]: value } : member,
    );
    persist({ ...draft, team });
  };

  const addTeamMember = () => persist({ ...draft, team: [...draft.team, EMPTY_TEAM()] });
  const moveTeamMember = (index: number, direction: -1 | 1) =>
    persist({ ...draft, team: moveItem(draft.team, index, index + direction) });
  const clearTeam = () => persist({ ...draft, team: [] });
  const removeTeamMember = (index: number) => persist({ ...draft, team: draft.team.filter((_, i) => i !== index) });

  const logout = () => {
    sessionStorage.removeItem('flat_admin_auth');
    window.location.pathname = '/login';
  };

  const sectionTitle =
    active === 'hero'
      ? 'Hero'
      : active === 'about'
        ? 'About'
        : active === 'services'
          ? 'Services'
          : active === 'portfolio'
            ? 'Portfolio'
            : active === 'gallery'
              ? 'Gallery'
              : active === 'clients'
                ? 'Clients'
                : 'Team';

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-mark">FP</span>
          <div>
            <h1>Flat Productions</h1>
            <p>Admin Panel</p>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Admin sections">
          {(['hero', 'about', 'services', 'portfolio', 'gallery', 'clients', 'team'] as SectionKey[]).map((section) => (
            <button
              key={section}
              type="button"
              className={`admin-nav-item ${active === section ? 'active' : ''}`}
              onClick={() => setActive(section)}
            >
              {section}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button type="button" className="admin-secondary-button" onClick={logout}>
            Logout
          </button>
          <p>Live updates are saved instantly and reflected on the website.</p>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-eyebrow">Editing {sectionTitle}</p>
            <h2>Content editor</h2>
          </div>
          <div className="admin-topbar-actions">
            <span className="admin-status">Auto-save on change</span>
            <button type="button" className="admin-secondary-button" onClick={resetActiveSection}>
              Reset section
            </button>
          </div>
        </header>

        <section className="admin-panel">
          {active === 'hero' && (
            <div className="admin-form-grid">
              <Field label="Hero title">
                <input
                  type="text"
                  value={draft.hero.title}
                  onChange={(event) => updateHero('title', event.target.value)}
                />
              </Field>
              <Field label="Hero subtitle">
                <textarea
                  rows={5}
                  value={draft.hero.subtitle}
                  onChange={(event) => updateHero('subtitle', event.target.value)}
                />
              </Field>
            </div>
          )}

          {active === 'about' && (
            <div className="admin-form-grid">
              <Field label="About heading">
                <input
                  type="text"
                  value={draft.about.heading}
                  onChange={(event) => updateAbout('heading', event.target.value)}
                />
              </Field>
              <Field label="About body">
                <textarea
                  rows={7}
                  value={draft.about.body}
                  onChange={(event) => updateAbout('body', event.target.value)}
                />
              </Field>
            </div>
          )}

          {active === 'services' && (
            <div className="admin-section-stack">
              <div className="admin-section-actions">
                <p>All original home services are preloaded. You can edit, reorder, remove, or add more.</p>
                <div className="admin-section-actions-group">
                  <button type="button" className="admin-secondary-button" onClick={clearServices}>
                    Clear all
                  </button>
                  <button type="button" className="admin-primary-button" onClick={addService}>
                    + Add Service
                  </button>
                </div>
              </div>

              {draft.services.map((service, index) => (
                <article className="admin-item-card" key={service.id}>
                  <div className="admin-item-header">
                    <h3>Service {index + 1}</h3>
                    <div className="admin-item-header-actions">
                      <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={() => moveService(index, -1)}
                        disabled={index === 0}
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={() => moveService(index, 1)}
                        disabled={index === draft.services.length - 1}
                      >
                        Down
                      </button>
                      <button type="button" className="admin-danger-button" onClick={() => removeService(index)}>
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="admin-item-layout">
                    <div className="admin-item-preview admin-preview-tall">
                      <img src={service.image ?? '/photo1.jpg'} alt={service.title} />
                    </div>
                    <div className="admin-item-fields">
                      <div className="admin-form-grid admin-form-grid-3">
                        <Field label="Title">
                          <input
                            type="text"
                            value={service.title}
                            onChange={(event) => updateService(index, 'title', event.target.value)}
                          />
                        </Field>
                        <Field label="Image URL">
                          <input
                            type="text"
                            value={service.image ?? ''}
                            onChange={(event) => updateService(index, 'image', event.target.value)}
                            placeholder="/photo1.jpg"
                          />
                        </Field>
                        <Field label="Description" className="field-span-2">
                          <textarea
                            rows={4}
                            value={service.description}
                            onChange={(event) => updateService(index, 'description', event.target.value)}
                          />
                        </Field>
                      </div>
                      <SuggestionRow
                        label="Image helpers"
                        values={IMAGE_SUGGESTIONS}
                        onPick={(value) => updateService(index, 'image', value)}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {active === 'portfolio' && (
            <div className="admin-section-stack">
              <div className="admin-section-actions">
                <p>Portfolio cards support image and optional YouTube link.</p>
                <div className="admin-section-actions-group">
                  <button type="button" className="admin-secondary-button" onClick={clearPortfolio}>
                    Clear all
                  </button>
                  <button type="button" className="admin-primary-button" onClick={addPortfolio}>
                    + Add Portfolio Item
                  </button>
                </div>
              </div>

              {draft.portfolio.map((item, index) => (
                <article className="admin-item-card" key={item.id}>
                  <div className="admin-item-header">
                    <h3>Portfolio Item {index + 1}</h3>
                    <div className="admin-item-header-actions">
                      <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={() => movePortfolio(index, -1)}
                        disabled={index === 0}
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={() => movePortfolio(index, 1)}
                        disabled={index === draft.portfolio.length - 1}
                      >
                        Down
                      </button>
                      <button type="button" className="admin-danger-button" onClick={() => removePortfolio(index)}>
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="admin-item-layout">
                    <div className="admin-item-preview">
                      <img src={item.image ?? '/photo1.jpg'} alt={item.title} />
                    </div>
                    <div className="admin-item-fields">
                      <div className="admin-form-grid admin-form-grid-2">
                        <Field label="Title">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(event) => updatePortfolio(index, 'title', event.target.value)}
                          />
                        </Field>
                        <Field label="Image URL">
                          <input
                            type="text"
                            value={item.image ?? ''}
                            onChange={(event) => updatePortfolio(index, 'image', event.target.value)}
                            placeholder="/photo1.jpg"
                          />
                        </Field>
                        <Field label="YouTube video URL">
                          <input
                            type="text"
                            value={item.videoUrl ?? ''}
                            onChange={(event) => updatePortfolioVideo(index, event.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                          />
                        </Field>
                        <Field label="Short description" className="field-span-2">
                          <textarea
                            rows={4}
                            value={item.description ?? ''}
                            onChange={(event) => updatePortfolioDescription(index, event.target.value)}
                            placeholder="Describe the video or project."
                          />
                        </Field>
                      </div>
                      <SuggestionRow
                        label="Image helpers"
                        values={IMAGE_SUGGESTIONS}
                        onPick={(value) => updatePortfolio(index, 'image', value)}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {active === 'gallery' && (
            <div className="admin-section-stack">
              <div className="admin-section-actions">
                <p>Gallery images are used on the gallery page.</p>
                <div className="admin-section-actions-group">
                  <button type="button" className="admin-secondary-button" onClick={clearGallery}>
                    Clear all
                  </button>
                  <button type="button" className="admin-primary-button" onClick={addGalleryImage}>
                    + Add Gallery Image
                  </button>
                </div>
              </div>

              <div className="admin-list-grid">
                {draft.gallery.map((image, index) => (
                  <article className="admin-item-card admin-list-item" key={`${image}-${index}`}>
                    <div className="admin-item-header">
                      <h3>Image {index + 1}</h3>
                      <div className="admin-item-header-actions">
                        <button
                          type="button"
                          className="admin-secondary-button"
                          onClick={() => moveGalleryImage(index, -1)}
                          disabled={index === 0}
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          className="admin-secondary-button"
                          onClick={() => moveGalleryImage(index, 1)}
                          disabled={index === draft.gallery.length - 1}
                        >
                          Down
                        </button>
                        <button type="button" className="admin-danger-button" onClick={() => removeGalleryImage(index)}>
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="admin-item-preview admin-preview-square">
                      <img src={image} alt={`Gallery image ${index + 1}`} />
                    </div>
                    <Field label="Image URL">
                      <input
                        type="text"
                        value={image}
                        onChange={(event) => updateGalleryImage(index, event.target.value)}
                        placeholder="/photo1.jpg"
                      />
                    </Field>
                    <SuggestionRow
                      label="Image helpers"
                      values={IMAGE_SUGGESTIONS}
                      onPick={(value) => updateGalleryImage(index, value)}
                    />
                  </article>
                ))}
              </div>
            </div>
          )}

          {active === 'clients' && (
            <div className="admin-section-stack">
              <div className="admin-form-grid">
                <Field label="Clients intro text">
                  <textarea
                    rows={4}
                    value={draft.clientsIntro}
                    onChange={(event) => updateClientsIntro(event.target.value)}
                  />
                </Field>
              </div>

              <div className="admin-section-actions">
                <p>Client category tags for the pills section.</p>
                <div className="admin-section-actions-group">
                  <button type="button" className="admin-secondary-button" onClick={clearClients}>
                    Clear tags
                  </button>
                  <button type="button" className="admin-primary-button" onClick={addClient}>
                    + Add Client Tag
                  </button>
                </div>
              </div>

              <div className="admin-list-grid admin-list-grid-wide">
                {draft.clients.map((client, index) => (
                  <article className="admin-item-card admin-list-item" key={`${client}-${index}`}>
                    <div className="admin-item-header">
                      <h3>Tag {index + 1}</h3>
                      <div className="admin-item-header-actions">
                        <button
                          type="button"
                          className="admin-secondary-button"
                          onClick={() => moveClient(index, -1)}
                          disabled={index === 0}
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          className="admin-secondary-button"
                          onClick={() => moveClient(index, 1)}
                          disabled={index === draft.clients.length - 1}
                        >
                          Down
                        </button>
                        <button type="button" className="admin-danger-button" onClick={() => removeClient(index)}>
                          Remove
                        </button>
                      </div>
                    </div>
                    <Field label="Label">
                      <input
                        type="text"
                        value={client}
                        onChange={(event) => updateClient(index, event.target.value)}
                        placeholder="Corporate"
                      />
                    </Field>
                  </article>
                ))}
              </div>

              <div className="admin-section-actions">
                <p>Add and reorder client logo image URLs.</p>
                <div className="admin-section-actions-group">
                  <button type="button" className="admin-secondary-button" onClick={clearClientLogos}>
                    Clear logos
                  </button>
                  <button type="button" className="admin-primary-button" onClick={addClientLogo}>
                    + Add Client Logo
                  </button>
                </div>
              </div>

              <div className="admin-list-grid">
                {draft.clientLogos.map((logo, index) => (
                  <article className="admin-item-card admin-list-item" key={`${logo}-${index}`}>
                    <div className="admin-item-header">
                      <h3>Logo {index + 1}</h3>
                      <div className="admin-item-header-actions">
                        <button
                          type="button"
                          className="admin-secondary-button"
                          onClick={() => moveClientLogo(index, -1)}
                          disabled={index === 0}
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          className="admin-secondary-button"
                          onClick={() => moveClientLogo(index, 1)}
                          disabled={index === draft.clientLogos.length - 1}
                        >
                          Down
                        </button>
                        <button type="button" className="admin-danger-button" onClick={() => removeClientLogo(index)}>
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="admin-item-preview admin-preview-square">
                      <img src={logo} alt={`Client logo ${index + 1}`} />
                    </div>
                    <Field label="Logo URL">
                      <input
                        type="text"
                        value={logo}
                        onChange={(event) => updateClientLogo(index, event.target.value)}
                        placeholder="/clients.jpg"
                      />
                    </Field>
                    <SuggestionRow
                      label="Image helpers"
                      values={IMAGE_SUGGESTIONS}
                      onPick={(value) => updateClientLogo(index, value)}
                    />
                  </article>
                ))}
              </div>
            </div>
          )}

          {active === 'team' && (
            <div className="admin-section-stack">
              <div className="admin-section-actions">
                <p>Add team members with a name, role, and photo URL.</p>
                <div className="admin-section-actions-group">
                  <button type="button" className="admin-secondary-button" onClick={clearTeam}>
                    Clear all
                  </button>
                  <button type="button" className="admin-primary-button" onClick={addTeamMember}>
                    + Add Team Member
                  </button>
                </div>
              </div>

              {draft.team.map((member, index) => (
                <article className="admin-item-card" key={member.id}>
                  <div className="admin-item-header">
                    <h3>Team Member {index + 1}</h3>
                    <div className="admin-item-header-actions">
                      <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={() => moveTeamMember(index, -1)}
                        disabled={index === 0}
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={() => moveTeamMember(index, 1)}
                        disabled={index === draft.team.length - 1}
                      >
                        Down
                      </button>
                      <button type="button" className="admin-danger-button" onClick={() => removeTeamMember(index)}>
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="admin-item-layout">
                    <div className="admin-item-preview admin-preview-tall">
                      <img src={member.photo ?? '/kadaff.jpg'} alt={member.name} />
                    </div>
                    <div className="admin-item-fields">
                      <div className="admin-form-grid admin-form-grid-3">
                        <Field label="Name">
                          <input
                            type="text"
                            value={member.name}
                            onChange={(event) => updateTeam(index, 'name', event.target.value)}
                          />
                        </Field>
                        <Field label="Role">
                          <input
                            type="text"
                            value={member.role}
                            onChange={(event) => updateTeam(index, 'role', event.target.value)}
                          />
                        </Field>
                        <Field label="Photo URL">
                          <input
                            type="text"
                            value={member.photo ?? ''}
                            onChange={(event) => updateTeam(index, 'photo', event.target.value)}
                            placeholder="/kadaff.jpg"
                          />
                        </Field>
                      </div>
                      <SuggestionRow
                        label="Image helpers"
                        values={IMAGE_SUGGESTIONS}
                        onPick={(value) => updateTeam(index, 'photo', value)}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`admin-field ${className ?? ''}`.trim()}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function SuggestionRow({
  label,
  values,
  onPick,
}: {
  label: string;
  values: string[];
  onPick: (value: string) => void;
}) {
  return (
    <div className="admin-suggestions">
      <span>{label}</span>
      <div className="admin-suggestions-list">
        {values.map((value) => (
          <button key={value} type="button" className="admin-suggestion-button" onClick={() => onPick(value)}>
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
