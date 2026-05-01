import React, { useEffect, useState } from 'react';
import { contentStore } from '../store/contentStore';

const Clients: React.FC = () => {
    const initial = contentStore.read();
    const [clients, setClients] = useState<string[]>(() => initial.clients);
    const [logos, setLogos] = useState<string[]>(() => initial.clientLogos);
    const [intro, setIntro] = useState(() => initial.clientsIntro);

    useEffect(() => {
        const onUpdate = (c: any) => {
            setClients(c.clients ?? []);
            setLogos(c.clientLogos ?? []);
            setIntro(c.clientsIntro ?? '');
        };
        contentStore.onUpdate(onUpdate);
    }, []);

    return (
        <section id="clients" className="clients-section">
            <div className="clients-header">
                <p className="section-tag">Trusted Partnerships</p>
                <h2>Our Clients</h2>
                <p>
                    {intro}
                </p>
                <div className="client-pills" aria-label="Client categories">
                    {clients.map((c, i) => (
                        <span key={i}>{c}</span>
                    ))}
                </div>
            </div>

            {logos.length > 1 ? (
                <div className="clients-logos" aria-label="Client logos">
                    {logos.map((logo, index) => (
                        <div key={`${logo}-${index}`} className="client-logo-card">
                            <img src={logo} alt={`Client logo ${index + 1}`} />
                        </div>
                    ))}
                </div>
            ) : (
                <img className="clients-image" src={logos[0] ?? '/clients.jpg'} alt="Our clients" />
            )}
        </section>
    );
};

export default Clients;
