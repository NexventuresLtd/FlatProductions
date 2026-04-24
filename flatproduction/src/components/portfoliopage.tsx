import React from 'react';
import Header from './Header';
import Footer from './Footer';

const portfolioSections = [
    {
        label: 'Live Streaming',
        image: '/live1.jpeg',
    },
    {
        label: 'PHOTOGRAPHY',
        image: '/photo8.jpg',
    },
    {
        label: 'WEB DESIGN',
        image: '/web.jpg',
    },
    {
        label: 'GRAPHICS DESIGN',
        image: '/graphy2.png',
    },
    {
        label: 'DOCUMENTARY',
        image: '/photo12.jpg',
    },
];

const PortfolioPage: React.FC = () => {
    return (
        <div className="portfolio-page">
            <section className="portfoliopage-hero">
                <div className="portfoliopage-header-wrap">
                    <Header />
                </div>
                <div className="portfoliopage-hero-content">
                    <h1>A space built for bold ideas <br />and creative freedom. </h1>
                </div>
            </section>

            <main className="portfoliopage-main portfoliopage-sections-grid">
                {portfolioSections.map((section) => (
                    <section key={section.label} className="portfoliopage-section">
                        <div className="portfolio-item">
                            <img src={section.image} alt={`${section.label} showcase`} />
                        </div>
                        <p className="portfolio-item-label">{section.label}</p>
                    </section>
                ))}
            </main>

            <Footer />
        </div>
    );
};

export default PortfolioPage;