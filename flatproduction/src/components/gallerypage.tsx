import React, { useEffect, useMemo, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { contentStore } from '../store/contentStore';

type GalleryItem = {
    src: string;
    title: string;
};

const galleryLabels: Record<string, string> = {
    photo1: 'quiet frame',
    photo2: 'soft portrait',
    photo3: 'moving scene',
    photo4: 'event moment',
    photo5: 'bright memory',
    photo6: 'creative view',
    photo8: 'story detail',
    photo9: 'scene capture',
    photo10: 'visual moment',
    photo12: 'simple story',
    photo14: 'special moment',
    live1: 'live moment',
    live2: 'live frame',
    web: 'web view',
    graphy33: 'brand look',
    iwacu1: 'clean frame',
};

const getGalleryTitle = (image: string, index: number): string => {
    const fileName = image.split('/').pop()?.split('.')[0]?.toLowerCase() ?? '';
    return galleryLabels[fileName] ?? `image ${index + 1}`;
};

const GalleryPage: React.FC = () => {
    const defaultImages = [
        '/photo1.jpg',
        '/photo2.jpg',
        '/photo3.jpg',
        '/photo4.jpg',
        '/photo5.jpg',
        '/photo6.jpg',
        '/photo8.jpg',
        '/photo9.jpg',
        '/photo10.jpg',
        '/photo12.jpg',
        '/photo14.jpg',
        '/live1.jpeg',
        '/live2.jpeg',
        '/web.jpg',
        '/graphy33.jpg',
        '/iwacu1.jpg',
    ];

const categories = ['All', 'Live', 'Photography', 'Web', 'Graphics', 'Documentary'];

const getCategoryFromFile = (path: string): string => {
    const name = path.split('/').pop()?.split('.')[0]?.toLowerCase() ?? '';
    if (/^live/.test(name)) return 'Live';
    if (name.includes('web')) return 'Web';
    if (/^photo/.test(name)) return 'Photography';
    if (name.startsWith('graphy') || name.includes('graphy')) return 'Graphics';
    if (name.includes('iwacu') || name.includes('onekelly')) return 'Photography';
    return 'Photography';
};

const buildGalleryItems = (images: string[]): GalleryItem[] => images.map((image, index) => ({
    src: image,
    title: getGalleryTitle(image, index),
}));

const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => buildGalleryItems(contentStore.read().gallery.length ? contentStore.read().gallery : defaultImages));

useEffect(() => {
    const onUpdate = (c: any) => setGalleryItems(buildGalleryItems((c.gallery && c.gallery.length) ? c.gallery : defaultImages));
    contentStore.onUpdate(onUpdate);
}, []);

const [activeCategory, setActiveCategory] = useState<string>('All');

const displayedItems = useMemo(() => {
    if (activeCategory === 'All') return galleryItems;
    return galleryItems.filter(item => getCategoryFromFile(item.src) === activeCategory);
}, [galleryItems, activeCategory]);

    return (
        <div className="gallery-page">
            <section className="gallerypage-hero">
                <div className="gallerypage-header-wrap">
                    <Header />
                </div>
                <div className="gallerypage-hero-content">
                    <p>Captured Moments</p>
                </div>
            </section>

            <main className="gallerypage-main">
                <div className="portfolio-filter-bar" style={{ marginBottom: 24 }} role="tablist" aria-label="Gallery categories">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            type="button"
                            className={`portfolio-filter-button ${activeCategory === cat ? 'is-active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                            aria-pressed={activeCategory === cat}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <section className="gallerypage-section">
                    <div className="gallerypage-grid">
                        {displayedItems.map((item, index) => (
                            <div key={`${item.src}-${index}`} className="gallery-item-wrapper">
                                <img
                                    src={item.src}
                                    alt={item.title}
                                    loading="lazy"
                                />
                                <div className="gallery-overlay"></div>
                                <div className="gallerypage-caption">
                                    <span>{item.title}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default GalleryPage;