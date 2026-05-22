import React, { useState, useEffect } from 'react';
import { Instagram, Youtube, Linkedin, X } from 'lucide-react';
import Header from './Header';
import { contentStore } from '../store/contentStore';

const Hero: React.FC = () => {
  const initialHero = contentStore.read().hero;

  const [images, setImages] = useState<string[]>(initialHero?.images || []);
  const [heroContent, setHeroContent] = useState(initialHero);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const onUpdate = (c: any) => {
      const nextHero = c.hero ?? initialHero;
      setHeroContent(nextHero);
      setImages(nextHero.images || []);
      setCurrentImageIndex(0);
    };
    contentStore.onUpdate(onUpdate);
  }, [initialHero]);

  useEffect(() => {
    if (images.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (images.length === 0) return;
      
      if (e.key === 'ArrowRight') {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length]);

  const heroNotes = heroContent.notes || [];
  const currentHeroNote = heroNotes[currentImageIndex] || heroContent.subtitle;

  return (
    <div id="hero" className="hero-container">
      {/* Background Images */}
      {images.length > 0 ? (
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
      ) : (
        // Fallback background if no images are added in Admin
        <div className="hero-images">
           <div 
             className="hero-image active" 
             style={{ backgroundImage: 'url(/photo12.jpg)' }} 
           />
        </div>
      )}
      
      <div className="hero-overlay"></div>
      
      <div className="hero-header-wrap">
        <Header />
      </div>
    
      <div className="hero-text">
        <div className="hero-text-inner">
          <span className="hero-kicker">Now playing</span>
          <p>{currentHeroNote}</p>
          <div className="hero-socials" aria-label="Social links">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="X">
              <X size={18} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
              <Youtube size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Indicators */}
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