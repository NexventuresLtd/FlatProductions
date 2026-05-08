import React from 'react';
import Header from './Header';
import Footer from './Footer';

const serviceItems = [
    {
        title: 'Photography & Video Production',
        image: '/photo3.jpg',
        description: 'Sharp event coverage, brand films, interviews, highlight reels, and polished edits built to tell a clear story.',
        highlights: ['Event coverage', 'Highlight films', 'Interview shoots'],
    },
    {
        title: 'Live Streaming & Feed',
        image: '/live1.jpeg',
        description: 'Reliable multi-camera streaming and on-site production for launches, conferences, church services, and special events.',
        highlights: ['Multi-camera setup', 'Real-time delivery', 'On-site support'],
    },
    {
        title: 'Website Design',
        image: '/web.jpg',
        description: 'Fast, clean, and modern websites that make your brand look credible and make it easy for people to take action.',
        highlights: ['Landing pages', 'Business sites', 'Responsive builds'],
    },
    {
        title: 'Graphic Design & Branding',
        image: '/graphy33.jpg',
        description: 'Brand identities, social graphics, print-ready artwork, and visual systems that keep everything consistent.',
        highlights: ['Logo systems', 'Campaign graphics', 'Print design'],
    },
    {
        title: 'Event & Entertainment Coverage',
        image: '/chance.jpg',
        description: 'Energetic coverage for celebrations, concerts, launches, and corporate moments with strong storytelling value.',
        highlights: ['Event recap', 'Audience moments', 'Promo content'],
    },
    {
        title: 'Documentary Production',
        image: '/photo10.jpg',
        description: 'Purposeful storytelling through research, interviews, cinematography, and editing that feels human and memorable.',
        highlights: ['Research-led', 'Story driven', 'High-end editing'],
    },
];

const ServicesPage: React.FC = () => {
    return (
        <div className="services-page">
            <section className="servicespage-hero">
                <div className="servicespage-overlay" />
                <div className="servicespage-header-wrap">
                    <Header />
                </div>

                <div className="servicespage-hero-content">
                    <div className="servicespage-hero-grid">
                        <div className="servicespage-hero-copy">
                        
                            <h1>Creative services built to help your brand stand out.</h1>
                            <p>
                                We handle visual production, digital design, live coverage, and storytelling with a focused team and a polished finish.
                            </p>

                            <div className="servicespage-badges" aria-label="Core service strengths">
                                <span>Photography</span>
                                <span>Live Streaming</span>
                                <span>Web Design</span>
                                <span>Branding</span>
                                <span>Documentary</span>
                            </div>

                            <div className="servicespage-metrics">
                                <article>
                                    <strong>06+</strong>
                                    <span>service areas</span>
                                </article>
                                <article>
                                    <strong>08</strong>
                                    <span>years of experience</span>
                                </article>
                                <article>
                                    <strong>1</strong>
                                    <span>creative team</span>
                                </article>
                            </div>
                        </div>

                        <div className="servicespage-hero-card">
                            <img src="/live2.jpeg" alt="Flat Production creative work" />
                            <div className="servicespage-hero-card-overlay">
                                <p>Production that feels sharp, modern, and memorable.</p>
                                <ul>
                                    <li>Content strategy</li>
                                    <li>Visual direction</li>
                                    <li>Fast delivery</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <main className="servicespage-main">
                <section className="servicespage-intro">
                    <div>
                        <p className="servicespage-kicker">What we provide</p>
                        <h2>Everything you need to create strong content and a clear brand presence.</h2>
                    </div>
                    <p>
                        From one-off productions to ongoing creative support, our services are designed to keep your communication consistent, professional, and visually strong.
                    </p>
                </section>

                <section className="servicespage-grid" aria-label="Flat Production services">
                    {serviceItems.map((service) => (
                        <article className="servicespage-card" key={service.title}>
                            <div className="servicespage-media">
                                <img src={service.image} alt={service.title} />
                                <div className="servicespage-media-label">Flat Production</div>
                            </div>
                            <div className="servicespage-card-copy">
                                <h3>{service.title}</h3>
                                <p>{service.description}</p>
                                <ul className="servicespage-highlights">
                                    {service.highlights.map((highlight) => (
                                        <li key={highlight}>{highlight}</li>
                                    ))}
                                </ul>
                            </div>
                        </article>
                    ))}
                </section>

                <section className="servicespage-cta">
                    <div>
                        <p className="servicespage-kicker">Ready to start?</p>
                        <h2>Let’s turn your next idea into something people remember.</h2>
                    </div>
                    <a className="book-us-button" href="/contact">Book a project</a>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ServicesPage;