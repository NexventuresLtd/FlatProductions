import React from 'react';
import Header from './Header';
import Footer from './Footer';

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
        <div className="about-page">
            <section className="aboutpage-hero">
                <div className="aboutpage-overlay" />
                <div className="aboutpage-header-wrap">
                    <Header />
                </div>
                <div className="aboutpage-hero-content">
                    <h1>
                        <span>Real Moments.</span>
                        <span>Bold Stories.</span>
                        <span>Timeless Impact.</span>
                    </h1>
                </div>
            </section>

            <main className="aboutpage-main">
                <section className="aboutpage-section story-layout">
                    <div className="about-images-grid" aria-label="Flat Production work showcase">
                        <img src="/photo3.jpg" alt="Event capture by Flat Production" />
                        <img src="/photo6.jpg" alt="Live production coverage" />
                        <img src="/live1.jpeg" alt="On-site creative team" />
                        <img src="/photo10.jpg" alt="Documentary filming moment" />
                    </div>
                    <div className="history-block">
                        <h1>Our History</h1>
                        <p>
                            FLAT PRODUCTION LIMITED is a Rwandan-based company with 8 years of comprehensive experience and a full portfolio of services. Since 2018, we have delivered event live streaming and feed, photography and video production, web design, content creation, social media management, graphic design, printing, branding, event and entertainment coverage, and documentary production.
                        </p>
                    </div>
                </section>

                <section className="aboutpage-section mission-panel" aria-label="Mission vision and value">
                    <article className="about-card">
                        <span className="about-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                                <path d="M12 2l3.1 6.3 6.9 1-5 4.8 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.8 6.9-1L12 2z" />
                            </svg>
                        </span>
                        <h3>Our Mission</h3>
                        <p>
                            To transform ideas, emotions, and moments into unforgettable visuals and digital experiences that help people and brands connect with purpose.
                        </p>
                    </article>
                    <article className="about-card">
                        <span className="about-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                                <path d="M12 5C6.5 5 2 9.1 1 12c1 2.9 5.5 7 11 7s10-4.1 11-7c-1-2.9-5.5-7-11-7zm0 11a4 4 0 110-8 4 4 0 010 8z" />
                            </svg>
                        </span>
                        <h3>Our Vision</h3>
                        <p>
                            To become East Africa's most trusted creative production partner for stories that shape culture, business growth, and meaningful human impact.
                        </p>
                    </article>
                    <article className="about-card">
                        <span className="about-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                                <path d="M12 2l8 4.5V13c0 5.2-3.4 8.2-8 9-4.6-.8-8-3.8-8-9V6.5L12 2zm0 4.2L7 8.9V13c0 3.8 2.2 5.9 5 6.6 2.8-.7 5-2.8 5-6.6V8.9L12 6.2z" />
                            </svg>
                        </span>
                        <h3>Our Value</h3>
                        <p>
                            Authenticity, excellence, teamwork, and innovation guide everything we produce from live events and documentaries to digital campaigns and branding.
                        </p>
                    </article>
                </section>

                <section className="aboutpage-section testimonials-block companies-block">
                    <h2>Real People, Real Stories</h2>
                    <p className="companies-intro">What our clients are saying</p>
                    <div className="testimonials-grid companies-grid">
                        {companyCards.map((company) => (
                            <article key={company.name} className="testimonial-card company-card">
                                <div className="company-stars" aria-label="5 out of 5 stars">
                                    {stars.map((_, index) => (
                                        <svg key={index} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                            <path d="M12 2l3.1 6.3 6.9 1-5 4.8 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.8 6.9-1L12 2z" />
                                        </svg>
                                    ))}
                                </div>
                                <p>"{company.quote}"</p>
                                <div className="company-footer">
                                    <img className="company-logo" src={company.logoSrc} alt={`${company.name} logo`} />
                                    <h4>{company.name}</h4>
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
