import React, { useEffect, useState } from 'react';
import { contentStore } from '../store/contentStore';

const SERVICE_HIGHLIGHTS: Record<number, string[]> = {
    0: ['Event coverage', 'Brand films', 'Highlight reels'],
    1: ['Multi-camera setup', 'Real-time delivery', 'On-site support'],
    2: ['Landing pages', 'Business sites', 'Mobile-first'],
    3: ['Logo systems', 'Campaign graphics', 'Print design'],
    4: ['Event recap', 'Audience moments', 'Promo content'],
    5: ['Research-led', 'Story driven', 'High-end editing'],
};

const SERVICE_LONG_DESC: Record<number, string> = {
    0: 'From corporate events to weddings and product launches, we capture every visual moment with precision equipment and a storytelling eye. Our edits are polished, emotive, and built to work across every screen.',
    1: 'We deploy professional multi-camera streaming rigs for any scale of event — from intimate church services to large-scale conferences. Low-latency, stable, with dedicated technical support on-site.',
    2: 'We build fast, clean, and modern websites that make your brand look credible online. Every site is mobile-optimized, SEO-ready, and designed to convert visitors into real clients.',
    3: 'Your brand should be recognizable everywhere. We create logos, typography systems, social graphics, and print-ready artwork that hold together across every touchpoint.',
    4: 'Whether it\'s a concert, gala, or product launch, we capture the energy and emotion with high-quality cameras and a genuine eye for the moments your guests will remember.',
    5: 'Documentaries require patience, curiosity, and craft. We combine deep research, on-location filming, and precise editing to produce pieces that feel honest and compelling.',
};

const DEFAULT_IMAGES = ['/photo3.jpg', '/live1.jpeg', '/web.jpg', '/graphy33.jpg', '/chance.jpg', '/photo10.jpg'];

type Service = { id?: string; title: string; description: string; image?: string };
type ModalService = Service & { highlights: string[]; longDesc: string; resolvedImage: string; index: number };

const Services: React.FC = () => {
    const [services, setServices] = useState<Service[]>(() => {
        const s = contentStore.read().services;
        return s.length ? s : [];
    });
    const [modal, setModal] = useState<ModalService | null>(null);

    useEffect(() => {
        contentStore.onUpdate((c: any) => {
            if (c.services && c.services.length) setServices(c.services);
        });
    }, []);

    useEffect(() => {
        document.body.style.overflow = modal ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [modal]);

    useEffect(() => {
        if (!modal) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setModal(null); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [modal]);

    const openModal = (svc: Service, index: number) => {
        setModal({
            ...svc,
            highlights: SERVICE_HIGHLIGHTS[index] ?? [],
            longDesc: SERVICE_LONG_DESC[index] ?? svc.description,
            resolvedImage: svc.image || DEFAULT_IMAGES[index] || '/photo1.jpg',
            index,
        });
    };

    return (
        <section id="services" className="py-16 px-5 bg-white text-[#111]">
            <div className="text-center mb-10 max-w-[760px] mx-auto">
                <p className="inline-block mb-4 px-4 py-1.5 rounded-full border border-[#111] bg-[#111] text-white uppercase tracking-[0.15em] text-[0.75rem] font-extrabold">What We Do</p>
                <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold text-[#111] mt-2">Services</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[1200px] mx-auto">
                {services.map((service, index) => (
                    <article
                        key={service.title}
                        className="relative bg-[#f8f8f8] rounded-2xl p-7 border border-[rgba(17,17,17,0.12)] transition-all duration-300 hover:bg-[#efefef] hover:border-[rgba(17,17,17,0.22)] hover:-translate-y-1.5 hover:shadow-lg cursor-pointer group"
                        onClick={() => openModal(service, index)}
                        tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && openModal(service, index)}
                        role="button"
                        aria-label={`View details for ${service.title}`}
                    >
                        <span className="block text-[2.5rem] font-black text-[rgba(17,17,17,0.06)] leading-none mb-4">
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-[#111] font-bold text-sm tracking-wide uppercase mb-3">{service.title}</h3>
                        <p className="text-[#444] text-sm leading-relaxed mb-5 line-clamp-3">{service.description}</p>
                        <span className="inline-flex items-center gap-1.5 text-[#111] text-xs font-bold uppercase tracking-wide group-hover:gap-3 transition-all">
                            Learn more <span aria-hidden>→</span>
                        </span>
                    </article>
                ))}
            </div>

            {/* Service Detail Modal */}
            {modal && (
                <div
                    className="fixed inset-0 z-[3000] bg-black/80 flex items-center justify-center p-4"
                    onClick={() => setModal(null)}
                    role="dialog" aria-modal="true" aria-label={modal.title}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-[600px] max-h-[92vh] overflow-y-auto shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Image header */}
                        <div className="relative h-[220px] overflow-hidden rounded-t-2xl flex-shrink-0">
                            <img src={modal.resolvedImage} alt={modal.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                            <button
                                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors cursor-pointer border-0 font-[inherit]"
                                onClick={() => setModal(null)} aria-label="Close"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                            </button>
                            <div className="absolute bottom-4 left-6">
                                <p className="text-white/60 text-[0.65rem] font-bold uppercase tracking-widest mb-1">Service #{String(modal.index + 1).padStart(2, '0')}</p>
                                <h2 className="text-white font-bold text-xl leading-tight">{modal.title}</h2>
                            </div>
                        </div>

                        <div className="p-7">
                            <p className="text-[#333] text-[0.95rem] leading-[1.8] mb-6">{modal.longDesc}</p>

                            {modal.highlights.length > 0 && (
                                <div className="mb-7">
                                    <p className="text-[#111] text-[0.72rem] font-bold uppercase tracking-[0.12em] mb-3">Includes</p>
                                    <div className="flex flex-wrap gap-2">
                                        {modal.highlights.map(h => (
                                            <span key={h} className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#f1f5f9] border border-[#e2e8f0] text-[#374151] text-[0.78rem] font-semibold">
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                                                {h}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 flex-wrap">
                                <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#111] text-white font-bold text-sm hover:bg-black transition-all">
                                    Book this service →
                                </a>
                                <button
                                    className="px-5 py-3 rounded-xl border border-[rgba(17,17,17,0.15)] text-[#555] font-semibold text-sm hover:border-[#111] hover:text-[#111] transition-all cursor-pointer bg-transparent font-[inherit]"
                                    onClick={() => setModal(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Services;
