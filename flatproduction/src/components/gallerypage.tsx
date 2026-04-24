import React from 'react';
import Header from './Header';
import Footer from './Footer';

const GalleryPage: React.FC = () => {
    const galleryImages = [
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
    ];

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
                <section className="gallerypage-section">
                    <div className="gallerypage-grid">
                        {galleryImages.map((image, index) => (
                            <div key={index} className="gallery-item-wrapper">
                                <img 
                                    src={image} 
                                    alt={`Gallery image ${index + 1}`} 
                                    loading="lazy" 
                                />
                                <div className="gallery-overlay"></div>
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