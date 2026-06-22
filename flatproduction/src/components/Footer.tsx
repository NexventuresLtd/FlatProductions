import React from 'react';

const logoSrc = '/flat%20production.jpg.jpeg';

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#0a0a0a] text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 pb-10 border-b border-white/10">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="inline-flex items-center justify-center w-10 h-10 bg-white overflow-hidden rounded-lg flex-shrink-0" aria-hidden="true">
                            <img className="w-full h-full object-cover" src={logoSrc} alt="" />
                        </span>
                        <h3 className="text-white font-bold text-base m-0">Flat Production</h3>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mt-0">Creative storytelling through photography, video, design, and digital experiences.</p>
                </div>
                <div>
                    <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Services</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-2">
                        <li className="text-gray-400 text-sm">Photography &amp; Video Production</li>
                        <li className="text-gray-400 text-sm">Live Streaming &amp; Feed</li>
                        <li className="text-gray-400 text-sm">Website Design</li>
                        <li className="text-gray-400 text-sm">Design, Printing &amp; Branding</li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Quick Links</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-2">
                        <li><a href="/" className="text-gray-400 text-sm transition-opacity hover:opacity-100 hover:text-white">Home</a></li>
                        <li><a href="/about" className="text-gray-400 text-sm transition-opacity hover:opacity-100 hover:text-white">About</a></li>
                        <li><a href="/gallery" className="text-gray-400 text-sm transition-opacity hover:opacity-100 hover:text-white">Gallery</a></li>
                        <li><a href="/portfolio" className="text-gray-400 text-sm transition-opacity hover:opacity-100 hover:text-white">Portfolio</a></li>
                        <li><a href="/services" className="text-gray-400 text-sm transition-opacity hover:opacity-100 hover:text-white">Services</a></li>
                        <li><a href="/contact" className="text-gray-400 text-sm transition-opacity hover:opacity-100 hover:text-white">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Socials</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-2">
                        <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm transition-opacity hover:opacity-100 hover:text-white">Instagram</a></li>
                        <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm transition-opacity hover:opacity-100 hover:text-white">YouTube</a></li>
                        <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm transition-opacity hover:opacity-100 hover:text-white">LinkedIn</a></li>
                        <li><a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm transition-opacity hover:opacity-100 hover:text-white">X</a></li>
                    </ul>
                </div>
                <div>
                    <div className="flex flex-col gap-3">
                        <a className="block px-4 py-3 rounded-lg border border-white/20 text-white text-sm font-semibold text-center transition-colors hover:bg-white hover:text-black" href="mailto:info@flatproduction.com">Book Us</a>
                        <a className="block px-4 py-3 rounded-lg border border-white/20 text-white text-sm font-semibold text-center transition-colors hover:bg-white hover:text-black" href="mailto:support@flatproduction.com">Contact Support</a>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 pt-6 text-center">
                <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Flat Production. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
