import React, { useEffect, useState } from 'react';
import { contentStore, toOneSentence } from '../store/contentStore';

type GalleryPortfolioItem = {
    src: string;
    alt: string;
    title: string;
    videoUrl?: string;
    btsUrl?: string;
    description?: string;
    link?: string;
};

function toEmbedUrl(url: string) {
    const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/i);
    if (!youtubeMatch) {
        return url;
    }
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
}

const Gallery: React.FC = () => {
    const defaultItems: GalleryPortfolioItem[] = [
        {
            src: '/photo1.jpg',
            alt: 'Photography',
            title: 'Photography',
            description: 'We capture stunning visuals that tell your unique story with precision and artistic flair.',
            link: '/portfolio'
        },
        {
            src: '/photo3.jpg',
            alt: 'Video Production',
            title: 'Video Production',
            description: 'We deliver high-end video production services tailored for commercials, events, and cinematic projects.',
            link: '/portfolio'
        },
        {
            src: '/live1.jpeg',
            alt: 'Live Streaming',
            title: 'Live Streaming',
            description: 'We provide professional multi-camera live streaming solutions to connect you with a global audience instantly.',
            link: '/portfolio'
        },
        {
            src: '/web.jpg',
            alt: 'Web & Digital',
            title: 'Web & Digital',
            description: 'We offer comprehensive digital strategies including web design, development, and online marketing solutions.',
            link: '/portfolio'
        },
        {
            src: '/graphy33.jpg',
            alt: 'Branding',
            title: 'Branding',
            description: 'We create memorable brand identities that resonate deeply with your target market and stand out.',
            link: '/portfolio'
        },
        {
            src: '/photo12.jpg',
            alt: 'Documentary',
            title: 'Documentary',
            description: 'We specialize in in-depth documentary filmmaking that brings important real-world stories to light.',
            link: '/portfolio'
        },
        {
            src: '/2I1A0386.JPG.jpeg',
            alt: 'Behind the Scenes',
            title: 'Behind the Scenes',
            btsUrl: 'https://youtu.be/DHR85WBk4tY',
            description: 'Lighting, framing, and set preparation from the production floor.',
            link: '/portfolio'
        },
        {
            src: '/MARR0034.JPG',
            alt: 'Production BTS',
            title: 'Production BTS',
            btsUrl: 'https://youtu.be/zWTFpxzQaes',
            description: 'Candid crew moments captured during a live production setup.',
            link: '/portfolio'
        }
    ];

    const [items, setItems] = useState<GalleryPortfolioItem[]>(() => {
        const p = contentStore.read().portfolio;
        return p && p.length ? p.map((it: any): GalleryPortfolioItem => ({
            src: it.image,
            alt: it.title,
            title: it.title,
            videoUrl: it.videoUrl,
            btsUrl: it.btsUrl,
            description: toOneSentence(it.description || it.subtitle || ''),
            link: it.link || '/portfolio'
        })) : defaultItems;
    });

    useEffect(() => {
        const onUpdate = (c: any) => {
            const p = c.portfolio;
                setItems(p && p.length ? p.map((it: any): GalleryPortfolioItem => ({
                    src: it.image,
                    alt: it.title,
                    title: it.title,
                    videoUrl: it.videoUrl,
                    btsUrl: it.btsUrl,
                    description: toOneSentence(it.description || it.subtitle || ''),
                    link: it.link || '/portfolio'
                })) : defaultItems);
        };
        return contentStore.onUpdate(onUpdate);
    }, []);

    return (
        <div id="portfolio" className="py-[68px] px-5 bg-[#f5f5f5] text-[#111]">
            <div className="text-center mb-7 max-w-[760px] mx-auto">
                <p className="inline-block mb-4 px-4 py-1.5 rounded-full border border-[#111] bg-[#111] text-white uppercase tracking-[0.15em] text-[0.75rem] font-extrabold">Portfolio</p>
                <h2 className="text-[clamp(2.5rem,5vw,4rem)] mb-2.5 text-black font-bold leading-[1.1]">Our Services</h2>
                <p className="text-[#555] text-[1.1rem] leading-relaxed">
                    Tap any card to learn more on the portfolio page.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1400px] mx-auto">
                {items.map((item, index) => (
                    <div
                        className="relative bg-white rounded-[18px] overflow-hidden border border-[#e0e0e0] shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col h-full hover:-translate-y-1.5 hover:border-black hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)]"
                        key={index}
                    >
                        <div className="relative w-full aspect-video bg-[#eee] overflow-hidden">
                            <img
                                src={item.src}
                                alt={item.alt}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                            />
                            {(item.videoUrl || item.btsUrl) && (
                                <div className="absolute top-4 left-4 z-[4] px-2.5 py-1.5 rounded-full bg-white/95 text-black text-[0.7rem] font-bold tracking-[0.1em] uppercase shadow-md">
                                    {item.btsUrl && !item.videoUrl ? 'BTS' : 'Media'}
                                </div>
                            )}
                        </div>

                        <div className="px-3.5 pt-2 pb-3 flex flex-col flex-grow bg-white">
                            <h3 className="text-[1.05rem] font-bold text-[#111] mb-1">{item.title}</h3>
                            <p className="text-[#555] text-sm leading-relaxed flex-grow">
                                {item.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <div className="flex flex-wrap gap-2">
                                    <a
                                        href={item.link}
                                        className="text-[#111] text-sm font-semibold hover:opacity-70 transition-opacity"
                                        aria-label={`Learn more about ${item.title}`}
                                    >
                                        Learn More <span>→</span>
                                    </a>
                                    {item.videoUrl && (
                                        <a
                                            href={item.videoUrl}
                                            className="px-3 py-1.5 rounded-full bg-[#111] text-white text-xs font-bold hover:bg-black transition-colors"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Watch Video
                                        </a>
                                    )}
                                    {item.btsUrl && (
                                        <a
                                            href={item.btsUrl}
                                            className="px-3 py-1.5 rounded-full bg-transparent border border-[#111] text-[#111] text-xs font-bold hover:bg-[#111] hover:text-white transition-colors"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Behind the Scenes
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center mt-10">
                <a
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[rgba(17,17,17,0.08)] bg-[#e5e7eb] cursor-pointer transition-all hover:bg-[#d9dde3] hover:text-[#111] hover:-translate-y-0.5 hover:shadow-md font-medium text-sm"
                    href="/portfolio"
                    aria-label="Go to portfolio page"
                >
                    Explore Our Work
                </a>
            </div>
        </div>
        
    );
};

export default Gallery;
