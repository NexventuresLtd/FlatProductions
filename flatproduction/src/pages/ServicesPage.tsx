import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { contentStore } from '../store/contentStore';

type ServiceItem = {
    id?: string;
    title: string;
    description: string;
    image: string;
    extendedDescription?: string;
};

const ServicesPage: React.FC = () => {
    const [services, setServices]   = useState<ServiceItem[]>(() =>
        contentStore.read().services.map(s => ({ ...s, image: s.image || '/photo1.jpg' }))
    );
    const [heroData, setHeroData]   = useState(() => contentStore.read().pageHeroes.services);
    const [stats, setStats]         = useState(() => contentStore.read().about.stats ?? []);
    const [chips, setChips]         = useState(() => contentStore.read().about.chips ?? []);
    const [whatsapp, setWhatsapp]   = useState(() => contentStore.read().contact?.whatsapp ?? '250781691713');
    const [modal, setModal]         = useState<ServiceItem | null>(null);

    useEffect(() => {
        return contentStore.onUpdate((c: any) => {
            setServices((c.services ?? []).map((s: ServiceItem) => ({ ...s, image: s.image || '/photo1.jpg' })));
            if (c.pageHeroes?.services) setHeroData(c.pageHeroes.services);
            if (c.about?.stats)  setStats(c.about.stats);
            if (c.about?.chips)  setChips(c.about.chips);
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

    return (
        <div className="bg-[#0b0d10] text-white min-h-screen">
            {/* ── Hero ── */}
            <section className="relative min-h-[78vh] flex items-center justify-center overflow-hidden border-b border-white/[0.08]"
                style={{ background: `linear-gradient(160deg,rgba(5,7,10,0.72) 0%,rgba(5,7,10,0.92) 100%),url('${heroData.image || '/live2.jpeg'}') center 18%/cover no-repeat` }}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(229,231,235,0.18)_0%,transparent_42%)] pointer-events-none" />
                <div className="absolute inset-x-0 top-0 z-[3]"><Header /></div>
                <div className="relative z-[2] max-w-[1280px] w-full mx-auto px-5 pt-[140px] pb-[80px]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 items-center">
                        <div className="py-7">
                            <h1 className="text-white font-bold leading-[0.98] tracking-[-0.04em] text-[clamp(2.8rem,7vw,5.6rem)] mb-[18px]">
                                {heroData.title || 'Creative services built to help your brand stand out.'}
                            </h1>
                            <p className="text-white/80 text-[1.05rem] max-w-[760px]">
                                Visual production, digital design, live coverage, and storytelling — with a focused team and a polished finish.
                            </p>
                            {/* Service chips from admin → About → Service Chips */}
                            {chips.length > 0 && (
                                <div className="mt-7 flex flex-wrap gap-2.5">
                                    {chips.map(tag => (
                                        <span key={tag} className="px-3 py-2 rounded-full border border-white/[0.14] bg-white/[0.06] text-white text-[0.76rem] font-bold tracking-[0.08em] uppercase">{tag}</span>
                                    ))}
                                </div>
                            )}
                            {/* Stats from admin → About → Stats */}
                            {stats.length > 0 && (
                                <div className="mt-7 grid grid-cols-3 gap-3.5">
                                    {stats.slice(0, 3).map(({ value, label }) => (
                                        <article key={label} className="py-4 px-[18px] rounded-2xl bg-white/[0.08] border border-white/[0.12] backdrop-blur-sm">
                                            <strong className="block text-white text-[1.45rem] leading-none mb-1.5 font-bold">{value}</strong>
                                            <span className="text-white/[0.76] text-[0.78rem] tracking-[0.08em] uppercase">{label}</span>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="relative overflow-hidden min-h-[520px] rounded-[28px] border border-white/[0.12] bg-[#0a0a0a] shadow-[0_30px_70px_rgba(0,0,0,0.35)]">
                            <img src={heroData.image || '/live2.jpeg'} alt="Flat Production creative work" className="w-full h-full object-cover absolute inset-0" />
                            <div className="absolute inset-x-4 bottom-4 p-[18px] rounded-[20px] bg-[linear-gradient(180deg,rgba(17,17,17,0.3)_0%,rgba(17,17,17,0.92)_100%)] border border-white/[0.12] backdrop-blur-[10px]">
                                <p className="text-white text-[1.05rem] leading-[1.7] mb-3">Production that feels sharp, modern, and memorable.</p>
                                <ul className="list-none p-0 m-0 flex flex-wrap gap-2">
                                    {(chips.length > 0 ? chips.slice(0, 3) : ['Content strategy', 'Visual direction', 'Fast delivery']).map(t => (
                                        <li key={t} className="px-2.5 py-[7px] rounded-full bg-white/[0.08] text-white text-[0.72rem] font-bold tracking-[0.08em] uppercase">{t}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Services grid ── */}
            <main className="py-20 px-5 bg-[#e5e7eb]">
                <section className="max-w-[1280px] mx-auto mb-9 grid grid-cols-1 md:grid-cols-2 gap-7 items-end">
                    <div>
                        <p className="text-[#111] text-[0.82rem] font-extrabold tracking-[0.16em] uppercase mb-3">What we provide</p>
                        <h2 className="text-[#111] font-bold text-[clamp(2rem,4vw,3.4rem)] leading-[1.02] max-w-[14ch] m-0">
                            Everything you need for strong content and a clear brand presence.
                        </h2>
                    </div>
                    <p className="text-[#333] text-base leading-[1.8]">
                        Click any service to learn more about what we offer and how we can help. From one-off productions to ongoing creative support.
                    </p>
                </section>

                <section className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[22px]" aria-label="Services">
                    {services.map((service) => (
                        <article
                            key={service.id || service.title}
                            className="overflow-hidden rounded-[20px] bg-white border border-[rgba(17,17,17,0.1)] shadow-[0_18px_40px_rgba(17,17,17,0.08)] transition-all duration-300 hover:-translate-y-2 hover:border-[rgba(17,17,17,0.18)] hover:shadow-[0_22px_44px_rgba(17,17,17,0.12)] group cursor-pointer"
                            onClick={() => setModal(service)}
                            tabIndex={0}
                            onKeyDown={e => e.key === 'Enter' && setModal(service)}
                            role="button"
                            aria-label={`View details for ${service.title}`}
                        >
                            <div className="relative overflow-hidden aspect-[4/3] bg-[#0a0a0a]">
                                <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-[650ms] group-hover:scale-[1.06]" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute left-3.5 top-3.5 z-[2] px-2.5 py-[7px] rounded-full bg-white/90 text-[#111] text-[0.72rem] font-extrabold tracking-[0.08em] uppercase">
                                    Flat Production
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[2]">
                                    <span className="bg-white text-[#111] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                                        View Details
                                    </span>
                                </div>
                            </div>
                            <div className="p-[22px]">
                                <h3 className="text-[#111] font-bold text-[1.15rem] mb-2.5">{service.title}</h3>
                                <p className="text-[#444] leading-[1.7] mb-[18px] text-sm line-clamp-2">{service.description}</p>
                                <span className="inline-flex items-center gap-1.5 text-[#111] text-sm font-bold group-hover:gap-3 transition-all">
                                    Learn more <span aria-hidden>→</span>
                                </span>
                            </div>
                        </article>
                    ))}
                </section>

                {/* CTA */}
                <section className="max-w-[1280px] mx-auto mt-9 p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 flex-wrap rounded-[20px] bg-white border border-[rgba(17,17,17,0.1)] shadow-[0_18px_40px_rgba(17,17,17,0.08)]">
                    <div>
                        <p className="text-[#111] text-[0.82rem] font-extrabold tracking-[0.16em] uppercase mb-3">Ready to start?</p>
                        <h2 className="text-[#111] font-bold text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.05] max-w-[16ch] m-0">
                            Let's turn your next idea into something people remember.
                        </h2>
                    </div>
                    <a href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[rgba(17,17,17,0.08)] bg-[#e5e7eb] text-[#111] text-sm font-semibold cursor-pointer transition-all hover:bg-[#d9dde3] hover:-translate-y-0.5 hover:shadow-md flex-shrink-0">
                        Book a project
                    </a>
                </section>
            </main>

            <Footer />

            {/* ── Service Detail Modal ── */}
            {modal && (
                <div
                    className="fixed inset-0 z-[3000] bg-black/85 flex items-center justify-center p-4 md:p-8"
                    onClick={() => setModal(null)}
                    role="dialog" aria-modal="true" aria-label={modal.title}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-[660px] max-h-[92vh] overflow-y-auto shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="relative h-[260px] md:h-[300px] overflow-hidden rounded-t-2xl flex-shrink-0">
                            <img src={modal.image} alt={modal.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <button
                                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors cursor-pointer border-0 font-[inherit]"
                                onClick={() => setModal(null)} aria-label="Close"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                            </button>
                            <div className="absolute bottom-5 left-6">
                                <p className="text-white/60 text-[0.7rem] font-bold uppercase tracking-[0.18em] mb-1">Service</p>
                                <h2 className="text-white font-bold text-xl md:text-2xl leading-tight">{modal.title}</h2>
                            </div>
                        </div>

                        <div className="p-7 md:p-8">
                            <p className="text-[#333] text-base leading-[1.8] mb-6">
                                {modal.extendedDescription || modal.description}
                            </p>

                            <div className="flex items-center gap-3 flex-wrap">
                                <a
                                    href={`https://wa.me/${whatsapp}?text=Hello%20Flat%20Production%2C%20I%20would%20like%20to%20book%20your%20${encodeURIComponent(modal?.title ?? 'service')}.%20Please%20let%20me%20know%20your%20availability.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#111] text-white font-bold text-sm hover:bg-black transition-all hover:-translate-y-px"
                                >
                                    Book this service →
                                </a>
                                <a
                                    href={`/portfolio?filter=${encodeURIComponent(modal?.title ?? '')}`}
                                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-[rgba(17,17,17,0.15)] text-[#111] font-semibold text-sm hover:border-[#111] hover:bg-[#f5f5f5] transition-all"
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
        </div>
    );
};

export default ServicesPage;
