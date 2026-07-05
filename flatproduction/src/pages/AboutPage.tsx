import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { contentStore, type SiteContent } from '../store/contentStore';
import { resolveMediaUrl } from '../lib/apiClient';

const StarIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="w-4 h-4 fill-[#f5a623]">
    <path d="M12 2l3.1 6.3 6.9 1-5 4.8 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.8 6.9-1L12 2z" />
  </svg>
);

const AboutPage: React.FC = () => {
  const [content, setContent] = useState<SiteContent>(() => contentStore.read());

  useEffect(() => {
    return contentStore.onUpdate(c => setContent(c));
  }, []);

  const { about, testimonials, pageHeroes } = content;
  const hero = pageHeroes.about;

  const titleLines = hero.title.split('\n').filter(Boolean);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero */}
      <section
        className="relative min-h-[80vh] flex items-center justify-center bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url('${resolveMediaUrl(hero.image) || '/photo12.jpg'}')` }}
      >
        <div className="absolute inset-0 bg-black/60 z-[1]" />
        <div className="absolute top-0 left-0 right-0 z-[10]">
          <Header />
        </div>
        <div className="relative z-[2] text-center px-5 mt-20">
          <h1 className="text-white font-bold leading-tight flex flex-col gap-2 text-[clamp(2.5rem,6vw,5rem)] tracking-tight">
            {titleLines.length > 1
              ? titleLines.map((line, i) => <span key={i} className="block">{line}</span>)
              : <span>{hero.title}</span>}
          </h1>
        </div>
      </section>

      <main className="max-w-[1200px] mx-auto px-5 py-16">
        {/* History + image mosaic */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 items-center">
          <div className="grid grid-cols-2 gap-3" aria-label="Flat Production work showcase">
            {[
              resolveMediaUrl(about.image1) || '/photo3.jpg',
              resolveMediaUrl(about.image2) || '/photo6.jpg',
              resolveMediaUrl(about.image3) || '/live1.jpeg',
              resolveMediaUrl(about.image4) || '/photo10.jpg',
            ].map((src, i) => (
              <img key={i} src={src} alt="" className="w-full h-[200px] md:h-[240px] object-cover rounded-xl" />
            ))}
          </div>
          <div className="bg-[#f8f8f8] rounded-2xl p-8 border border-[rgba(17,17,17,0.08)]">
            <h2 className="text-[#111] text-[clamp(1.8rem,4vw,2.5rem)] font-bold mb-4">{about.heading || 'Our History'}</h2>
            <p className="text-[#444] text-sm leading-relaxed">
              {about.history || about.body}
            </p>
          </div>
        </section>

        {/* Mission / Vision / Value */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16" aria-label="Mission vision and value">
          {[
            { label: 'Our Mission', text: about.mission || '', icon: <path d="M12 2l3.1 6.3 6.9 1-5 4.8 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.8 6.9-1L12 2z" /> },
            { label: 'Our Vision',  text: about.vision  || '', icon: <path d="M12 5C6.5 5 2 9.1 1 12c1 2.9 5.5 7 11 7s10-4.1 11-7c-1-2.9-5.5-7-11-7zm0 11a4 4 0 110-8 4 4 0 010 8z" /> },
            { label: 'Our Value',   text: about.value   || '', icon: <path d="M12 2l8 4.5V13c0 5.2-3.4 8.2-8 9-4.6-.8-8-3.8-8-9V6.5L12 2zm0 4.2L7 8.9V13c0 3.8 2.2 5.9 5 6.6 2.8-.7 5-2.8 5-6.6V8.9L12 6.2z" /> },
          ].map(({ label, text, icon }) => text ? (
            <article key={label} className="bg-[#f8f8f8] rounded-2xl p-8 border border-[rgba(17,17,17,0.08)]">
              <span className="block w-10 h-10 mb-4 text-[#111]" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="w-full h-full fill-current" role="presentation" focusable="false">{icon}</svg>
              </span>
              <h3 className="text-[#111] font-bold text-lg mb-3">{label}</h3>
              <p className="text-[#444] text-sm leading-relaxed">{text}</p>
            </article>
          ) : null)}
        </section>

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section className="mb-16">
            <h2 className="text-[#111] font-bold text-[clamp(1.8rem,4vw,2.5rem)] mb-2">Real People, Real Stories</h2>
            <p className="text-[#555] text-sm mb-8">What our clients are saying</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {testimonials.map(t => (
                <article key={t.id} className="bg-[#f8f8f8] rounded-2xl p-7 border border-[rgba(17,17,17,0.08)]">
                  <div className="flex gap-1 mb-4" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} />)}
                  </div>
                  <p className="text-[#444] text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>
                  <div className="flex items-center gap-3 mt-4">
                    <img className="w-10 h-10 object-contain rounded-lg" src={resolveMediaUrl(t.logoSrc)} alt={`${t.name} logo`} />
                    <h4 className="text-[#111] font-bold text-sm">{t.name}</h4>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
