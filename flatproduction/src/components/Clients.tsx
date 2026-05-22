import React, { useEffect, useState } from 'react';
import { contentStore } from '../store/contentStore';

const CORRECT_LOGOS = ['/mtn.png', '/engen.png', '/inyange.jpg', '/nbg.jpg'];

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

    // --- AUTO-FIX FOR OLD DATA ---
    // This checks if the old 'client.jpg' is in the list.
    // If it is, it overwrites the storage with the new SVG list.
    useEffect(() => {
        const hasOldLogo = logos.some(logo => logo.includes('client.jpg'));
        
        if (hasOldLogo) {
            console.log('Fixing old client data...');
            // 1. Update the Browser's Local Storage
            contentStore.write({ clientLogos: CORRECT_LOGOS });
            // 2. Update the screen immediately
            setLogos(CORRECT_LOGOS);
        }
    }, [logos]);
    // -----------------------------

    // Prepare the display list (filter out any remaining bad images just in case)
    const cleanLogos = logos.filter(logo => !logo.includes('client.jpg'));
        // Use provided logos or fallback to default list.
        // If any provided logo looks like a combined image/sprite (e.g. 'clients.jpg' or contains 'clients'),
        // prefer our single-logo fallbacks so each card shows one company.
        const looksLikeCombined = (p: string) => /clients|sprite|combined/i.test(p);
        const displayLogos =
            logos.length > 0 && !logos.some(looksLikeCombined) ? logos : CORRECT_LOGOS;

    // Create a loop of logos to ensure the track is wide enough for scrolling
    const logoWall =
        displayLogos.length >= 12
            ? displayLogos
            : Array.from({ length: 12 }, (_, i) => displayLogos[i % displayLogos.length]);

    return (
        <section id="clients" className="clients-section">
            <div className="clients-header">
                <span className="section-tag">Trusted Partnerships</span>
                <h2>Our Clients</h2>
                <p className="section-intro">{intro}</p>
                
                <div className="client-pills" aria-label="Client categories">
                    {clients.map((c, i) => (
                        <span key={i} className="pill">{c}</span>
                    ))}
                </div>
            </div>

            <div className="clients-marquee-wrapper" aria-label="Client logos">
                <div className="clients-marquee-track">
                    {/* Group 1: Original List */}
                    <div className="clients-marquee-group">
                        {logoWall.map((logo, index) => (
                            <figure key={`${logo}-${index}`} className="client-logo-card">
                                <img src={logo} alt={`Client logo ${index + 1}`} loading="lazy" />
                            </figure>
                        ))}
                    </div>
                    
                    {/* Group 2: Duplicate for Seamless Loop */}
                    <div className="clients-marquee-group" aria-hidden="true">
                        {logoWall.map((logo, index) => (
                            <figure key={`dup-${logo}-${index}`} className="client-logo-card">
                                <img src={logo} alt="" loading="lazy" />
                            </figure>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Clients;