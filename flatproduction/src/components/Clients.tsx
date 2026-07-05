import React, { useEffect, useState } from 'react';
import { contentStore } from '../store/contentStore';
import { resolveMediaUrl } from '../lib/apiClient';

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
        return contentStore.onUpdate(onUpdate);
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
        <section id="clients" className="py-16 px-5 bg-[#111] text-white overflow-hidden flex flex-col gap-10">
            <div className="text-center max-w-2xl mx-auto">
                <span className="inline-block mb-4 px-4 py-1.5 rounded-full border border-white/30 bg-transparent text-white/70 uppercase tracking-[0.15em] text-[0.75rem] font-extrabold">Trusted Partnerships</span>
                <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-3">Our Clients</h2>
                <p className="text-white/60 text-sm leading-relaxed mb-6">{intro}</p>

                <div className="flex flex-wrap justify-center gap-2" aria-label="Client categories">
                    {clients.map((c, i) => (
                        <span key={i} className="px-4 py-2 rounded-full border border-white/20 bg-white/8 text-white/70 text-xs font-semibold tracking-wide">{c}</span>
                    ))}
                </div>
            </div>

            {/* marquee-wrapper class name kept for CSS hover rule in index.css */}
            <div className="marquee-wrapper relative overflow-hidden w-full" aria-label="Client logos">
                {/* marquee-track class name kept for CSS hover rule in index.css */}
                <div className="marquee-track flex">
                    {/* Group 1: Original List */}
                    <div className="flex gap-5 pr-5 flex-shrink-0 animate-marquee">
                        {logoWall.map((logo, index) => (
                            <figure key={`${logo}-${index}`} className="flex items-center justify-center w-[140px] aspect-[4/3] bg-white/8 rounded-xl border border-white/10 p-3 flex-shrink-0 m-0">
                                <img src={resolveMediaUrl(logo)} alt={`Client logo ${index + 1}`} loading="lazy" className="max-h-full w-auto object-contain" />
                            </figure>
                        ))}
                    </div>

                    {/* Group 2: Duplicate for Seamless Loop */}
                    <div className="flex gap-5 pr-5 flex-shrink-0 animate-marquee" aria-hidden="true">
                        {logoWall.map((logo, index) => (
                            <figure key={`dup-${logo}-${index}`} className="flex items-center justify-center w-[140px] aspect-[4/3] bg-white/8 rounded-xl border border-white/10 p-3 flex-shrink-0 m-0">
                                <img src={resolveMediaUrl(logo)} alt="" loading="lazy" className="max-h-full w-auto object-contain" />
                            </figure>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Clients;
