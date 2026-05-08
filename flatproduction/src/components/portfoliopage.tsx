import React, { useEffect, useMemo, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { contentStore } from '../store/contentStore';

type PortfolioCard = {
    category: string;
    image?: string;
    label: string;
    videoUrl?: string;
};

const portfolioItems = [
    { category: 'Live Streaming', image: '/live1.jpeg', label: 'Launch night coverage' },
    { category: 'Live Streaming', image: '/photo6.jpg', label: 'Conference live feed' },
    { category: 'Live Streaming', image: '/photo14.jpg', label: 'Event stage stream' },
    { category: 'Photography', image: '/photo3.jpg', label: 'Portrait storytelling' },
    { category: 'Photography', image: '/photo8.jpg', label: 'Event highlights' },
    { category: 'Photography', image: '/photo10.jpg', label: 'Behind the scenes' },
    { category: 'Web Design', image: '/web.jpg', label: 'Website interface design' },
    { category: 'Web Design', image: '/photo1.jpg', label: 'Digital brand presence' },
    { category: 'Graphics Design', image: '/graphy2.png', label: 'Identity system' },
    { category: 'Graphics Design', image: '/photo5.jpg', label: 'Campaign artwork' },
    { category: 'Documentary', image: '/photo12.jpg', label: 'Long-form story frame' },
    { category: 'Documentary', image: '/photo4.jpg', label: 'Field production moment' },
];

const categories = ['All', 'Video', 'Live Streaming', 'Photography', 'Web Design', 'Graphics Design', 'Documentary'];

const PortfolioPage: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [storedPortfolio, setStoredPortfolio] = useState(() => contentStore.read().portfolio);

    useEffect(() => {
        const onUpdate = (content: any) => {
            setStoredPortfolio(content.portfolio ?? []);
        };

        contentStore.onUpdate(onUpdate);
    }, []);

    const portfolioVideos = useMemo<PortfolioCard[]>(() => {
        return storedPortfolio
            .filter((item) => item.videoUrl)
            .map((item) => ({
                category: 'Video',
                videoUrl: item.videoUrl ?? '',
                image: item.image,
                label: item.description?.trim() || item.title,
                title: item.title,
            }));
    }, [storedPortfolio]);

    const filteredItems = useMemo<PortfolioCard[]>(() => {
        if (activeCategory === 'All') {
            return [...portfolioVideos, ...portfolioItems];
        }

        if (activeCategory === 'Video') {
            return portfolioVideos;
        }

        return portfolioItems.filter((item) => item.category === activeCategory);
    }, [activeCategory]);

    return (
        <div className="portfolio-page">
            <section className="portfoliopage-intro">
                <div className="portfoliopage-header-wrap">
                    <Header />
                </div>
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
                            {item.videoUrl ? (
                                <>
                                    <div className="portfolio-video-frame">
                                        <iframe
                                            src={toEmbedUrl(item.videoUrl)}
                                            title={item.label}
                                            loading="lazy"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        />
                                    </div>
                                    <div className="portfolio-video-chip">YouTube</div>
                                </>
                            ) : (
                                <img src={item.image} alt={`${item.category} project: ${item.label}`} />
                            )}
                            <div className="portfolio-card-copy">
                                <span>{item.category}</span>
                                <h2>{item.label}</h2>
                            </div>
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