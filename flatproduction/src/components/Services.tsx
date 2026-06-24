import React, { useEffect, useState } from 'react';
import { contentStore } from '../store/contentStore';


type Service = { id?: string; title: string; description: string; image?: string; extendedDescription?: string };
type ModalService = Service & { resolvedImage: string; index: number };

const Services: React.FC = () => {
    const initial = contentStore.read();
    const [services, setServices] = useState<Service[]>(() => initial.services.length ? initial.services : []);
    const [whatsapp, setWhatsapp] = useState(initial.contact?.whatsapp ?? '250781691713');
    const [modal, setModal] = useState<ModalService | null>(null);

    useEffect(() => {
        return contentStore.onUpdate((c: any) => {
            if (c.services && c.services.length) setServices(c.services);
            if (c.contact?.whatsapp) setWhatsapp(c.contact.whatsapp);
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
            resolvedImage: svc.image || '/photo1.jpg',
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
                            <p className="text-[#333] text-[0.95rem] leading-[1.8] mb-6">{modal.extendedDescription || modal.description}</p>

                            <div className="flex gap-3 flex-wrap items-center">
                                <a
                                    href={`https://wa.me/${whatsapp}?text=Hello%20Flat%20Production%2C%20I%20would%20like%20to%20book%20your%20${encodeURIComponent(modal?.title ?? 'service')}.%20Please%20let%20me%20know%20your%20availability.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#111] text-white font-bold text-sm hover:bg-black transition-all"
                                >
                                    Book this service →
                                </a>
                                <a
                                    href={`/portfolio?filter=${encodeURIComponent(modal.title)}`}
                                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[rgba(17,17,17,0.15)] text-[#111] font-semibold text-sm hover:border-[#111] hover:bg-[#f5f5f5] transition-all"
                                >
                                    View Our Work →
                                </a>
                                <button
                                    className="ml-auto text-[#888] text-sm font-medium hover:text-[#111] transition-colors cursor-pointer bg-transparent border-0 font-[inherit] underline underline-offset-2"
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
