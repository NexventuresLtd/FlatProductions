import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-column footer-brand">
                    <h3>Flat Production</h3>
                    <p>Creative storytelling through photography, video, design, and digital experiences.</p>
                </div>
                <div className="footer-column">
                    <h4>Services</h4>
                    <ul>
                        <li>Photography &amp; Video Production</li>
                        <li>Live Streaming &amp; Feed</li>
                        <li>Website Design</li>
                        <li>Design, Printing &amp; Branding</li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Links</h4>
                    <ul>
                        <li><a href="#hero">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#services">Services</a></li>
                        <li><a href="#team">Team</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Socials</h4>
                    <ul>
                        <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                        <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a></li>
                        <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                        <li><a href="https://x.com" target="_blank" rel="noopener noreferrer">X</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <div className="footer-contact-actions">
                        <a className="footer-contact-card" href="mailto:info@flatproduction.com">Contact</a>
                        <a className="footer-contact-card" href="mailto:support@flatproduction.com">Contact Support</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Flat Production. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;