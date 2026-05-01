import React, { useEffect, useState } from 'react';
import { contentStore } from '../store/contentStore';

const Team: React.FC = () => {
    const defaultTeam = [
        {
            image: '/kadaff.jpg',
            name: 'KADAffI PRO',
            role: 'Ceo & Founder',
            position: '50% 18%',
        },
        {
            image: '/ike.jpg',
            name: 'Kelly',
            role: 'Graphics Designer',
            position: '50% 20%',
        },
        {
            image: '/chance.jpg',
            name: 'Chancelline niyotugendana',
            role: 'Secretary & photographer',
            position: '50% 22%',
        },
        {
            image: '/chelsea.jpg',
            name: 'anura',
            role: 'Intern',
            position: '50% 18%',
        },
        {
            image: '/onekelly.jpg',
            name: 'ishimwe samuel kelly',
            role: 'GRAPHICS DESIGNER',
            position: '50% 20%',
        },
    ];

    const [team, setTeam] = useState(() => contentStore.read().team.length ? contentStore.read().team : defaultTeam);

    useEffect(()=>{
      const onUpdate = (c:any) => setTeam((c.team && c.team.length) ? c.team : defaultTeam);
      contentStore.onUpdate(onUpdate);
    },[]);

    return (
        <section id="team" className="team-section">
            <div className="team-header">
                <p className="section-tag">Creative Crew</p>
                <h2>Our Team</h2>
                <p className="team-intro">
                    Small team, big energy. We blend strategy, storytelling, and style to shape every production.
                </p>
            </div>
            <div className="team-grid">
                {team.map((member:any) => (
                    <article className="team-card" key={member.name}>
                        <img
                            className="team-image"
                            src={member.photo ?? member.image}
                            alt={member.name}
                            style={{ objectPosition: member.position ?? '50% 20%' }}
                        />
                        <div className="team-copy">
                            <h3>{member.name}</h3>
                            <p className="team-role">{member.role}</p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default Team;
