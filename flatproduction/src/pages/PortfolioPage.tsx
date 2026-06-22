import React, { useEffect, useMemo, useState } from 'react';
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
};

const portfolioItems: PortfolioCard[] = [
    { category: 'Live Streaming', image: '/live1.jpeg', label: 'Launch night coverage' },
    { category: 'Live Streaming', image: '/photo6.jpg', label: 'Conference live feed' },
    { category: 'Live Streaming', image: '/photo14.jpg', label: 'Event stage stream' },
    { category: 'Photography', image: '/photo3.jpg', label: 'Portrait storytelling' },
    { category: 'Photography', image: '/photo8.jpg', label: 'Event highlights' },
    { category: 'Photography', image: '/photo10.jpg', label: 'Behind the scenes' },
    { category: 'BTS', image: '/2I1A0386.JPG.jpeg', label: 'Lighting setup and framing' },
    { category: 'BTS', image: '/2I1A0403.JPG.jpeg', label: 'Crew coordinating on set' },
    { category: 'BTS', image: '/2I1A0407.JPG.jpeg', label: 'Camera prep and review' },
    { category: 'BTS', image: '/2I1A0410.JPG.jpeg', label: 'Production day action' },
    { category: 'Web Design', image: '/web.jpg', label: 'Website interface design' },
    { category: 'Web Design', image: '/photo1.jpg', label: 'Digital brand presence' },
    { category: 'Graphics Design', image: '/graphy2.png', label: 'Identity system' },
    { category: 'Graphics Design', image: '/photo5.jpg', label: 'Campaign artwork' },
    { category: 'Documentary', image: '/photo12.jpg', label: 'Long-form story frame' },
    { category: 'Documentary', image: '/photo4.jpg', label: 'Field production moment' },
];

const categories = ['All', 'Video', 'BTS', 'Live Streaming', 'Photography', 'Web Design', 'Graphics Design', 'Documentary'];

