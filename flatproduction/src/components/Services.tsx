import React, { useEffect, useState } from 'react';
import { contentStore } from '../store/contentStore';

const Services: React.FC = () => {
    const defaultServices = [
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

    const [services, setServices] = useState(() => contentStore.read().services.length ? contentStore.read().services : defaultServices);

    useEffect(()=>{
      const onUpdate = (c: any) => setServices((c.services && c.services.length) ? c.services : defaultServices);
      contentStore.onUpdate(onUpdate);
    },[]);

    return (
        <section id="services" className="services-section">
            <div className="services-header">
                <p className="section-tag">What We Do</p>
                <h2>Services</h2>
            </div>
            <div className="services-grid">
                {services.map((service, index) => (
                    <article className="service-card" key={service.title}>
                        <span className="service-number">{String(index + 1).padStart(2, '0')}</span>
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default Services;