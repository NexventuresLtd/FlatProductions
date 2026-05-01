import React, { useState } from 'react';

const logoSrc = '/flat%20production.jpg.jpeg';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    return (
        <header className="site-header">
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
                        <a href="/" onClick={closeMenu}>Home</a>
                    </li>
                    <li className="site-nav-item">
                        <a href="/about" onClick={closeMenu}>About</a>
                    </li>
                    <li className="site-nav-item">
                        <a href="/gallery" onClick={closeMenu}>Gallery</a>
                    </li>
                    <li className="site-nav-item">
                        <a href="/portfolio" onClick={closeMenu}>Portfolio</a>
                    </li>
                    <li className="site-nav-item">
                        <a href="/contact" onClick={closeMenu}>Contact</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;