import React, { useEffect, useMemo, useRef, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { contentStore, GALLERY_CATEGORIES, DEFAULT_SITE_CONTENT, type GalleryItem } from '../store/contentStore';

/* ─── Google Drive / direct URL resolver ─────────────────────────
   Converts any Google Drive share link into a directly embeddable URL.
   Passes through all other URLs unchanged.                           */
function resolveImageUrl(url: string): string {
    if (!url) return url;
    if (!url.includes('drive.google.com') && !url.includes('docs.google.com')) return url;

    // /file/d/FILE_ID/view  or  /d/FILE_ID/
    const fileMatch = url.match(/\/d\/([a-zA-Z0-9_-]{10,})/);
    if (fileMatch) {
        return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=w1200`;
    }
    // ?id=FILE_ID  or  &id=FILE_ID
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
    if (idMatch) {
        return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1200`;
    }
    return url;
}

/* ─── Thumbnail card ─────────────────────────────────────────────── */
const GalleryThumb: React.FC<{ item: GalleryItem; onClick: () => void; priority?: boolean }> = ({ item, onClick, priority }) => (
    <div
        className="relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer group select-none bg-[#f0f0f0]"
        onClick={onClick}
        role="button" tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && onClick()}
        aria-label={`View ${item.category} photo`}
    >
        <img
            src={resolveImageUrl(item.src)}
            alt={item.category}
            loading={priority ? 'eager' : 'lazy'}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
        />
        {/* hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
        {/* expand icon */}
        <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
        </div>
        {/* bottom label */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pt-8 pb-3.5 bg-gradient-to-t from-black/65 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <span className="text-white text-[0.7rem] font-bold uppercase tracking-[0.15em]">{item.category}</span>
        </div>
    </div>
);

/* ─── Main page ──────────────────────────────────────────────────── */
const GalleryPage: React.FC = () => {
    const [gallery, setGallery] = useState<GalleryItem[]>(() => {
        const g = contentStore.read().gallery;
        return g.length ? g : DEFAULT_SITE_CONTENT.gallery;
    });
    const [heroData, setHeroData] = useState(() => contentStore.read().pageHeroes.gallery);
    const [activeCategory, setActiveCategory] = useState('All');
    const [lightbox, setLightbox] = useState<{ items: GalleryItem[]; index: number } | null>(null);

    useEffect(() => {
        return contentStore.onUpdate((c: any) => {
            const g: GalleryItem[] = c.gallery ?? [];
            setGallery(g.length ? g : DEFAULT_SITE_CONTENT.gallery);
            if (c.pageHeroes?.gallery) setHeroData(c.pageHeroes.gallery);
        });
    }, []);

    const visibleCategories = useMemo(() => {
        const present = new Set(gallery.map(g => g.category));
        return ['All', ...GALLERY_CATEGORIES.filter(c => present.has(c))];
    }, [gallery]);

    const countFor = (cat: string) =>
        cat === 'All' ? gallery.length : gallery.filter(g => g.category === cat).length;

    const displayed = useMemo(() =>
        activeCategory === 'All' ? gallery : gallery.filter(g => g.category === activeCategory),
    [gallery, activeCategory]);

    /* Sections map for "All" view */
    const sections = useMemo(() => {
        if (activeCategory !== 'All') return null;
        const map = new Map<string, GalleryItem[]>();
        GALLERY_CATEGORIES.forEach(cat => {
            const items = gallery.filter(g => g.category === cat);
            if (items.length) map.set(cat, items);
        });
        return map;
    }, [gallery, activeCategory]);

    /* Reset if active tab disappears */
    useEffect(() => {
        if (activeCategory !== 'All' && !visibleCategories.includes(activeCategory))
            setActiveCategory('All');
    }, [visibleCategories, activeCategory]);

    useEffect(() => { setLightbox(null); }, [activeCategory]);

    /* Scroll lock */
    useEffect(() => {
        document.body.style.overflow = lightbox ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [lightbox]);

    /* Keyboard nav */
    useEffect(() => {
        if (!lightbox) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLightbox(null);
            if (e.key === 'ArrowRight') setLightbox(lb => lb && lb.index < lb.items.length - 1 ? { ...lb, index: lb.index + 1 } : lb);
            if (e.key === 'ArrowLeft')  setLightbox(lb => lb && lb.index > 0 ? { ...lb, index: lb.index - 1 } : lb);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [lightbox]);

    const openLightbox = (items: GalleryItem[], index: number) => setLightbox({ items, index });
    const currentItem = lightbox ? lightbox.items[lightbox.index] : null;

    /* Thumbnail strip auto-scroll */
    const stripRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!lightbox || !stripRef.current) return;
        const el = stripRef.current.children[lightbox.index] as HTMLElement | undefined;
        el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }, [lightbox]);

    return (
        <div className="flex flex-col min-h-screen bg-white">

            {/* ── HERO ──────────────────────────────────────────────── */}
            <section
                className="relative min-h-[48vh] md:min-h-[55vh] bg-[#111] flex flex-col justify-end pb-12 overflow-hidden"
                style={{
                    backgroundImage: heroData.image ? `url('${resolveImageUrl(heroData.image)}')` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-black/60 to-black/30" />
                <div className="absolute top-0 left-0 right-0 z-[10]"><Header /></div>

                <div className="relative z-[2] max-w-[1400px] mx-auto px-5 sm:px-8 md:px-10 w-full">
                    <span className="inline-flex items-center gap-2.5 text-white/50 text-[0.65rem] font-bold uppercase tracking-[0.28em] mb-4">
                        <span className="w-5 h-px bg-white/30" />Gallery
                    </span>
                    <h1 className="text-white font-bold leading-[0.93] tracking-[-0.04em] text-[clamp(2.5rem,6vw,5rem)] mb-5 whitespace-pre-line">
                        {heroData.title || 'Captured\nMoments'}
                    </h1>
                    <div className="flex items-center gap-5 flex-wrap">
                        <div className="flex items-baseline gap-2">
                            <span className="text-white font-bold text-2xl">{gallery.length}</span>
                            <span className="text-white/45 text-sm">Photos</span>
                        </div>
                        <span className="w-px h-4 bg-white/20" />
                        <div className="flex items-baseline gap-2">
                            <span className="text-white font-bold text-2xl">{visibleCategories.length - 1}</span>
                            <span className="text-white/45 text-sm">Categories</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STICKY FILTER BAR ─────────────────────────────────── */}
            <div className="sticky top-0 z-[50] bg-white border-b border-[#e8e8e8] shadow-sm">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-10">
                    <div className="flex items-center gap-2 py-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {visibleCategories.map(cat => {
                            const isActive = activeCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold cursor-pointer border transition-all duration-200 ${
                                        isActive
                                            ? 'bg-[#111] text-white border-[#111] shadow-sm'
                                            : 'bg-white border-[rgba(17,17,17,0.12)] text-[#555] hover:border-[#111] hover:text-[#111]'
                                    }`}
                                >
                                    {cat}
                                    <span className={`text-[0.62rem] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center tabular-nums ${isActive ? 'bg-white/20 text-white' : 'bg-[#f0f0f0] text-[#888]'}`}>
                                        {countFor(cat)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── CONTENT ───────────────────────────────────────────── */}
            <main className="flex-1 bg-white">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-10 py-10 md:py-14 w-full">

                    {/* ── SECTIONS (All tab) ── */}
                    {sections ? (
                        <div className="flex flex-col gap-14 md:gap-20">
                            {[...sections.entries()].map(([cat, items], sIdx) => (
                                <section key={cat}>
                                    {/* Section header */}
                                    <div className="flex items-end justify-between gap-4 mb-6">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="text-[#bbb] text-[0.6rem] font-bold uppercase tracking-[0.28em] mb-1">
                                                    {String(sIdx + 1).padStart(2, '0')} · Photography
                                                </p>
                                                <h2 className="text-[#111] font-bold text-[clamp(1.3rem,2.5vw,1.9rem)] leading-none tracking-tight">
                                                    {cat}
                                                </h2>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 mb-0.5 flex-shrink-0">
                                            <span className="text-[#999] text-sm hidden sm:block">
                                                {items.length} {items.length === 1 ? 'photo' : 'photos'}
                                            </span>
                                            <button
                                                onClick={() => setActiveCategory(cat)}
                                                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-[#111] border border-[rgba(17,17,17,0.15)] hover:bg-[#111] hover:text-white hover:border-[#111] transition-all duration-200 cursor-pointer bg-white font-[inherit]"
                                            >
                                                View All
                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="w-full h-px bg-[#ebebeb] mb-6" />

                                    {/* Structured grid */}
                                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                                        {items.map((item, idx) => (
                                            <GalleryThumb
                                                key={`${item.src}-${idx}`}
                                                item={item}
                                                priority={idx < 4 && sIdx === 0}
                                                onClick={() => openLightbox(items, idx)}
                                            />
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    ) : (

                        /* ── SINGLE CATEGORY ── */
                        <>
                            <div className="flex items-center justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-[#111] font-bold text-[clamp(1.4rem,3vw,2rem)] leading-none tracking-tight">
                                        {activeCategory}
                                    </h2>
                                    <p className="text-[#999] text-sm mt-1.5">
                                        {displayed.length} {displayed.length === 1 ? 'photo' : 'photos'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setActiveCategory('All')}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-[#555] border border-[rgba(17,17,17,0.12)] hover:border-[#111] hover:text-[#111] transition-all cursor-pointer bg-white font-[inherit] flex-shrink-0"
                                >
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
                                    All categories
                                </button>
                            </div>

                            <div className="w-full h-px bg-[#ebebeb] mb-6" />

                            {displayed.length > 0 ? (
                                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                                    {displayed.map((item, idx) => (
                                        <GalleryThumb
                                            key={`${item.src}-${idx}`}
                                            item={item}
                                            priority={idx < 4}
                                            onClick={() => openLightbox(displayed, idx)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-28 border-2 border-dashed border-[#ebebeb] rounded-2xl">
                                    <div className="w-14 h-14 rounded-2xl border border-[#e5e5e5] flex items-center justify-center mx-auto mb-4">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                                            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
                                        </svg>
                                    </div>
                                    <p className="text-[#bbb] font-semibold text-base mb-1">No photos yet</p>
                                    <p className="text-[#ddd] text-sm">Add images in the admin dashboard</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <Footer />

            {/* ── LIGHTBOX ──────────────────────────────────────────── */}
            {lightbox && currentItem && (
                <div
                    className="fixed inset-0 z-[3000] bg-black/95 flex flex-col"
                    onClick={() => setLightbox(null)}
                    role="dialog" aria-modal="true"
                >
                    {/* Top bar */}
                    <div
                        className="flex items-center justify-between px-4 sm:px-6 py-4 flex-shrink-0"
                        onClick={e => e.stopPropagation()}
                    >
                        <div>
                            <p className="text-white/40 text-[0.62rem] font-bold uppercase tracking-[0.22em]">
                                {currentItem.category}
                            </p>
                            <p className="text-white font-semibold text-sm mt-0.5">
                                {lightbox.index + 1}
                                <span className="text-white/30"> / {lightbox.items.length}</span>
                            </p>
                        </div>
                        <button
                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer border-0 transition-all"
                            onClick={() => setLightbox(null)} aria-label="Close"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6 6 18M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    {/* Image */}
                    <div className="flex-1 flex items-center justify-center relative min-h-0 px-14 sm:px-20">
                        {/* Prev */}
                        <button
                            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer border-0 disabled:opacity-15 disabled:pointer-events-none transition-all z-10"
                            onClick={e => { e.stopPropagation(); setLightbox(lb => lb && lb.index > 0 ? { ...lb, index: lb.index - 1 } : lb); }}
                            disabled={lightbox.index === 0} aria-label="Previous"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
                        </button>

                        <div className="flex items-center justify-center w-full h-full" onClick={e => e.stopPropagation()}>
                            <img
                                key={currentItem.src}
                                src={resolveImageUrl(currentItem.src)}
                                alt={currentItem.category}
                                className="max-w-full object-contain rounded-xl shadow-2xl"
                                style={{ maxHeight: 'calc(100vh - 180px)' }}
                            />
                        </div>

                        {/* Next */}
                        <button
                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer border-0 disabled:opacity-15 disabled:pointer-events-none transition-all z-10"
                            onClick={e => { e.stopPropagation(); setLightbox(lb => lb && lb.index < lb.items.length - 1 ? { ...lb, index: lb.index + 1 } : lb); }}
                            disabled={lightbox.index === lightbox.items.length - 1} aria-label="Next"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                        </button>
                    </div>

                    {/* Thumbnail strip */}
                    <div className="flex-shrink-0 px-4 pb-5 pt-3" onClick={e => e.stopPropagation()}>
                        <div
                            ref={stripRef}
                            className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        >
                            {lightbox.items.map((item, idx) => (
                                <button
                                    key={`${item.src}-${idx}`}
                                    onClick={() => setLightbox(lb => lb ? { ...lb, index: idx } : lb)}
                                    className={`flex-shrink-0 w-14 h-10 sm:w-16 sm:h-11 rounded-lg overflow-hidden border-2 cursor-pointer p-0 transition-all duration-200 ${
                                        idx === lightbox.index
                                            ? 'border-white opacity-100 scale-110 shadow-lg'
                                            : 'border-transparent opacity-35 hover:opacity-65'
                                    }`}
                                    aria-label={`Go to photo ${idx + 1}`}
                                >
                                    <img src={resolveImageUrl(item.src)} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                        <p className="text-white/20 text-[0.6rem] text-center mt-2 hidden sm:block">
                            ← → navigate · ESC close
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryPage;
