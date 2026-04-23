import React, { useState, useEffect } from 'react';
import Header from './Header';

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
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div id="hero" className="hero-container">
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
            <div className="hero-overlay"></div>
            <div className="hero-header-wrap">
                <Header />
            </div>
          
            <div className="hero-indicators">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                        aria-label={`Go to image ${index + 1}`}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default Hero;