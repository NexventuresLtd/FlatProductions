import React from 'react';

const Clients: React.FC = () => {
    return (
        <section id="clients" className="clients-section">
            <div className="clients-header">
                <h2>Our Clients</h2>
                <p>
                    We work with brands, organizations, and creators who want visuals that feel sharp, memorable, and full of character. Every project is tailored to match the message, the audience, and the moment.
                </p>
            </div>
            <img className="clients-image" src="/clients.jpg" alt="Our clients" />
        </section>
    );
};

export default Clients;
