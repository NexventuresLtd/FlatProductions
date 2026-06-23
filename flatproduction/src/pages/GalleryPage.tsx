import React, { useEffect, useMemo, useRef, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { contentStore } from '../store/contentStore';

type GalleryItem = { src: string; title: string };

const galleryLabels: Record<string, string> = {
    photo1: 'Quiet Frame', photo2: 'Soft Portrait', photo3: 'Moving Scene',
    photo4: 'Event Moment', photo5: 'Bright Memory', photo6: 'Creative View',
    photo8: 'Story Detail', photo9: 'Scene Capture', photo10: 'Visual Moment',
    photo12: 'Simple Story', photo14: 'Special Moment', live1: 'Live Moment',
    live2: 'Live Frame', web: 'Web View', graphy33: 'Brand Look',
    iwacu1: 'Clean Frame', '2i1a0386': 'BTS Lighting Setup',
    '2i1a0403': 'BTS Crew Action', '2i1a0407': 'BTS Camera Prep',
    '2i1a0410': 'BTS Production Day', marr0034: 'BTS Shoot Moment',
    marr0039: 'BTS Field Frame', marr0058: 'BTS Set Detail',
};

const getTitle = (image: string, index: number): string => {
    const key = image.split('/').pop()?.split('.')[0]?.toLowerCase() ?? '';
    return galleryLabels[key] ?? `Image ${index + 1}`;
};

const defaultImages = [
    '/photo1.jpg', '/photo2.jpg', '/photo3.jpg', '/photo4.jpg',
    '/photo5.jpg', '/photo6.jpg', '/photo8.jpg', '/photo9.jpg',
    '/photo10.jpg', '/photo12.jpg', '/photo14.jpg', '/live1.jpeg',
    '/live2.jpeg', '/web.jpg', '/graphy33.jpg', '/iwacu1.jpg',
    '/2I1A0386.JPG.jpeg', '/2I1A0403.JPG.jpeg', '/2I1A0407.JPG.jpeg',
    '/2I1A0410.JPG.jpeg', '/MARR0034.JPG', '/MARR0039.JPG', '/MARR0058.JPG',
];

const ALL_CATEGORIES = ['All', 'BTS', 'Live', 'Photography', 'Web', 'Graphics', 'Documentary'];

const getCategory = (path: string): string => {
    const name = path.split('/').pop()?.split('.')[0]?.toLowerCase() ?? '';
    if (name.includes('2i1a') || name.includes('marr')) return 'BTS';
    if (/^live/.test(name)) return 'Live';
    if (name.includes('web')) return 'Web';
    if (name.startsWith('graphy')) return 'Graphics';
    return 'Photography';
};

const buildItems = (images: string[]): GalleryItem[] =>
    images.map((src, i) => ({ src, title: getTitle(src, i) }));

const GalleryPage: React.FC = () => {
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() =>
        buildItems(contentStore.read().gallery.length ? contentStore.read().gallery : defaultImages)
    );
    const [heroData, setHeroData] = useState(() => contentStore.read().pageHeroes.gallery);
    const [activeCategory, setActiveCategory] = useState('All');
    const [lightbox, setLightbox] = useState<number | null>(null);

    useEffect(() => {
        return contentStore.onUpdate((c: any) => {
            setGalleryItems(buildItems(c.gallery?.length ? c.gallery : defaultImages));
            if (c.pageHeroes?.gallery) setHeroData(c.pageHeroes.gallery);
        });
    }, []);

    /* Only show category tabs that have at least one image */
    const visibleCategories = useMemo(() => {
        const present = new Set(galleryItems.map(item => getCategory(item.src)));
        return ALL_CATEGORIES.filter(cat => cat === 'All' || present.has(cat));
    }, [galleryItems]);

    const displayedItems = useMemo(() => {
        if (activeCategory === 'All') return galleryItems;
        return galleryItems.filter(item => getCategory(item.src) === activeCategory);
    }, [galleryItems, activeCategory]);

    // If the active category is deleted/filtered out, fall back to 'All'
    useEffect(() => {
        if (activeCategory !== 'All' && !visibleCategories.includes(activeCategory)) {
            setActiveCategory('All');
        }
    }, [visibleCategories, activeCategory]);

    // Close lightbox when filter changes
    useEffect(() => { setLightbox(null); }, [activeCategory]);

    // Lock scroll when lightbox is open
    useEffect(() => {
        document.body.style.overflow = lightbox !== null ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [lightbox]);

    // Keyboard navigation
    const displayedRef = useRef(displayedItems);
    useEffect(() => { displayedRef.current = displayedItems; }, [displayedItems]);

    useEffect(() => {
        if (lightbox === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLightbox(null);
            if (e.key === 'ArrowRight') setLightbox(prev => prev !== null ? Math.min(prev + 1, displayedRef.current.length - 1) : null);
            if (e.key === 'ArrowLeft') setLightbox(prev => prev !== null ? Math.max(prev - 1, 0) : null);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [lightbox]);

    const currentItem = lightbox !== null ? displayedItems[lightbox] : null;

    return (
        <div className="flex flex-col min-h-screen bg-[#e5e7eb]">
            <section className="relative h-[40vh] min-h-[260px] bg-[#111] flex items-end pb-10 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url('${heroData.image || '/photo12.jpg'}')` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-black/50 to-transparent" />
                <div className="absolute top-0 left-0 right-0 z-[10]">
                    <Header />
                </div>
                <div className="relative z-[2] px-6 md:px-10">
                    <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] mb-2">Our Work</p>
                    <p className="text-white font-bold text-[clamp(2rem,5vw,3.5rem)] tracking-tight">{heroData.title || 'Captured Moments'}</p>
                </div>
            </section>

            <main className="max-w-[1400px] mx-auto px-5 py-10 w-full">
                {/* Filter tabs — only categories present in the current gallery */}
                <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Gallery categories">
                    {visibleCategories.map(cat => (
                        <button key={cat} type="button"
                            className={`px-4 py-2 rounded-full border text-sm font-semibold cursor-pointer transition-all ${activeCategory === cat ? 'bg-[#111] text-white border-[#111]' : 'border-[rgba(17,17,17,0.14)] bg-white text-[#111] hover:border-[#111]'}`}
                            onClick={() => setActiveCategory(cat)} aria-pressed={activeCategory === cat}
                        >{cat}</button>
                    ))}
                </div>

                {/* Count */}
                <p className="text-[#666] text-sm mb-5 font-medium">{displayedItems.length} image{displayedItems.length !== 1 ? 's' : ''}</p>

                {/* Masonry grid */}
                <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
                    {displayedItems.map((item, index) => (
                        <div
                            key={`${item.src}-${index}`}
                            className="relative overflow-hidden rounded-xl break-inside-avoid cursor-pointer group"
                            onClick={() => setLightbox(index)}
                            role="button" tabIndex={0}
                            onKeyDown={e => e.key === 'Enter' && setLightbox(index)}
                            aria-label={`View ${item.title}`}
                        >
                            <img
                                src={item.src} alt={item.title} loading="lazy"
                                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <span className="text-white text-xs font-semibold uppercase tracking-wide drop-shadow">{item.title}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />

            {/* Lightbox */}
            {lightbox !== null && currentItem && (
                <div
                    className="fixed inset-0 z-[3000] bg-black/97 flex items-center justify-center"
                    onClick={() => setLightbox(null)}
                    role="dialog" aria-modal="true" aria-label={currentItem.title}
                >
                    {/* Close */}
                    <button
                        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border-0 z-10"
                        onClick={() => setLightbox(null)} aria-label="Close"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>

                    {/* Prev */}
                    <button
                        className="absolute left-4 md:left-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer border-0 z-10 disabled:opacity-20 disabled:pointer-events-none"
                        onClick={e => { e.stopPropagation(); setLightbox(prev => prev !== null ? Math.max(prev - 1, 0) : null); }}
                        disabled={lightbox === 0} aria-label="Previous image"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                    </button>

                    {/* Image */}
                    <div className="px-16 md:px-24 max-h-screen flex flex-col items-center gap-4" onClick={e => e.stopPropagation()}>
                        <img
                            key={currentItem.src}
                            src={currentItem.src} alt={currentItem.title}
                            className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
                        />
                        <div className="text-center">
                            <p className="text-white font-semibold text-base">{currentItem.title}</p>
                            <p className="text-white/50 text-sm mt-0.5">{lightbox + 1} / {displayedItems.length}</p>
                        </div>
                    </div>

                    {/* Next */}
                    <button
                        className="absolute right-4 md:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer border-0 z-10 disabled:opacity-20 disabled:pointer-events-none"
                        onClick={e => { e.stopPropagation(); setLightbox(prev => prev !== null ? Math.min(prev + 1, displayedItems.length - 1) : null); }}
                        disabled={lightbox === displayedItems.length - 1} aria-label="Next image"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                    </button>

                    {/* Keyboard hint */}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 text-white/30 text-xs">
                        <span>← → navigate</span>
                        <span>·</span>
                        <span>ESC close</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryPage;
