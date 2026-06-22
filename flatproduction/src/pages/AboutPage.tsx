import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutPage: React.FC = () => {
    const stars = Array.from({ length: 5 });

    const companyCards = [
        {
            name: 'MTN Rwanda',
            logoSrc: '/mtn.png',
            quote: 'Flat Production delivered event visuals and digital storytelling that elevated our customer engagement campaigns.',
        },
        {
            name: 'Engen Rwanda',
            logoSrc: '/engen.png',
            quote: 'Their livestream and content team managed high-pressure launches smoothly and produced quality media in real time.',
        },
        {
            name: 'Inyange Industries',
            logoSrc: '/inyange.jpg',
            quote: 'From photography to post-production, they helped us communicate our brand story with clarity and premium quality.',
        },
        {
            name: 'NBG',
            logoSrc: '/nbg.jpg',
            quote: 'We trusted Flat Production for documentary storytelling and campaign content, and the outcome was impactful and authentic.',
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <section className="relative min-h-[80vh] flex items-center justify-center bg-[url('/photo12.jpg')] bg-cover bg-center overflow-hidden">
                <div className="absolute inset-0 bg-black/60 z-[1]" />
                <div className="absolute top-0 left-0 right-0 z-[10]">
                    <Header />
                </div>
                <div className="relative z-[2] text-center px-5 mt-20">
                    <h1 className="text-white font-bold leading-tight flex flex-col gap-2 text-[clamp(2.5rem,6vw,5rem)] tracking-tight">
                        <span className="block">Real Moments.</span>
                        <span className="block">Bold Stories.</span>
                        <span className="block">Timeless Impact.</span>
                    </h1>
                </div>
            </section>

            <main className="max-w-[1200px] mx-auto px-5 py-16">
                <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 items-center">
                    <div className="grid grid-cols-2 gap-3" aria-label="Flat Production work showcase">
                        <img src="/photo3.jpg" alt="Event capture by Flat Production" className="w-full h-[200px] md:h-[240px] object-cover rounded-xl" />
                        <img src="/photo6.jpg" alt="Live production coverage" className="w-full h-[200px] md:h-[240px] object-cover rounded-xl" />
                        <img src="/live1.jpeg" alt="On-site creative team" className="w-full h-[200px] md:h-[240px] object-cover rounded-xl" />
                        <img src="/photo10.jpg" alt="Documentary filming moment" className="w-full h-[200px] md:h-[240px] object-cover rounded-xl" />
                    </div>
                    <div className="bg-[#f8f8f8] rounded-2xl p-8 border border-[rgba(17,17,17,0.08)]">
                        <h1 className="text-[#111] text-[clamp(1.8rem,4vw,2.5rem)] font-bold mb-4">Our History</h1>
                        <p className="text-[#444] text-sm leading-relaxed">
                            FLAT PRODUCTION LIMITED is a Rwandan-based company with 8 years of comprehensive experience and a full portfolio of services. Since 2018, we have delivered event live streaming and feed, photography and video production, web design, content creation, social media management, graphic design, printing, branding, event and entertainment coverage, and documentary production.
                        </p>
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16" aria-label="Mission vision and value">
                    <article className="bg-[#f8f8f8] rounded-2xl p-8 border border-[rgba(17,17,17,0.08)]">
                        <span className="block w-10 h-10 mb-4 text-[#111] [&_svg]:w-full [&_svg]:h-full [&_svg]:fill-current" aria-hidden="true">
                            <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                                <path d="M12 2l3.1 6.3 6.9 1-5 4.8 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.8 6.9-1L12 2z" />
                            </svg>
                        </span>
                        <h3 className="text-[#111] font-bold text-lg mb-3">Our Mission</h3>
                        <p className="text-[#444] text-sm leading-relaxed">
                            To transform ideas, emotions, and moments into unforgettable visuals and digital experiences that help people and brands connect with purpose.
                        </p>
                    </article>
                    <article className="bg-[#f8f8f8] rounded-2xl p-8 border border-[rgba(17,17,17,0.08)]">
                        <span className="block w-10 h-10 mb-4 text-[#111] [&_svg]:w-full [&_svg]:h-full [&_svg]:fill-current" aria-hidden="true">
                            <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                                <path d="M12 5C6.5 5 2 9.1 1 12c1 2.9 5.5 7 11 7s10-4.1 11-7c-1-2.9-5.5-7-11-7zm0 11a4 4 0 110-8 4 4 0 010 8z" />
                            </svg>
                        </span>
                        <h3 className="text-[#111] font-bold text-lg mb-3">Our Vision</h3>
                        <p className="text-[#444] text-sm leading-relaxed">
                            To become East Africa's most trusted creative production partner for stories that shape culture, business growth, and meaningful human impact.
                        </p>
                    </article>
                    <article className="bg-[#f8f8f8] rounded-2xl p-8 border border-[rgba(17,17,17,0.08)]">
                        <span className="block w-10 h-10 mb-4 text-[#111] [&_svg]:w-full [&_svg]:h-full [&_svg]:fill-current" aria-hidden="true">
                            <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                                <path d="M12 2l8 4.5V13c0 5.2-3.4 8.2-8 9-4.6-.8-8-3.8-8-9V6.5L12 2zm0 4.2L7 8.9V13c0 3.8 2.2 5.9 5 6.6 2.8-.7 5-2.8 5-6.6V8.9L12 6.2z" />
                            </svg>
                        </span>
                        <h3 className="text-[#111] font-bold text-lg mb-3">Our Value</h3>
                        <p className="text-[#444] text-sm leading-relaxed">
                            Authenticity, excellence, teamwork, and innovation guide everything we produce from live events and documentaries to digital campaigns and branding.
                        </p>
                    </article>
                </section>

                <section className="mb-16">
                    <h2 className="text-[#111] font-bold text-[clamp(1.8rem,4vw,2.5rem)] mb-2">Real People, Real Stories</h2>
                    <p className="text-[#555] text-sm mb-8">What our clients are saying</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {companyCards.map((company) => (
                            <article key={company.name} className="bg-[#f8f8f8] rounded-2xl p-7 border border-[rgba(17,17,17,0.08)]">
                                <div className="flex gap-1 mb-4 [&_svg]:w-4 [&_svg]:h-4 [&_svg]:fill-[#f5a623] [&_svg]:text-[#f5a623]" aria-label="5 out of 5 stars">
                                    {stars.map((_, index) => (
                                        <svg key={index} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                            <path d="M12 2l3.1 6.3 6.9 1-5 4.8 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.8 6.9-1L12 2z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-[#444] text-sm leading-relaxed mb-5 italic">"{company.quote}"</p>
                                <div className="flex items-center gap-3 mt-4">
                                    <img className="w-10 h-10 object-contain rounded-lg" src={company.logoSrc} alt={`${company.name} logo`} />
                                    <h4 className="text-[#111] font-bold text-sm">{company.name}</h4>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;
