import React, { useEffect, useMemo, useRef, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { contentStore } from '../store/contentStore';

type PortfolioCard = {
    category: string;
    image?: string;
    label: string;
    title?: string;
    videoUrl?: string;
    btsUrl?: string;
    serviceId?: string;
};

/* Static fallback — shown only when store portfolio is completely empty */
const STATIC_FALLBACK: PortfolioCard[] = [
    { category: 'Live Streaming',   image: '/live1.jpeg',           label: 'Launch night coverage' },
    { category: 'Live Streaming',   image: '/photo6.jpg',           label: 'Conference live feed' },
    { category: 'Live Streaming',   image: '/photo14.jpg',          label: 'Event stage stream' },
    { category: 'Photography',      image: '/photo3.jpg',           label: 'Portrait storytelling' },
    { category: 'Photography',      image: '/photo8.jpg',           label: 'Event highlights' },
    { category: 'Photography',      image: '/photo10.jpg',          label: 'Behind the scenes' },
    { category: 'BTS',              image: '/2I1A0386.JPG.jpeg',    label: 'Lighting setup and framing' },
    { category: 'BTS',              image: '/2I1A0403.JPG.jpeg',    label: 'Crew coordinating on set' },
    { category: 'BTS',              image: '/2I1A0407.JPG.jpeg',    label: 'Camera prep and review' },
    { category: 'BTS',              image: '/2I1A0410.JPG.jpeg',    label: 'Production day action' },
    { category: 'Web Design',       image: '/web.jpg',              label: 'Website interface design' },
    { category: 'Web Design',       image: '/photo1.jpg',           label: 'Digital brand presence' },
    { category: 'Graphics Design',  image: '/graphy2.png',          label: 'Identity system' },
    { category: 'Graphics Design',  image: '/photo5.jpg',           label: 'Campaign artwork' },
    { category: 'Documentary',      image: '/photo12.jpg',          label: 'Long-form story frame' },
    { category: 'Documentary',      image: '/photo4.jpg',           label: 'Field production moment' },
];

/* Reserved filter names — never used as an item category */
const RESERVED = new Set(['Video', 'BTS', 'video', 'image']);

function getItemCategory(item: { category?: string; title: string }): string {
    if (item.category && !RESERVED.has(item.category)) return item.category;
    /* legacy fallback: use title (default items have meaningful titles) */
    return item.title;
}

function toEmbedUrl(url: string): string {
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/i);
    if (!m) return url;
    return `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0`;
}

function toWatchUrl(url: string): string {
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/i);
    if (!m) return url;
    return `https://www.youtube.com/watch?v=${m[1]}`;
}

type VideoModal = { embedUrl: string; watchUrl: string; title: string; category: string };
type ImageModal = { src: string; label: string; category: string };

/* Match a service title to the best portfolio category tab.
   Handles all-caps titles and partial/prefix word matches (e.g. "WEBSITE DESIGN" → "Web & Digital"). */
function matchCategory(filter: string, categories: string[]): string {
    const f = filter.toLowerCase().trim();
    const avail = categories.filter(c => c !== 'All' && c !== 'Video' && c !== 'BTS');

    // 1. Exact (case-insensitive)
    const exact = avail.find(c => c.toLowerCase() === f);
    if (exact) return exact;

    // 2. Entire category name contained within the filter
    //    e.g. "photography" inside "photography & video production"
    const catInFilter = avail.find(c => f.includes(c.toLowerCase()));
    if (catInFilter) return catInFilter;

    // 3. Filter contained within category
    const filterInCat = avail.find(c => c.toLowerCase().includes(f));
    if (filterInCat) return filterInCat;

    // 4. Word-prefix matching — handles "WEBSITE DESIGN" → "Web & Digital"
    //    Split on spaces, &, -, commas; keep tokens ≥ 2 chars
    const filterWords = f.split(/[\s&\-,|/]+/).filter(w => w.length >= 2);
    const prefixMatch = avail.find(cat => {
        const catWords = cat.toLowerCase().split(/[\s&\-,|/]+/).filter(w => w.length >= 2);
        return catWords.some(cw =>
            filterWords.some(fw => fw.startsWith(cw) || cw.startsWith(fw))
        );
    });
    if (prefixMatch) return prefixMatch;

    return 'All';
}

