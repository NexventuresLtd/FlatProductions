import React, { useState, useEffect } from 'react';
import Header from './Header';
import { contentStore } from '../store/contentStore';

const Hero: React.FC = () => {
    const images = [
        '/photo12.jpg',
        '/photo6.jpg',
        '/photo3.jpg',
        '/photo10.jpg',
        '/photo5.jpg',
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        // Direct state update inside setInterval is more reliable
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4000); // Changes every 4 seconds
        
        return () => clearInterval(interval);
    }, [images.length]);

    // Keyboard navigation (Optional, but nice to have)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                setCurrentImageIndex((prev) => (prev + 1) % images.length);
            } else if (e.key === 'ArrowLeft') {
                setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [images.length]);

    const [heroText, setHeroText] = useState(() => contentStore.read().hero);

    useEffect(() => {
      const onUpdate = (c: any) => setHeroText(c.hero ?? { title: '', subtitle: '' });
      contentStore.onUpdate(onUpdate);
    }, []);

    return (
        <div id="hero" className="hero-container">
            {/* Background Images */}
            <div className="hero-images">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`hero-image ${index === currentImageIndex ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${image})` }}
                        aria-hidden="true"
                    />
                ))}
            </div>
            
            {/* Overlay - Darkens image slightly for contrast, but not too much since no text */}
            <div className="hero-overlay"></div>
            
            {/* Header */}
            <div className="hero-header-wrap">
                <Header />
            </div>
          
            {/* Hero text (from admin content) */}
            <div className="hero-text">
                <div className="hero-text-inner">
                    <h1>{heroText.title}</h1>
                    <p>{heroText.subtitle}</p>
                </div>
            </div>

            {/* Indicators (Dots) */}
            <div className="hero-indicators">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default Hero;