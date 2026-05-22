import React, { useEffect, useMemo, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { contentStore } from '../store/contentStore';

type PortfolioCard = {
    category: string;
    image?: string;
    label: string;
    videoUrl?: string;
    description: string;
    link: string;
};

// Updated with one-sentence descriptions
const portfolioItems: PortfolioCard[] = [
    { 
        category: 'Live Streaming', 
        image: '/live1.jpeg', 
        label: 'Launch night coverage',
        link: '#',
        description: 'We captured the electric energy of the launch night with a high-definition multi-camera setup for a global audience.'
    },
    { 
        category: 'Live Streaming', 
        image: '/photo6.jpg', 
        label: 'Conference live feed',
        link: '#',
        description: 'We provided seamless live coverage for a major corporate conference with dynamic speaker switching and crystal clear audio.'
    },
    { 
        category: 'Live Streaming', 
        image: '/photo14.jpg', 
        label: 'Event stage stream',
        link: '#',
        description: 'We delivered a vibrant stage stream that brought the concert atmosphere directly to viewer screens with high-quality encoding.'
    },
    { 
        category: 'Photography', 
        image: '/photo3.jpg', 
        label: 'Portrait storytelling',
        link: '#',
        description: 'Our portrait sessions focus on bringing out the unique personality and story of every subject through natural lighting.'
    },
    { 
        category: 'Photography', 
        image: '/photo8.jpg', 
        label: 'Event highlights',
        link: '#',
        description: 'We document the key highlights of your events, from grand entrances to intimate interactions, to tell the complete story.'
    },
    { 
        category: 'Photography', 
        image: '/photo10.jpg', 
        label: 'Behind the scenes',
        link: '#',
        description: 'We capture the hustle and creativity behind the curtain to show the raw and honest human side of your brand.'
    },
    { 
        category: 'Web Design', 
        image: '/web.jpg', 
        label: 'Website interface design',
        link: '#',
        description: 'We designed a user-centric interface that prioritizes ease of navigation and visual appeal across all devices.'
    },
    { 
        category: 'Web Design', 
        image: '/photo1.jpg', 
        label: 'Digital brand presence',
        link: '#',
        description: 'We built a comprehensive digital ecosystem that aligns with your brand identity and strengthens your online recognition.'
    },
    { 
        category: 'Graphics Design', 
        image: '/graphy2.png', 
        label: 'Identity system',
        link: '#',
        description: 'We developed a complete visual identity system including logos, typography, and color palettes to ensure brand consistency.'
    },
    { 
        category: 'Graphics Design', 
        image: '/photo5.jpg', 
        label: 'Campaign artwork',
        link: '#',
        description: 'We created eye-catching artwork for marketing campaigns that blend bold imagery with strategic messaging to drive action.'
    },
    { 
        category: 'Documentary', 
        image: '/photo12.jpg', 
        label: 'Long-form story frame',
        link: '#',
        description: 'We produced compelling long-form documentaries that explore complex narratives with depth and sensitivity through authentic fieldwork.'
    },
    { 
        category: 'Documentary', 
        image: '/photo4.jpg', 
        label: 'Field production moment',
        link: '#',
        description: 'We documented real-time field production moments that highlight the challenges and triumphs of the subject through observation.'
    },
];

const categories = ['All', 'Video', 'Live Streaming', 'Photography', 'Web Design', 'Graphics Design', 'Documentary'];
const portfolioHeroImage = '/photo3.jpg';

function toOneSentence(text?: string): string {
    const value = (text || '').trim();

    if (!value) {
        return 'Watch this video production to see our cinematic approach in action.';
    }

    const firstSentenceMatch = value.match(/^(.+?[.!?])(?:\s|$)/);

    if (firstSentenceMatch) {
        return firstSentenceMatch[1].trim();
    }

    return `${value}.`;
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

    const portfolioVideos = useMemo<PortfolioCard[]>(() => {
        return storedPortfolio
            .filter((item) => item.videoUrl)
            .map((item) => ({
                category: 'Video',
                videoUrl: item.videoUrl ?? '',
                image: item.image,
                label: item.title,
                description: toOneSentence(item.description),
                link: item.link || '#',
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
    }, [activeCategory, portfolioVideos]);

    return (
        <div className="portfolio-page">
            <section
                className="portfoliopage-intro"
                style={{ '--portfolio-hero-image': `url(${portfolioHeroImage})` } as React.CSSProperties}
            >
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

                <div className="portfolio-grid gallery" aria-live="polite">
                    {filteredItems.map((item, index) => (
                        <article key={`${item.category}-${item.label}-${index}`} className="portfolio-card gallery-item">
                            <div className="gallery-media">
                                {item.videoUrl ? (
                                    <div className="gallery-video-frame">
                                        <iframe
                                            src={toEmbedUrl(item.videoUrl)}
                                            title={item.label}
                                            loading="lazy"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        />
                                    </div>
                                ) : (
                                    <img 
                                        src={item.image} 
                                        alt={`${item.category} project: ${item.label}`} 
                                        className="gallery-image"
                                        loading="lazy"
                                    />
                                )}
                                {item.videoUrl && (
                                    <div className="gallery-video-badge">YouTube</div>
                                )}
                            </div>

                            <div className="gallery-content">
                                <h3 className="gallery-title">{item.label}</h3>
                                <p className="gallery-description">
                                    {item.description}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="portfolio-cta gallery-actions">
                    <p>Need a visual direction for your next project? We can shape it from concept to delivery.</p>
                    <a className="view-all-button portfolio-cta-button" href="/contact">
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