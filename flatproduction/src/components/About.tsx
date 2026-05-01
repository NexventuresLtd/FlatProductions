import React, { useEffect, useState } from 'react';
import { contentStore } from '../store/contentStore';

const About: React.FC = () => {
    const [about, setAbout] = useState(() => contentStore.read().about);

    useEffect(() => {
        const onUpdate = (c: any) => setAbout(c.about ?? { heading: '', body: '' });
        contentStore.onUpdate(onUpdate);
    }, []);

    return (
        <section className="about about-banner">
            <div className="about-overlay"></div>
            <div className="about-content">
                <p className="about-kicker">About Flat Productions</p>
                <h2>{about.heading}</h2>
                <p>{about.body}</p>
                <div className="about-meta">Based in Kigali - Shooting stories everywhere</div>
            </div>
        </section>
    );
};

export default About;