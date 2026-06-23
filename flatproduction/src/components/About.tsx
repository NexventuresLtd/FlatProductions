import React, { useEffect, useState } from 'react';
import { contentStore } from '../store/contentStore';

const stats = [
    { value: '8+', label: 'Years Active' },
    { value: '200+', label: 'Projects Delivered' },
    { value: '50+', label: 'Clients Served' },
];

const About: React.FC = () => {
    const [about, setAbout] = useState(() => contentStore.read().about);

    useEffect(() => {
        return contentStore.onUpdate((c: any) => { if (c.about) setAbout(c.about); });
    }, []);

    return (
        <section className="bg-[#0a0a0a] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[85vh]">

                {/* Left — photo collage */}
                <div className="relative grid grid-cols-2 min-h-[420px] lg:min-h-0">
                    {/* Tall left image */}
                    <div className="relative overflow-hidden row-span-2">
                        <img src={about.image1 || '/photo3.jpg'} alt="Flat Production event coverage" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/25" />
                    </div>
                    {/* Top-right image */}
                    <div className="relative overflow-hidden">
                        <img src={about.image2 || '/photo6.jpg'} alt="Live production" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/25" />
                    </div>
                    {/* Bottom-right image */}
                    <div className="relative overflow-hidden">
                        <img src={about.image3 || '/live1.jpeg'} alt="On-site crew" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/25" />
                    </div>
                    {/* Location pill */}
                    <div className="absolute bottom-5 left-5 z-10">
                        <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[0.68rem] font-bold uppercase tracking-[0.18em] px-3.5 py-1.5 rounded-full">
                            Based in Kigali, Rwanda
                        </span>
                    </div>
                    {/* Year badge */}
                    <div className="absolute top-5 right-5 z-10 bg-black/60 backdrop-blur-md border border-white/15 text-white rounded-xl px-3.5 py-2.5 text-center">
                        <p className="text-white font-bold text-xl leading-none">2018</p>
                        <p className="text-white/55 text-[0.65rem] uppercase tracking-widest mt-0.5">Founded</p>
                    </div>
                </div>

                {/* Right — content */}
                <div className="flex flex-col justify-center px-8 md:px-14 py-16 lg:py-24">
                    <p className="text-[#dc2626] text-[0.7rem] font-bold uppercase tracking-[0.28em] mb-6">About Flat Productions</p>

                    <h2 className="text-white font-bold text-[clamp(1.9rem,3.8vw,2.9rem)] leading-[1.08] tracking-[-0.02em] mb-6">
                        {about.heading || 'Where Light Becomes Memory'}
                    </h2>

                    <p className="text-white/60 text-[0.97rem] leading-[1.85] mb-10 max-w-[500px]">
                        {about.history || about.body || 'Every frame is crafted with patience, emotion, and intent, turning ordinary scenes into cinematic moments that feel personal, timeless, and alive.'}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 border-t border-white/[0.1] pt-8 mb-10">
                        {stats.map(({ value, label }) => (
                            <div key={label}>
                                <p className="text-white font-bold text-[1.9rem] leading-none mb-1.5">{value}</p>
                                <p className="text-white/45 text-[0.72rem] uppercase tracking-[0.1em] leading-snug">{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Services chips */}
                    <div className="flex flex-wrap gap-2 mb-10">
                        {['Photography', 'Video Production', 'Live Streaming', 'Branding', 'Web Design', 'Documentary'].map(tag => (
                            <span key={tag} className="border border-white/[0.12] bg-white/[0.05] text-white/70 text-[0.7rem] font-semibold uppercase tracking-[0.08em] px-3 py-1.5 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex gap-4 flex-wrap">
                        <a href="/about"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#111] text-sm font-bold tracking-wide hover:bg-white/90 transition-all"
                        >
                            Our Story →
                        </a>
                        <a href="/contact"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/25 text-white text-sm font-bold tracking-wide hover:border-white hover:bg-white/10 transition-all"
                        >
                            Work With Us
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
