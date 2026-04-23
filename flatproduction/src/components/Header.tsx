import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="site-header">
            <a className="site-brand" href="#hero">Flat<span className="header-brand-word header-accent-word">Production</span></a>
            <nav className="site-nav">
                <ul className="site-nav-list">
                    <li className="site-nav-item">
                        <a href="#hero">Home</a>
                    </li>
                    <li className="site-nav-item">
                        <a href="#gallery"><span className="header-accent-word">Gallery</span></a>
                    </li>
                    <li className="site-nav-item">
                        <a href="#about">About</a>
                    </li>
                    <li className="site-nav-item">
                        <a href="#services">Services</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;