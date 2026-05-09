import React, { useState, useEffect } from 'react';
import Header from './Header';
import { contentStore } from '../store/contentStore';

const Hero: React.FC = () => {
  // 1. Get initial data
  const initialHero = contentStore.read().hero;
  
  // 2. Safely set images. If undefined (old data), use the 5 defaults.
  const [images, setImages] = useState<string[]>(initialHero?.images || []);  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 3. Log to console (Check browser DevTools F12 to see this)
  useEffect(() => {
    console.log("Hero Images Loaded:", images);
  }, [images]);

  // 4. Subscribe to store updates
  useEffect(() => {
    const onUpdate = (c: any) => {
      const heroImages = c.hero?.images || [];
      console.log("Store Updated Images:", heroImages);
      setImages(heroImages);
      setCurrentImageIndex(0); 
    };
    contentStore.onUpdate(onUpdate);
  }, []);

  // 5. Slider Interval
  useEffect(() => {
    if (images.length === 0) {
      console.warn("No images found, slider stopped.");
      return; // Stop if array is empty
    }

    console.log("Starting slider with", images.length, "images.");
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // 4 seconds
    
    return () => clearInterval(interval);
  }, [images.length]); // Re-run if images array length changes

  // 6. Keyboard navigation
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

  // 7. Text Content
  const [heroText, setHeroText] = useState(() => initialHero || { title: '', subtitle: '' });
  const heroNotes = [
    'Photography. Video. Design.',
    'Live streaming for events and launches.',
    'Creative content built for brands.',
  ];

  useEffect(() => {
    const onUpdate = (c: any) => setHeroText(c.hero ?? { title: '', subtitle: '' });
    contentStore.onUpdate(onUpdate);
  }, []);

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
          <h1>{heroText.title}</h1>
          <p>{heroText.subtitle}</p>
          <ul className="hero-notes" aria-label="Flat Production highlights">
            {heroNotes.map((note) => (
              <li key={note} className="hero-note">
                  {note}
              </li>
            ))}
          </ul>
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