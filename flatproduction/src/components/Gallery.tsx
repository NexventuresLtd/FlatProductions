import React, { useEffect, useState } from 'react';
import { contentStore, toOneSentence } from '../store/contentStore';

type GalleryPortfolioItem = {
    src: string;
    alt: string;
    title: string;
    videoUrl?: string;
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
            link: '/portfolio' // Updated link
        },
        { 
            src: '/photo3.jpg', 
            alt: 'Video Production', 
            title: 'Video Production', 
            description: 'We deliver high-end video production services tailored for commercials, events, and cinematic projects.',
            link: '/portfolio' // Updated link
        },
        { 
            src: '/live1.jpeg', 
            alt: 'Live Streaming', 
            title: 'Live Streaming', 
            description: 'We provide professional multi-camera live streaming solutions to connect you with a global audience instantly.',
            link: '/portfolio' // Updated link
        },
        { 
            src: '/web.jpg', 
            alt: 'Web & Digital', 
            title: 'Web & Digital', 
            description: 'We offer comprehensive digital strategies including web design, development, and online marketing solutions.',
            link: '/portfolio' // Updated link
        },
        { 
            src: '/graphy33.jpg', 
            alt: 'Branding', 
            title: 'Branding', 
            description: 'We create memorable brand identities that resonate deeply with your target market and stand out.',
            link: '/portfolio' // Updated link
        },
        { 
            src: '/photo12.jpg', 
            alt: 'Documentary', 
            title: 'Documentary', 
            description: 'We specialize in in-depth documentary filmmaking that brings important real-world stories to light.',
            link: '/portfolio' // Updated link
        }
    ];

    const [items, setItems] = useState<GalleryPortfolioItem[]>(() => {
        const p = contentStore.read().portfolio;
        return p && p.length ? p.map((it: any): GalleryPortfolioItem => ({ 
            src: it.image, 
            alt: it.title, 
            title: it.title, 
            videoUrl: it.videoUrl,
            description: toOneSentence(it.description || it.subtitle || ''),
            link: it.link || '/portfolio' // Updated fallback link
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
                    description: toOneSentence(it.description || it.subtitle || ''),
                    link: it.link || '/portfolio' // Updated fallback link
                })) : defaultItems);
        };
        contentStore.onUpdate(onUpdate);
    }, []);

    return (
        <div id="portfolio" className="gallery-section">
            <div className="gallery-header">
                <p className="section-tag">Portfolio</p>
                <h2>Our Services</h2>
                <p>
                    Six core services we provide — tap any card to learn more on the portfolio page.
                </p>
            </div>

            <div className="gallery">
                {items.map((item, index) => (
                    <div className="gallery-item" key={index}>
                        <div className={`gallery-media ${item.videoUrl ? 'gallery-media--video' : 'gallery-media--image'}`}>
                            {item.videoUrl ? (
                                <div className="gallery-video-frame">
                                    <iframe
                                        src={toEmbedUrl(item.videoUrl)}
                                        title={item.title}
                                        loading="lazy"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    />
                                </div>
                            ) : (
                                <img 
                                    src={item.src} 
                                    alt={item.alt} 
                                    className="gallery-image" 
                                    loading="lazy"
                                />
                            )}
                            {item.videoUrl && (
                                <div className="gallery-video-badge">YouTube</div>
                            )}
                        </div>

                        <div className="gallery-content">
                            <h3 className="gallery-title">{item.title}</h3>
                            <p className="gallery-description">
                                {item.description}
                            </p>
                            <div className="gallery-footer">
                                <a href={item.link} className="gallery-link" aria-label={`Learn more about ${item.title}`}>
                                    Learn More <span className="arrow">→</span>
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="gallery-actions">
                <a className="view-all-button" href="/portfolio" aria-label="Go to portfolio page">
                    Explore Our Work
                </a>
            </div>
        </div>
    );
};

export default Gallery;