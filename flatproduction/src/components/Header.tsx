import React, { useEffect, useState } from 'react';

const logoSrc = '/flat%20production.jpg.jpeg';

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
        <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
            <a className="site-brand" href="/" onClick={closeMenu} aria-label="Flat Production home">
                <span className="site-brand-badge" aria-hidden="true">
                    <img className="site-brand-logo" src={logoSrc} alt="" />
                </span>
                <span className="site-brand-text">Flat Production</span>
            </a>

            <button
                type="button"
                className={`menu-toggle ${isMenuOpen ? 'is-open' : ''}`}
                aria-label="Toggle navigation menu"
                aria-controls="site-nav-list"
                aria-expanded={isMenuOpen}
                onClick={toggleMenu}
            >
                <span className="menu-toggle-bar" />
                <span className="menu-toggle-bar" />
                <span className="menu-toggle-bar" />
            </button>

            <nav className={`site-nav ${isMenuOpen ? 'is-open' : ''}`}>
                <ul id="site-nav-list" className="site-nav-list">
                    <li className="site-nav-item">
                        <a href="/" onClick={closeMenu} className={isActive('/') ? 'is-active' : ''} aria-current={isActive('/') ? 'page' : undefined}>Home</a>
                    </li>
                    <li className="site-nav-item">
                        <a href="/about" onClick={closeMenu} className={isActive('/about') ? 'is-active' : ''} aria-current={isActive('/about') ? 'page' : undefined}>About</a>
                    </li>
                    <li className="site-nav-item">
                        <a href="/gallery" onClick={closeMenu} className={isActive('/gallery') ? 'is-active' : ''} aria-current={isActive('/gallery') ? 'page' : undefined}>Gallery</a>
                    </li>
                    <li className="site-nav-item">
                        <a href="/portfolio" onClick={closeMenu} className={isActive('/portfolio') ? 'is-active' : ''} aria-current={isActive('/portfolio') ? 'page' : undefined}>Portfolio</a>
                    </li>
                    <li className="site-nav-item">
                        <a href="/services" onClick={closeMenu} className={isActive('/services') ? 'is-active' : ''} aria-current={isActive('/services') ? 'page' : undefined}>Services</a>
                    </li>
                    <li className="site-nav-item">
                        <a href="/contact" onClick={closeMenu} className={isActive('/contact') ? 'is-active' : ''} aria-current={isActive('/contact') ? 'page' : undefined}>Contact</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;