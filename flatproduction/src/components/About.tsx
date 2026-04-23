import React from 'react';

const About: React.FC = () => {
    return (
        <section className="about about-banner">
            <div className="about-overlay"></div>
            <div className="about-content">
                <h2>Where <span className="about-accent-word">Light Becomes Memory</span></h2>
                <p>
                    Every frame is crafted with patience, emotion, and intent, turning ordinary scenes into cinematic moments that feel personal, timeless, and alive.
                </p>
            </div>
        </section>
    );
};

export default About;