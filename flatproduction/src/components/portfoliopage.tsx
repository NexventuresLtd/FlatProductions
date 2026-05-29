import React, { useEffect, useMemo, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { contentStore } from '../store/contentStore';

type PortfolioCard = {
    category: string;
    image?: string;
    label: string;
    title?: string;
    videoUrl?: string;
    btsUrl?: string;
};

const portfolioItems = [
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
    return text
        .trim()
        .split(/\s+/)
        .slice(0, 3)
        .join(' ');
}

const PortfolioPage: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [storedPortfolio, setStoredPortfolio] = useState(() => contentStore.read().portfolio);

    useEffect(() => {
        const onUpdate = (content: any) => {
            setStoredPortfolio(content.portfolio ?? []);
        };

        contentStore.onUpdate(onUpdate);
    }, []);

    const portfolioMedia = useMemo<PortfolioCard[]>(() => {
        return storedPortfolio.flatMap((item) => {
            const label = toThreeWords(item.description?.trim() || item.title);
            const entries: PortfolioCard[] = [];

            if (item.videoUrl) {
                entries.push({
                    category: 'Video',
                    videoUrl: item.videoUrl,
                    image: item.image,
                    label,
                    title: item.title,
                });
            }

            if (item.btsUrl) {
                entries.push({
                    category: 'BTS',
                    btsUrl: item.btsUrl,
                    image: item.image,
                    label: `Behind the scenes: ${label}`,
                    title: item.title,
                });
            }

            return entries;
        });
    }, [storedPortfolio]);

    const filteredItems = useMemo<PortfolioCard[]>(() => {
        const storedBtsItems = portfolioMedia.filter((item) => item.category === 'BTS');
        const staticBtsItems = portfolioItems.filter((item) => item.category === 'BTS');

        if (activeCategory === 'All') {
            return [...portfolioMedia, ...portfolioItems];
        }

        if (activeCategory === 'Video') {
            return portfolioMedia.filter((item) => item.category === 'Video');
        }

        if (activeCategory === 'BTS') {
            return [...storedBtsItems, ...staticBtsItems];
        }

        return portfolioItems.filter((item) => item.category === activeCategory);
    }, [activeCategory, portfolioMedia]);

    return (
        <div className="portfolio-page">
            {/* 
                CRITICAL STRUCTURAL FIX: 
                The Header Wrap is now a SIBLING to the Hero Section.
                This ensures the header has a higher stacking context (z-index)
                than the hero content, so the white background covers the text on scroll.
            */}
            <div className="portfoliopage-header-wrap">
                <Header />
            </div>

            <section className="portfoliopage-intro">
                <div className="portfoliopage-intro-content">
                    <p className="section-tag">Portfolio</p>
                    <h3>Selected work across our creative services</h3>
                    <p>
                        Choose a category to explore the matching visuals, or start with all projects and move through the full collection.
                    </p>
                </div>
            </section>

            <main className="portfoliopage-main">
                <div className="portfolio-filter-bar" role="tablist" aria-label="Portfolio categories">
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            className={`portfolio-filter-button ${activeCategory === category ? 'is-active' : ''}`}
                            onClick={() => setActiveCategory(category)}
                            aria-pressed={activeCategory === category}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="portfolio-grid" aria-live="polite">
                    {filteredItems.map((item) => (
                        <article key={`${item.category}-${item.label}`} className="portfolio-card">
                            {item.videoUrl || item.btsUrl ? (
                                <>
                                    <div className="portfolio-video-frame">
                                        <iframe
                                            src={toEmbedUrl(item.videoUrl ?? item.btsUrl ?? '')}
                                            title={item.label}
                                            loading="lazy"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        />
                                    </div>
                                    <div className="portfolio-card-copy">
                                        <span>{item.category}</span>
                                        <h2>{item.label}</h2>
                                        <div className="portfolio-card-actions">
                                            <a
                                                className="portfolio-card-button portfolio-card-button--primary"
                                                href={item.videoUrl ?? item.btsUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {item.category === 'BTS' ? 'Watch BTS' : 'Watch Video'}
                                            </a>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <img src={item.image} alt={`${item.category} project: ${item.label}`} />
                                    <div className="portfolio-card-copy">
                                        <span>{item.category}</span>
                                        <h2>{item.label}</h2>
                                    </div>
                                </>
                            )}
                        </article>
                    ))}
                </div>

                <div className="portfolio-cta">
                    <p>Need a visual direction for your next project? We can shape it from concept to delivery.</p>
                    <a className="portfolio-cta-button" href="/contact">
                        Start a Project
                    </a>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PortfolioPage;

function toEmbedUrl(url: string) {
    const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/i);

    if (!youtubeMatch) {
        return url;
    }

    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
}