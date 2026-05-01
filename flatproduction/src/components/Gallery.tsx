import React, { useEffect, useState } from 'react';
import { contentStore } from '../store/contentStore';

type GalleryPortfolioItem = {
    src: string;
    alt: string;
    title: string;
    videoUrl?: string;
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
        { src: '/photo1.jpg', alt: 'Photography', title: 'Photography' },
        { src: '/photo3.jpg', alt: 'Video Production', title: 'Video Production' },
        { src: '/live1.jpeg', alt: 'Live Streaming', title: 'Live Streaming' },
        { src: '/web.jpg', alt: 'Web & Digital', title: 'Web & Digital' },
        { src: '/graphy33.jpg', alt: 'Branding', title: 'Branding' },
        { src: '/photo12.jpg', alt: 'Documentary', title: 'Documentary' },
    ];

        const [items, setItems] = useState<GalleryPortfolioItem[]>(() => {
      const p = contentStore.read().portfolio;
            return p && p.length ? p.map((it:any): GalleryPortfolioItem => ({ src: it.image, alt: it.title, title: it.title, videoUrl: it.videoUrl })) : defaultItems;
    });

    useEffect(()=>{
      const onUpdate = (c:any) => {
        const p = c.portfolio;
                setItems(p && p.length ? p.map((it:any): GalleryPortfolioItem => ({ src: it.image, alt: it.title, title: it.title, videoUrl: it.videoUrl })) : defaultItems);
      };
      contentStore.onUpdate(onUpdate);
    },[]);

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
                    <div className="gallery-item" key={index} role="button" aria-label={item.title}>
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
                            <img src={item.src} alt={item.alt} className="gallery-image" />
                        )}
                        <div className="gallery-overlay"></div>
                        {item.videoUrl ? <div className="gallery-video-badge">YouTube</div> : null}
                        <div className="gallery-label">
                            <span className="gallery-service">{item.title}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="gallery-actions">
                <a className="view-all-button" href="/portfolio" aria-label="Go to portfolio page">
                    View Full Portfolio
                </a>
            </div>
        </div>
    );
};

export default Gallery;