function toThreeWords(text: string) {
    return text.trim().split(/\s+/).slice(0, 3).join(' ');
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

const PortfolioPage: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [storedPortfolio, setStoredPortfolio] = useState(() => contentStore.read().portfolio);
    const [heroData, setHeroData] = useState(() => contentStore.read().pageHeroes.portfolio);
    const [videoModal, setVideoModal] = useState<VideoModal | null>(null);
    const [imageModal, setImageModal] = useState<ImageModal | null>(null);

    useEffect(() => {
        contentStore.onUpdate((c: any) => {
            setStoredPortfolio(c.portfolio ?? []);
            if (c.pageHeroes?.portfolio) setHeroData(c.pageHeroes.portfolio);
        });
    }, []);

    // Lock body scroll when any modal is open
    useEffect(() => {
        document.body.style.overflow = (videoModal || imageModal) ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [videoModal, imageModal]);

    // ESC closes any open modal
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setVideoModal(null);
                setImageModal(null);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const openVideo = (url: string, label: string, category: string) =>
        setVideoModal({ embedUrl: toEmbedUrl(url), watchUrl: toWatchUrl(url), title: label, category });

    const openImage = (src: string, label: string, category: string) =>
        setImageModal({ src, label, category });

    const portfolioMedia = useMemo<PortfolioCard[]>(() => {
        return storedPortfolio.flatMap((item) => {
            const label = toThreeWords(item.description?.trim() || item.title);
            const entries: PortfolioCard[] = [];
            if (item.videoUrl) entries.push({ category: 'Video', videoUrl: item.videoUrl, image: item.image, label, title: item.title });
            if (item.btsUrl) entries.push({ category: 'BTS', btsUrl: item.btsUrl, image: item.image, label: `BTS: ${label}`, title: item.title });
            return entries;
        });
    }, [storedPortfolio]);

    const filteredItems = useMemo<PortfolioCard[]>(() => {
        const storedBts = portfolioMedia.filter(i => i.category === 'BTS');
        const staticBts = portfolioItems.filter(i => i.category === 'BTS');
        if (activeCategory === 'All') return [...portfolioMedia, ...portfolioItems];
        if (activeCategory === 'Video') return portfolioMedia.filter(i => i.category === 'Video');
        if (activeCategory === 'BTS') return [...storedBts, ...staticBts];
        return portfolioItems.filter(i => i.category === activeCategory);
    }, [activeCategory, portfolioMedia]);

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
                            <img src="/live1.jpeg" alt="" aria-hidden="true" className="w-full h-full object-cover opacity-60" />
                            <div className="absolute inset-0 bg-black/40" />
                        </div>
                        <div className="relative overflow-hidden">
                            <img src="/photo3.jpg" alt="" aria-hidden="true" className="w-full h-full object-cover opacity-60" />
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
                {/* Category filters */}
                <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Portfolio categories">
                    {categories.map((cat) => (
                        <button key={cat} type="button"
                            className={`px-4 py-2 rounded-full border text-sm font-semibold cursor-pointer transition-all ${activeCategory === cat ? 'bg-[#111] text-white border-[#111]' : 'border-[rgba(17,17,17,0.14)] bg-white text-[#111] hover:border-[#111]'}`}
                            onClick={() => setActiveCategory(cat)} aria-pressed={activeCategory === cat}
                        >{cat}</button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" aria-live="polite">
                    {filteredItems.map((item, idx) => {
                        const hasVideo = !!(item.videoUrl || item.btsUrl);
                        const videoSrc = item.videoUrl ?? item.btsUrl ?? '';
                        const imgSrc = item.image ?? '';

                        return (
                            <article key={`${item.category}-${item.label}-${idx}`} className="overflow-hidden rounded-2xl bg-[#f8f8f8] border border-[rgba(17,17,17,0.08)] transition-all hover:-translate-y-1 hover:shadow-xl group">
                                {hasVideo ? (
                                    /* ── Video card: thumbnail + play button ── */
                                    <>
                                        <div
                                            className="relative aspect-video bg-black cursor-pointer overflow-hidden"
                                            onClick={() => openVideo(videoSrc, item.label, item.category)}
                                            role="button" tabIndex={0}
                                            onKeyDown={e => e.key === 'Enter' && openVideo(videoSrc, item.label, item.category)}
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
                                            <div className="absolute top-3 left-3">
                                                <span className="bg-black/70 backdrop-blur-sm text-white text-[0.65rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">{item.category}</span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h2 className="text-[#111] font-bold text-sm leading-snug mb-3">{item.label}</h2>
                                            <button
                                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#111] text-white text-xs font-bold transition-all hover:bg-black cursor-pointer border-0 font-[inherit]"
                                                onClick={() => openVideo(videoSrc, item.label, item.category)}
                                            >
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                                                {item.category === 'BTS' ? 'Watch BTS' : 'Watch Video'}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    /* ── Image card: click to view full image ── */
                                    <>
                                        <div
                                            className="relative aspect-[4/3] overflow-hidden bg-[#eee] cursor-pointer"
                                            onClick={() => imgSrc && openImage(imgSrc, item.label, item.category)}
                                            role="button" tabIndex={0}
                                            onKeyDown={e => e.key === 'Enter' && imgSrc && openImage(imgSrc, item.label, item.category)}
                                            aria-label={`View ${item.label}`}
                                        >
                                            {imgSrc && (
                                                <img src={imgSrc} alt={`${item.category}: ${item.label}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            )}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-all duration-300 flex items-center justify-center">
                                                <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5">
                                                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <span className="bg-black/70 backdrop-blur-sm text-white text-[0.65rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">{item.category}</span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <span className="text-[#888] text-[0.7rem] font-bold uppercase tracking-widest mb-1 block">{item.category}</span>
                                            <h2 className="text-[#111] font-bold text-sm leading-snug">{item.label}</h2>
                                        </div>
                                    </>
                                )}
                            </article>
                        );
                    })}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-24 text-[#888]">
                        <p className="text-lg font-semibold">No items in this category yet.</p>
                    </div>
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
