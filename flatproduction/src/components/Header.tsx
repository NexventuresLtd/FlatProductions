import React, { useState } from 'react';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Use current path to determine active link (optional but helpful for styling)
    const currentPath = window.location.pathname;
    
    const homeHref = '/';
    const aboutHref = '/about';
    const galleryHref = '/gallery';
    const portfolioHref = '/portfolio';
    const contactHref = '/contact';
    const servicesHref = currentPath === '/about' || currentPath === '/gallery' || currentPath === '/portfolio' || currentPath === '/contact' ? '/#services' : '#services';

    const toggleMenu = (): void => {
        setIsMenuOpen((prev) => !prev);
        // RESPONSIVENESS FIX: Lock body scroll when menu opens on mobile
        if (!isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    };

    const closeMenu = (): void => {
        setIsMenuOpen(false);
        // Ensure scroll is re-enabled
        document.body.style.overflow = 'unset';
    };

    return (
        <header className="site-header">
            <a className="site-brand" href={homeHref} onClick={closeMenu}>Flat<span className="header-brand-word header-accent-word">Production</span></a>
            
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
                        <a href={homeHref} onClick={closeMenu}>Home</a>
                    </li>
                    <li className="site-nav-item">
                        <a href={aboutHref} onClick={closeMenu}>About</a>
                    </li>
                    <li className="site-nav-item">
                        <a href={galleryHref} onClick={closeMenu}>Gallery</a>
                    </li>
                    <li className="site-nav-item">
                        <a href={portfolioHref} onClick={closeMenu}>Portfolio</a>
                    </li>
                    <li className="site-nav-item">
                        <a href={contactHref} onClick={closeMenu}>Contact</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;