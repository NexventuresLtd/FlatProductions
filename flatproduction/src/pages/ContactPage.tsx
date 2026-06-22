import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ContactPage: React.FC = () => {
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [showToast, setShowToast] = useState(false);
    const whatsappLink = 'https://wa.me/250781691713?text=Hello%20Flat%20Production%2C%20I%20would%20like%20to%20book%20your%20services.';

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormStatus('submitting');
        setTimeout(() => {
            setFormStatus('success');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4500);
            setTimeout(() => setFormStatus('idle'), 4500);
            (e.target as HTMLFormElement).reset();
        }, 1500);
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero */}
            <section className="relative min-h-[56vh] flex items-end pb-16 bg-[#0a0a0a] overflow-hidden">
                <div className="absolute top-0 left-0 right-0 z-[20]">
                    <Header />
                </div>
                {/* Background */}
                <div className="absolute inset-0 bg-[url('/live2.jpeg')] bg-cover bg-center opacity-25" aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-[#0a0a0a]" aria-hidden="true" />

                <div className="relative z-[5] max-w-[1200px] mx-auto px-5 w-full">
                    <p className="text-[#818cf8] text-xs font-bold uppercase tracking-[0.25em] mb-5">Get In Touch</p>
                    <h1 className="text-white font-bold text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.05] tracking-[-0.02em] mb-5">
                        Let's Create Something<br className="hidden sm:block" />
                        <span className="text-white/60"> Extraordinary</span>
                    </h1>
                    <p className="text-white/55 text-base max-w-[460px] leading-relaxed">
                        Tell us about your vision and we'll shape it into something that lasts.
                    </p>
                </div>
            </section>

            {/* Main content */}
            <div className="bg-[#f4f6f9] flex-1">
                <div className="max-w-[1200px] mx-auto px-5 py-16 w-full">

                    {/* Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">

                        {/* ── Left: Contact Form ── */}
                        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#e2e8f0]">
                            <h2 className="text-[#0f172a] font-bold text-xl mb-1">Send us a message</h2>
                            <p className="text-[#64748b] text-sm mb-8">We'll get back to you within 24 hours.</p>

                            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="fullName" className="block text-[#374151] text-sm font-semibold mb-1.5">Full Name</label>
                                        <input id="fullName" name="fullName" type="text" placeholder="Alex Niyongira" required
                                            disabled={formStatus === 'submitting'}
                                            className="w-full border border-[#e2e8f0] bg-[#f8fafc] text-[#111] rounded-xl px-4 py-3 text-sm outline-none transition-all focus:border-[#6366f1] focus:bg-white focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] disabled:opacity-60 font-[inherit]"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-[#374151] text-sm font-semibold mb-1.5">Email Address</label>
                                        <input id="email" name="email" type="email" placeholder="alex@example.com" required
                                            disabled={formStatus === 'submitting'}
                                            className="w-full border border-[#e2e8f0] bg-[#f8fafc] text-[#111] rounded-xl px-4 py-3 text-sm outline-none transition-all focus:border-[#6366f1] focus:bg-white focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] disabled:opacity-60 font-[inherit]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-[#374151] text-sm font-semibold mb-1.5">Phone <span className="text-[#94a3b8] font-normal">(optional)</span></label>
                                    <input id="phone" name="phone" type="tel" placeholder="+250 780 000 000"
                                        disabled={formStatus === 'submitting'}
                                        className="w-full border border-[#e2e8f0] bg-[#f8fafc] text-[#111] rounded-xl px-4 py-3 text-sm outline-none transition-all focus:border-[#6366f1] focus:bg-white focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] disabled:opacity-60 font-[inherit]"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="service" className="block text-[#374151] text-sm font-semibold mb-1.5">Service</label>
                                    <select id="service" name="service" disabled={formStatus === 'submitting'}
                                        className="w-full border border-[#e2e8f0] bg-[#f8fafc] text-[#111] rounded-xl px-4 py-3 text-sm outline-none transition-all focus:border-[#6366f1] focus:bg-white focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] disabled:opacity-60 cursor-pointer font-[inherit]"
                                    >
                                        <option value="">Select a service…</option>
                                        <option>Photography &amp; Video Production</option>
                                        <option>Live Streaming</option>
                                        <option>Website Design</option>
                                        <option>Design, Printing &amp; Branding</option>
                                        <option>Event &amp; Entertainment</option>
                                        <option>Documentary</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-[#374151] text-sm font-semibold mb-1.5">Project Details</label>
                                    <textarea id="message" name="message" rows={5}
                                        placeholder="Tell us about your vision, timeline, and budget…"
                                        required disabled={formStatus === 'submitting'}
                                        className="w-full border border-[#e2e8f0] bg-[#f8fafc] text-[#111] rounded-xl px-4 py-3 text-sm outline-none transition-all focus:border-[#6366f1] focus:bg-white focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] resize-y min-h-[140px] disabled:opacity-60 font-[inherit]"
                                    />
                                </div>

                                <button type="submit" disabled={formStatus === 'submitting'}
                                    className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#111] text-white font-bold text-sm cursor-pointer transition-all hover:bg-[#374151] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed border-0 font-[inherit] mt-1"
                                >
                                    {formStatus === 'submitting' ? (
                                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> Sending…</>
                                    ) : (
                                        <>Send Message <span aria-hidden>→</span></>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* ── Right: Info cards ── */}
                        <div className="flex flex-col gap-5">
                            {/* WhatsApp CTA */}
                            <div className="bg-[#111] text-white rounded-2xl p-7">
                                <div className="w-11 h-11 rounded-xl bg-[#25D366] flex items-center justify-center mb-5">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                </div>
                                <h3 className="font-bold text-lg mb-1">Book via WhatsApp</h3>
                                <p className="text-white/60 text-sm leading-relaxed mb-5">Quick response within minutes. Schedule a consultation or ask us anything directly.</p>
                                <a href={whatsappLink} target="_blank" rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-bold transition-all hover:bg-[#20b85c] hover:-translate-y-px"
                                >
                                    Message Us Now
                                </a>
                            </div>

                            {/* Contact info */}
                            <div className="bg-white rounded-2xl p-7 border border-[#e2e8f0] shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                                <h3 className="font-bold text-[#0f172a] mb-5">Contact Details</h3>
                                <ul className="flex flex-col gap-4">
                                    {[
                                        {
                                            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                                            label: 'Studio Address', value: 'Kabeza KK 18 Ave, Kigali, Rwanda',
                                        },
                                        {
                                            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
                                            label: 'Phone', value: '+250 781 691 713',
                                        },
                                        {
                                            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
                                            label: 'Email', value: 'info@flatproduction.rw',
                                        },
                                        {
                                            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                                            label: 'Working Hours', value: 'Mon – Sat, 8:00 AM – 6:00 PM',
                                        },
                                    ].map(({ icon, label, value }) => (
                                        <li key={label} className="flex items-start gap-3">
                                            <span className="w-8 h-8 rounded-lg bg-[#f1f5f9] flex items-center justify-center flex-shrink-0 mt-0.5">{icon}</span>
                                            <div>
                                                <p className="text-[#374151] font-semibold text-sm">{label}</p>
                                                <p className="text-[#64748b] text-sm">{value}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Social links */}
                            <div className="bg-[#eef2ff] rounded-2xl p-7 border border-[#c7d2fe]">
                                <h3 className="font-bold text-[#312e81] mb-3">Follow Our Work</h3>
                                <div className="flex gap-3">
                                    {[
                                        { label: 'Instagram', href: 'https://instagram.com', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> },
                                        { label: 'YouTube', href: 'https://youtube.com', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
                                        { label: 'LinkedIn', href: 'https://linkedin.com', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                                    ].map(({ label, href, icon }) => (
                                        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                                            className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#4338ca] border border-[#c7d2fe] hover:bg-[#6366f1] hover:text-white hover:border-[#6366f1] transition-all"
                                        >
                                            {icon}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="mt-12 rounded-2xl overflow-hidden border border-[#e2e8f0] h-[420px] shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                        <iframe
                            title="Flat Production location"
                            src="https://maps.google.com/maps?q=KK%2018%20Avenue,%20Kigali,%20Rwanda&z=15&output=embed"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full border-0"
                        />
                    </div>

                    {/* Bottom CTA strip */}
                    <div className="mt-10 rounded-2xl bg-[#111] p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <p className="text-white font-bold text-lg mb-1">Ready to start your project?</p>
                            <p className="text-white/55 text-sm">Our team is standing by to bring your vision to life.</p>
                        </div>
                        <a href={whatsappLink} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#111] text-sm font-bold transition-all hover:bg-[#f0f0f0] hover:-translate-y-px flex-shrink-0"
                        >
                            Book Now →
                        </a>
                    </div>
                </div>
            </div>

            <Footer />

            {/* Toast */}
            <div className={`toast fixed bottom-7 right-7 bg-white border border-[#e2e8f0] shadow-2xl px-5 py-4 rounded-2xl flex items-center gap-4 z-[2000] min-w-[260px]${showToast ? ' active' : ''}`}>
                <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] flex items-center justify-center text-[#10b981] text-xl font-bold flex-shrink-0">✓</div>
                <div>
                    <p className="text-[#0f172a] font-bold text-sm m-0">Message Sent!</p>
                    <p className="text-[#64748b] text-xs m-0 mt-0.5">We'll reply within 24 hours.</p>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
