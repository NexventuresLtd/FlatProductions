import React from 'react';

const Services: React.FC = () => {
    const services = [
        {
            title: 'PHOTOGRAPHY & VIDEO PRODUCTION',
            description:
                'Delivering outstanding excellence in video production and photography: capturing moments, crafting stories, creating memories.',
        },
        {
            title: 'LIVE STREAMING & FEED',
            description:
                'Lets you interact with your audience in real time with a video feed, chat, reactions, and more.',
        },
        {
            title: 'WEBSITE DESIGN',
            description:
                'You are the best in your work; let us help you show the world your excellent achievements digitally.',
        },
        {
            title: 'DESIGN - PRINTING & BRANDING',
            description:
                "It's hard to build and easy to destroy by not branding your excellent work; we are here to express your great work through stunning branding.",
        },
        {
            title: 'EVENT & ENTERTAINMENT',
            description:
                'Here to help differentiate your event through outstanding creativity.',
        },
        {
            title: 'DOCUMENTARY',
            description:
                'A better way of storytelling through interviewing, research, reality filming, narration, and production excellence through experience.',
        },
    ];

    return (
        <section id="services" className="services-section">
            <div className="services-header">
                <h2>Services</h2>
            </div>
            <div className="services-grid">
                {services.map((service) => (
                    <article className="service-card" key={service.title}>
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default Services;