/* ── Reusable card grid ──────────────────────────────────────────── */
type GridProps = {
    items: PortfolioCard[];
    displayCat: string;
    openVideo: (url: string, label: string, category: string) => void;
    openImage: (src: string, label: string, category: string) => void;
};

const PortfolioGrid: React.FC<GridProps> = ({ items, displayCat, openVideo, openImage }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item, idx) => {
            const hasVideo = !!(item.videoUrl || item.btsUrl);
            const imgSrc   = item.image ?? '';
            const cat      = displayCat === 'Video' ? 'Video'
                           : displayCat === 'BTS'   ? 'BTS'
                           : item.category;
            return (
                <article key={`${item.category}-${item.label}-${idx}`} className="overflow-hidden rounded-2xl bg-[#f8f8f8] border border-[rgba(17,17,17,0.08)] transition-all hover:-translate-y-1 hover:shadow-xl group">
                    {hasVideo ? (
                        <>
                            <div
                                className="relative aspect-video bg-black cursor-pointer overflow-hidden"
                                onClick={() => openVideo(item.videoUrl ?? item.btsUrl ?? '', item.label, cat)}
                                role="button" tabIndex={0}
                                onKeyDown={e => e.key === 'Enter' && openVideo(item.videoUrl ?? item.btsUrl ?? '', item.label, cat)}
                                aria-label={`Play ${item.label}`}
                            >
                                {imgSrc
                                    ? <img src={imgSrc} alt={item.label} className="w-full h-full object-cover opacity-80 group-hover:opacity-55 transition-opacity duration-300" />
                                    : <div className="w-full h-full bg-[#1a1a1a]" />
                                }
                                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/40 transition-all duration-300" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-14 h-14 rounded-full bg-white shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#111" className="ml-1"><polygon points="5,3 19,12 5,21"/></svg>
                                    </div>
                                </div>
                                <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                                    <span className="bg-black/70 backdrop-blur-sm text-white text-[0.65rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">{cat}</span>
                                    {item.videoUrl && item.btsUrl && (
                                        <span className="bg-white/20 backdrop-blur-sm text-white text-[0.65rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">Video + BTS</span>
                                    )}
                                </div>
                            </div>
                            <div className="p-4">
                                <h2 className="text-[#111] font-bold text-sm leading-snug mb-3">{item.label}</h2>
                                <div className="flex flex-wrap gap-2">
                                    {item.videoUrl && (
                                        <button
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#111] text-white text-xs font-bold transition-all hover:bg-black cursor-pointer border-0 font-[inherit]"
                                            onClick={() => openVideo(item.videoUrl!, item.label, cat)}
                                        >
                                            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                                            Main Video
                                        </button>
                                    )}
                                    {item.btsUrl && (
                                        <button
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[rgba(17,17,17,0.2)] text-[#333] text-xs font-bold transition-all hover:bg-[#111] hover:text-white hover:border-[#111] cursor-pointer bg-transparent font-[inherit]"
                                            onClick={() => openVideo(item.btsUrl!, `${item.label} — BTS`, cat)}
                                        >
                                            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                                            Behind The Scenes
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div
                                className="relative aspect-[4/3] overflow-hidden bg-[#eee] cursor-pointer"
                                onClick={() => imgSrc && openImage(imgSrc, item.label, cat)}
                                role="button" tabIndex={0}
                                onKeyDown={e => e.key === 'Enter' && imgSrc && openImage(imgSrc, item.label, cat)}
                                aria-label={`View ${item.label}`}
                            >
                                {imgSrc && (
                                    <img src={imgSrc} alt={`${cat}: ${item.label}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-all duration-300 flex items-center justify-center">
                                    <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5">
                                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                                        </svg>
                                    </div>
                                </div>
                                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="bg-black/70 backdrop-blur-sm text-white text-[0.65rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">{cat}</span>
                                </div>
                            </div>
                            <div className="p-4">
                                <span className="text-[#888] text-[0.7rem] font-bold uppercase tracking-widest mb-1 block">{cat}</span>
                                <h2 className="text-[#111] font-bold text-sm leading-snug">{item.label}</h2>
                            </div>
                        </>
                    )}
                </article>
            );
        })}
    </div>
);

const PortfolioPage: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [serviceIdFilter, setServiceIdFilter] = useState<string | null>(null);
    const [storedPortfolio, setStoredPortfolio] = useState(() => contentStore.read().portfolio);
    const [heroData, setHeroData] = useState(() => contentStore.read().pageHeroes.portfolio);
    const [videoModal, setVideoModal] = useState<VideoModal | null>(null);
    const [imageModal, setImageModal] = useState<ImageModal | null>(null);
    const filterApplied = useRef(false);

    useEffect(() => {
        return contentStore.onUpdate((c: any) => {
            setStoredPortfolio(c.portfolio ?? []);
            if (c.pageHeroes?.portfolio) setHeroData(c.pageHeroes.portfolio);
        });
    }, []);

    useEffect(() => {
        document.body.style.overflow = (videoModal || imageModal) ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [videoModal, imageModal]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { setVideoModal(null); setImageModal(null); }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const openVideo = (url: string, label: string, category: string) =>
        setVideoModal({ embedUrl: toEmbedUrl(url), watchUrl: toWatchUrl(url), title: label, category });

    const openImage = (src: string, label: string, category: string) =>
        setImageModal({ src, label, category });

    /* Build display cards from store — each item appears once.
       'Video' / 'BTS' filter tabs are derived from videoUrl / btsUrl presence. */
    const allCards = useMemo<PortfolioCard[]>(() => {
        if (!storedPortfolio.length) return STATIC_FALLBACK;
        return storedPortfolio.map(item => ({
            category:  getItemCategory(item),
            image:     item.image,
            label:     item.title,
            title:     item.title,
            videoUrl:  item.videoUrl || undefined,
            btsUrl:    item.btsUrl   || undefined,
            serviceId: item.serviceId || undefined,
        }));
    }, [storedPortfolio]);

    /* Dynamic category tabs: All → Video → BTS → alphabetical main cats */
    const categories = useMemo(() => {
        const hasVideo = allCards.some(c => !!c.videoUrl);
        const hasBts   = allCards.some(c => !!c.btsUrl);
        const mainCats = [...new Set(allCards.map(c => c.category))].sort();
        return ['All', ...(hasVideo ? ['Video'] : []), ...(hasBts ? ['BTS'] : []), ...mainCats];
    }, [allCards]);

    /* Count per tab */
    const countFor = (cat: string) => {
        if (cat === 'All')   return allCards.length;
        if (cat === 'Video') return allCards.filter(c => !!c.videoUrl).length;
        if (cat === 'BTS')   return allCards.filter(c => !!c.btsUrl).length;
        return allCards.filter(c => c.category === cat).length;
    };

    /* Sections map for "All" view — groups items by category */
    const portfolioSections = useMemo(() => {
        if (activeCategory !== 'All' || serviceIdFilter) return null;
        const mainCats = categories.filter(c => c !== 'All' && c !== 'Video' && c !== 'BTS');
        const map = new Map<string, PortfolioCard[]>();
        mainCats.forEach(cat => {
            const items = allCards.filter(c => c.category === cat);
            if (items.length) map.set(cat, items);
        });
        return map.size > 0 ? map : null;
    }, [activeCategory, allCards, serviceIdFilter, categories]);

    /* Apply URL filter params exactly once, after categories are ready.
       Prefers ?service= (serviceId exact match) over ?filter= (category fuzzy match). */
    useEffect(() => {
        if (filterApplied.current || categories.length <= 1) return;
        const params   = new URLSearchParams(window.location.search);
        const svcParam = params.get('service');
        const catParam = params.get('filter');

        if (svcParam) {
            /* Check if any card in the store is linked to this service */
            const hasLinkedItems = allCards.some(c => c.serviceId === svcParam);
            if (hasLinkedItems) {
                setServiceIdFilter(svcParam);
                filterApplied.current = true;
                return;
            }
        }
        /* Fallback: match service title to best category tab */
        if (catParam) {
            const matched = matchCategory(catParam, categories);
            setActiveCategory(matched);
        }
        filterApplied.current = true;
    }, [categories, allCards]);

    /* Reset active tab if it no longer exists after store update */
    useEffect(() => {
        if (activeCategory !== 'All' && !categories.includes(activeCategory)) {
            setActiveCategory('All');
        }
    }, [categories, activeCategory]);

    /* When serviceId filter is active, show all items linked to that service
       (regardless of category tab). Category tab clicks clear the service filter. */
    const filteredItems = useMemo<PortfolioCard[]>(() => {
        const base = serviceIdFilter
            ? allCards.filter(c => c.serviceId === serviceIdFilter)
            : allCards;
        if (!serviceIdFilter) {
            if (activeCategory === 'All')   return base;
            if (activeCategory === 'Video') return base.filter(c => !!c.videoUrl);
            if (activeCategory === 'BTS')   return base.filter(c => !!c.btsUrl);
            return base.filter(c => c.category === activeCategory);
        }
        return base;
    }, [activeCategory, allCards, serviceIdFilter]);

    /* First two stored images for hero accent panel */
    const accent1 = storedPortfolio[0]?.image || '/live1.jpeg';
    const accent2 = storedPortfolio[1]?.image || '/photo3.jpg';

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className="sticky top-0 w-full z-[100] bg-black">
                <Header />
            </div>

            {/* Hero with background image */}
            <section className="relative min-h-[58vh] flex items-end pb-14 bg-black overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-[center_30%] opacity-45" style={{ backgroundImage: `url('${heroData.image || '/photo14.jpg'}')` }} aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" aria-hidden="true" />
                {/* Side accent images */}
                <div className="absolute right-0 top-0 bottom-0 w-[38%] hidden lg:block overflow-hidden">
                    <div className="grid grid-rows-2 h-full gap-0.5">
                        <div className="relative overflow-hidden">
                            <img src={accent1} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-60" />
                            <div className="absolute inset-0 bg-black/40" />
                        </div>
                        <div className="relative overflow-hidden">
                            <img src={accent2} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-60" />
                            <div className="absolute inset-0 bg-black/40" />
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
                </div>
                <div className="relative z-[2] px-5 md:px-10 max-w-[760px]">
                    <p className="inline-block bg-white text-[#111] text-[0.7rem] font-bold uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full mb-5">Portfolio</p>
                    <h1 className="text-white font-bold text-[clamp(2rem,5vw,3.4rem)] leading-[1.08] tracking-tight mb-4">
                        {heroData.title || 'Selected work across our creative services'}
                    </h1>
                    <p className="text-white/60 text-base leading-relaxed max-w-[520px]">
                        Choose a category to explore the matching visuals, or browse the full collection.
                    </p>
                </div>
            </section>

            <main className="max-w-[1400px] mx-auto px-5 py-12 w-full">
                {/* Service filter banner — shown when arriving from a "View Our Work" link */}
                {serviceIdFilter && (
                    <div className="flex items-center justify-between gap-4 mb-5 px-5 py-3 rounded-xl bg-[#f0f0f0] border border-[rgba(17,17,17,0.1)]">
                        <span className="text-[#111] text-sm font-semibold">Showing work linked to this service</span>
                        <button
                            type="button"
                            className="text-[#888] text-xs font-bold hover:text-[#111] transition-colors cursor-pointer border-0 bg-transparent font-[inherit]"
                            onClick={() => { setServiceIdFilter(null); setActiveCategory('All'); }}
                        >
                            Clear filter ✕
                        </button>
                    </div>
                )}

                {/* Category filters */}
                <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Portfolio categories">
                    {categories.map((cat) => {
                        const isActive = !serviceIdFilter && activeCategory === cat;
                        return (
                            <button key={cat} type="button"
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold cursor-pointer transition-all ${isActive ? 'bg-[#111] text-white border-[#111]' : 'border-[rgba(17,17,17,0.14)] bg-white text-[#111] hover:border-[#111]'}`}
                                onClick={() => { setServiceIdFilter(null); setActiveCategory(cat); }}
                                aria-pressed={isActive}
                            >
                                {cat}
                                <span className={`text-[0.62rem] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center tabular-nums ${isActive ? 'bg-white/20 text-white' : 'bg-[#f0f0f0] text-[#888]'}`}>
                                    {countFor(cat)}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* ── Sectioned All view ── */}
                {portfolioSections ? (
                    <div className="flex flex-col gap-14 md:gap-20" aria-live="polite">
                        {[...portfolioSections.entries()].map(([cat, items], sIdx) => (
                            <section key={cat}>
                                <div className="flex items-end justify-between gap-4 mb-5">
                                    <div>
                                        <p className="text-[#bbb] text-[0.6rem] font-bold uppercase tracking-[0.28em] mb-1">
                                            {String(sIdx + 1).padStart(2, '0')}
                                        </p>
                                        <h2 className="text-[#111] font-bold text-[clamp(1.3rem,2.5vw,1.9rem)] leading-none tracking-tight">
                                            {cat}
                                        </h2>
                                    </div>
                                    <div className="flex items-center gap-3 mb-0.5 flex-shrink-0">
                                        <span className="text-[#999] text-sm hidden sm:block">
                                            {items.length} {items.length === 1 ? 'item' : 'items'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => { setServiceIdFilter(null); setActiveCategory(cat); }}
                                            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-[#111] border border-[rgba(17,17,17,0.15)] hover:bg-[#111] hover:text-white hover:border-[#111] transition-all duration-200 cursor-pointer bg-white font-[inherit]"
                                        >
                                            View All
                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="w-full h-px bg-[#ebebeb] mb-6" />
                                <PortfolioGrid items={items} displayCat={cat} openVideo={openVideo} openImage={openImage} />
                            </section>
                        ))}
                    </div>
                ) : (
                    /* ── Filtered / single-category flat grid ── */
                    <>
                        {filteredItems.length > 0 ? (
                            <div aria-live="polite">
                                <PortfolioGrid
                                    items={filteredItems}
                                    displayCat={activeCategory}
                                    openVideo={openVideo}
                                    openImage={openImage}
                                />
                            </div>
                        ) : (
                            <div className="text-center py-24 text-[#888]">
                                <p className="text-lg font-semibold">No items in this category yet.</p>
                            </div>
                        )}
                    </>
                )}

                <div className="mt-14 py-10 px-8 bg-[#f8f8f8] rounded-2xl border border-[rgba(17,17,17,0.08)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <p className="text-[#444] text-base max-w-prose">Need a visual direction for your next project? We can shape it from concept to delivery.</p>
                    <a href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[rgba(17,17,17,0.08)] bg-[#e5e7eb] text-[#111] text-sm font-semibold transition-all hover:bg-[#d9dde3] hover:-translate-y-0.5 hover:shadow-md flex-shrink-0">
                        Start a Project →
                    </a>
                </div>
            </main>

            <Footer />

            {/* ── Video Modal ── */}
            {videoModal && (
                <div
                    className="fixed inset-0 z-[3000] bg-black/95 flex items-center justify-center p-4 md:p-10"
                    onClick={() => setVideoModal(null)}
                    role="dialog" aria-modal="true" aria-label={videoModal.title}
                >
                    <div className="relative w-full max-w-4xl" onClick={e => e.stopPropagation()}>
                        <button
                            className="absolute -top-12 right-0 flex items-center gap-2 text-white/60 hover:text-white text-sm font-semibold transition-colors cursor-pointer border-0 bg-transparent font-[inherit] py-2"
                            onClick={() => setVideoModal(null)} aria-label="Close video"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                            Close (ESC)
                        </button>
                        <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
                            <iframe src={videoModal.embedUrl} title={videoModal.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen className="w-full h-full border-0"
                            />
                        </div>
                        <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                            <div>
                                <span className="text-white/45 text-xs font-bold uppercase tracking-widest">{videoModal.category}</span>
                                <p className="text-white font-semibold mt-0.5">{videoModal.title}</p>
                            </div>
                            <a href={videoModal.watchUrl} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ff0000] text-white text-sm font-bold hover:bg-[#cc0000] transition-colors"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                Watch on YouTube
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Image Modal ── */}
            {imageModal && (
                <div
                    className="fixed inset-0 z-[3000] bg-black/97 flex items-center justify-center p-4 md:p-10"
                    onClick={() => setImageModal(null)}
                    role="dialog" aria-modal="true" aria-label={imageModal.label}
                >
                    <div className="relative max-w-5xl w-full flex flex-col items-center gap-5" onClick={e => e.stopPropagation()}>
                        <button
                            className="absolute -top-12 right-0 flex items-center gap-2 text-white/60 hover:text-white text-sm font-semibold transition-colors cursor-pointer border-0 bg-transparent font-[inherit] py-2"
                            onClick={() => setImageModal(null)} aria-label="Close image"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                            Close (ESC)
                        </button>
                        <img
                            src={imageModal.src} alt={imageModal.label}
                            className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl"
                        />
                        <div className="text-center">
                            <span className="text-white/45 text-xs font-bold uppercase tracking-widest block mb-1">{imageModal.category}</span>
                            <p className="text-white font-semibold text-base">{imageModal.label}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PortfolioPage;
