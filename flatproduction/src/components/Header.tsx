import React, { useEffect, useState } from 'react';

const logoSrc = '/logo.jpg';

const normalizePath = (path: string): string => path.replace(/\/+$/, '') || '/';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const currentPath = normalizePath(window.location.pathname);

    useEffect(() => {
        const handleScroll = (): void => {
            setIsScrolled(window.scrollY > 0);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = (): void => {
        setIsMenuOpen((prev) => !prev);
        if (!isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    };

    const closeMenu = (): void => {
        setIsMenuOpen(false);
        document.body.style.overflow = 'unset';
    };

    const isActive = (path: string): boolean => currentPath === normalizePath(path);

    return (
        <>
            <header className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 z-[1000] backdrop-blur-md border-b border-white/16 transition-all duration-300 ${isScrolled ? 'bg-black/20' : 'bg-[rgba(56,46,46,0.023)]'}`}>
                <a
                    className="flex items-center gap-3 z-[1002]"
                    href="/"
                    onClick={closeMenu}
                    aria-label="Flat Production home"
                >
                    <span className="inline-flex items-center justify-center w-11 h-11 bg-white text-black font-black text-[1.4rem] overflow-hidden rounded-lg" aria-hidden="true">
                        <img className="w-full h-full object-cover" src={logoSrc} alt="" />
                    </span>
                    <span className="text-white font-bold text-sm tracking-wide">Flat Production</span>
                </a>

                <button
                    type="button"
                    className={`flex flex-col gap-[5px] w-[30px] cursor-pointer bg-transparent border-0 text-white z-[1001] p-0 lg:hidden ${isMenuOpen ? 'is-open' : ''}`}
                    aria-label="Toggle navigation menu"
                    aria-controls="site-nav-list"
                    aria-expanded={isMenuOpen}
                    onClick={toggleMenu}
                >
                    <span className="menu-bar menu-bar-1 w-full" />
                    <span className="menu-bar menu-bar-2 w-full" />
                    <span className="menu-bar menu-bar-3 w-full" />
                </button>

                <nav className="hidden lg:flex">
                    <ul id="site-nav-list" className="list-none m-0 p-0 flex items-center gap-8">
                        <li>
                            <a href="/" onClick={closeMenu} aria-current={isActive('/') ? 'page' : undefined} className={`text-sm font-medium transition-opacity hover:opacity-100 ${isActive('/') ? 'text-white border-b border-white pb-0.5' : 'text-white/80'}`}>Home</a>
                        </li>
                        <li>
                            <a href="/about" onClick={closeMenu} aria-current={isActive('/about') ? 'page' : undefined} className={`text-sm font-medium transition-opacity hover:opacity-100 ${isActive('/about') ? 'text-white border-b border-white pb-0.5' : 'text-white/80'}`}>About</a>
                        </li>
                        <li>
                            <a href="/gallery" onClick={closeMenu} aria-current={isActive('/gallery') ? 'page' : undefined} className={`text-sm font-medium transition-opacity hover:opacity-100 ${isActive('/gallery') ? 'text-white border-b border-white pb-0.5' : 'text-white/80'}`}>Gallery</a>
                        </li>
                        <li>
                            <a href="/portfolio" onClick={closeMenu} aria-current={isActive('/portfolio') ? 'page' : undefined} className={`text-sm font-medium transition-opacity hover:opacity-100 ${isActive('/portfolio') ? 'text-white border-b border-white pb-0.5' : 'text-white/80'}`}>Portfolio</a>
                        </li>
                        <li>
                            <a href="/services" onClick={closeMenu} aria-current={isActive('/services') ? 'page' : undefined} className={`text-sm font-medium transition-opacity hover:opacity-100 ${isActive('/services') ? 'text-white border-b border-white pb-0.5' : 'text-white/80'}`}>Services</a>
                        </li>
                        <li>
                            <a href="/contact" onClick={closeMenu} aria-current={isActive('/contact') ? 'page' : undefined} className={`text-sm font-medium transition-opacity hover:opacity-100 ${isActive('/contact') ? 'text-white border-b border-white pb-0.5' : 'text-white/80'}`}>Contact</a>
                        </li>
                    </ul>
                </nav>
            </header>

            <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
                <ul className="list-none p-0 m-0 flex flex-col items-center gap-8">
                    <li>
                        <a href="/" onClick={closeMenu} aria-current={isActive('/') ? 'page' : undefined} className={`text-white text-2xl font-bold tracking-tight transition-opacity hover:opacity-70 ${isActive('/') ? 'opacity-50' : ''}`}>Home</a>
                    </li>
                    <li>
                        <a href="/about" onClick={closeMenu} aria-current={isActive('/about') ? 'page' : undefined} className={`text-white text-2xl font-bold tracking-tight transition-opacity hover:opacity-70 ${isActive('/about') ? 'opacity-50' : ''}`}>About</a>
                    </li>
                    <li>
                        <a href="/gallery" onClick={closeMenu} aria-current={isActive('/gallery') ? 'page' : undefined} className={`text-white text-2xl font-bold tracking-tight transition-opacity hover:opacity-70 ${isActive('/gallery') ? 'opacity-50' : ''}`}>Gallery</a>
                    </li>
                    <li>
                        <a href="/portfolio" onClick={closeMenu} aria-current={isActive('/portfolio') ? 'page' : undefined} className={`text-white text-2xl font-bold tracking-tight transition-opacity hover:opacity-70 ${isActive('/portfolio') ? 'opacity-50' : ''}`}>Portfolio</a>
                    </li>
                    <li>
                        <a href="/services" onClick={closeMenu} aria-current={isActive('/services') ? 'page' : undefined} className={`text-white text-2xl font-bold tracking-tight transition-opacity hover:opacity-70 ${isActive('/services') ? 'opacity-50' : ''}`}>Services</a>
                    </li>
                    <li>
                        <a href="/contact" onClick={closeMenu} aria-current={isActive('/contact') ? 'page' : undefined} className={`text-white text-2xl font-bold tracking-tight transition-opacity hover:opacity-70 ${isActive('/contact') ? 'opacity-50' : ''}`}>Contact</a>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Header;
