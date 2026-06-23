import React, { useState, useEffect, useCallback } from 'react';
import { Instagram, Youtube, Linkedin, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from './Header';
import { contentStore } from '../store/contentStore';

const Hero: React.FC = () => {
  const initialHero = contentStore.read().hero;

  const [images, setImages] = useState<string[]>(initialHero?.images || []);
  const [heroContent, setHeroContent] = useState(initialHero);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    return contentStore.onUpdate((c: any) => {
      if (!c.hero) return;
      setHeroContent(c.hero);
      setImages(c.hero.images || []);
      setCurrentImageIndex(0);
    });
  }, []);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentImageIndex(index);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning]);

  const goNext = useCallback(() => {
    if (images.length === 0) return;
    goTo((currentImageIndex + 1) % images.length);
  }, [images.length, currentImageIndex, goTo]);

  const goPrev = useCallback(() => {
    if (images.length === 0) return;
    goTo((currentImageIndex - 1 + images.length) % images.length);
  }, [images.length, currentImageIndex, goTo]);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(goNext, 5000);
    return () => clearInterval(interval);
  }, [images.length, goNext]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (images.length === 0) return;
      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, goNext, goPrev]);

  const heroNotes = heroContent.notes || [];
  const currentHeroNote = heroNotes[currentImageIndex] || heroContent.subtitle;
  const totalSlides = images.length;
  const slideNumber = String(currentImageIndex + 1).padStart(2, '0');
  const totalNumber = String(totalSlides).padStart(2, '0');

  const displayImages = images.length > 0 ? images : ['/photo12.jpg'];

  return (
    <div id="hero" className="relative w-full h-screen min-h-[600px] bg-black overflow-hidden flex flex-col">

      {/* Background slideshow */}
      <div className="absolute inset-0 z-0">
        {displayImages.map((image, index) => (
          <div
            key={index}
            className={`hero-image ${index === currentImageIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Layered overlays for depth */}
      <div className="absolute inset-0 z-[1] bg-black/50" />
      <div className="absolute inset-0 z-[2] bg-[linear-gradient(to_right,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.1)_50%,transparent_100%)]" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[10]">
        <Header />
      </div>

      {/* Left edge — slide counter + vertical label */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-[5] flex flex-col items-center gap-4 max-sm:hidden">
        <div className="flex flex-col items-center gap-1">
          <span className="text-white text-2xl font-bold leading-none">{slideNumber}</span>
          <span className="block w-px h-8 bg-white/40" />
          <span className="text-white/50 text-sm font-medium">{totalNumber}</span>
        </div>
        <span className="writing-vertical text-white/50 text-[0.65rem] font-bold tracking-[0.2em] uppercase mt-2 max-sm:hidden">Flat Production Studio</span>
      </div>

      {/* Center content — main headline */}
      <div className="absolute inset-0 z-[5] flex items-center">
        <div className="pl-[80px] pr-[60px] pb-[80px] max-w-[700px] max-sm:pl-16 max-sm:pb-[100px]">
          <span className="inline-flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.2em] uppercase text-white/70 mb-4">
            Now playing
          </span>
          <h1 className="text-white font-bold whitespace-pre-line leading-[0.96] tracking-[-0.04em] text-[clamp(3rem,7vw,6rem)] mb-4">{heroContent.title || 'We Frame\nYour Story'}</h1>
          <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-[360px] max-sm:hidden">{currentHeroNote}</p>
          <div className="flex gap-3 flex-wrap max-sm:flex-col max-sm:items-start max-sm:gap-[10px]">
            <a href="/portfolio" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-sm font-bold tracking-wide hover:bg-white/90 transition-colors">
              View Our Work
            </a>
            <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 text-white text-sm font-bold tracking-wide hover:border-white hover:bg-white/10 transition-all">
              Book a Project
            </a>
          </div>
        </div>
      </div>

      {/* Right edge — socials */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-[5] max-sm:hidden">
        <div className="flex flex-col gap-4" aria-label="Social links">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 text-white/60 hover:border-white hover:text-white hover:bg-white/10 transition-all" aria-label="Instagram">
            <Instagram size={16} />
          </a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 text-white/60 hover:border-white hover:text-white hover:bg-white/10 transition-all" aria-label="X">
            <X size={16} />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 text-white/60 hover:border-white hover:text-white hover:bg-white/10 transition-all" aria-label="YouTube">
            <Youtube size={16} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 text-white/60 hover:border-white hover:text-white hover:bg-white/10 transition-all" aria-label="LinkedIn">
            <Linkedin size={16} />
          </a>
        </div>
      </div>

      {/* Bottom bar — indicators + arrows */}
      <div className="absolute bottom-0 left-0 right-0 z-[5] flex items-center gap-6 px-[80px] pb-8 max-sm:px-4 max-sm:pb-5 max-sm:pl-16">
        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {displayImages.map((_, index) => (
            <button
              key={index}
              className={`rounded-full bg-white/30 transition-all duration-300 cursor-pointer border-0 p-0 ${index === currentImageIndex ? 'bg-white w-1 h-7' : 'w-1 h-4'}`}
              onClick={() => goTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="flex-1 h-px bg-white/20 relative max-sm:hidden">
          <div
            className="absolute inset-y-0 left-0 bg-white transition-[width] duration-700"
            style={{ width: `${((currentImageIndex + 1) / displayImages.length) * 100}%` }}
          />
        </div>

        {/* Arrow controls */}
        <div className="flex items-center gap-2">
          <button
            className="flex items-center justify-center w-9 h-9 rounded-full border border-white/20 text-white bg-transparent hover:bg-white hover:text-black transition-all cursor-pointer"
            onClick={goPrev}
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="flex items-center justify-center w-9 h-9 rounded-full border border-white/20 text-white bg-transparent hover:bg-white hover:text-black transition-all cursor-pointer"
            onClick={goNext}
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-10 right-6 z-[5] flex flex-col items-center gap-2 text-white/40 text-[0.6rem] font-bold tracking-[0.2em] uppercase max-sm:hidden" aria-hidden="true">
        <div className="w-px h-10 bg-white/20 animate-scroll-bounce" />
        <span>Scroll</span>
      </div>
    </div>
  );
};

export default Hero;
