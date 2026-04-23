import React from 'react';

const Team: React.FC = () => {
    const team = [
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

    return (
        <section id="team" className="team-section">
            <div className="team-header">
                <h2>Our Team</h2>
            </div>
            <div className="team-grid">
                {team.map((member) => (
                    <article className="team-card" key={member.name}>
                        <img
                            className="team-image"
                            src={member.image}
                            alt={member.name}
                            style={{ objectPosition: member.position }}
                        />
                        <div className="team-copy">
                            <h3>{member.name}</h3>
                            <p>{member.role}</p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default Team;
