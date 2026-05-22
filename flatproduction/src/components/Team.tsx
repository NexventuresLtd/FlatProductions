import React, { useEffect, useState } from 'react';
import { contentStore } from '../store/contentStore';

type TeamMember = ReturnType<typeof contentStore.read>['team'][number];

const Team: React.FC = () => {
    const defaultTeam: TeamMember[] = [
        {
            id: 'team-1',
            photo: '/kadaff.jpg',
            name: 'KADAffI PRO',
            role: 'Ceo & Founder',
            position: '50% 18%',
            bio: 'Leads the creative direction and keeps every project focused, sharp, and client-centered.',
        },
        {
            id: 'team-2',
            photo: '/ike.jpg',
            name: 'Kelly',
            role: 'Graphics Designer',
            position: '50% 20%',
            bio: 'Shapes visual identities, layouts, and brand assets with a clean, modern style.',
        },
        {
            id: 'team-3',
            photo: '/chance.jpg',
            name: 'Chancelline niyotugendana',
            role: 'Secretary & photographer',
            position: '50% 22%',
            bio: 'Keeps the studio organized while capturing moments with a calm eye for detail.',
        },
        {
            id: 'team-4',
            photo: '/chelsea.jpg',
            name: 'anura',
            role: 'Intern',
            position: '50% 18%',
            bio: 'Supports the team across shoots, edits, and day-to-day production work.',
        },
        {
            id: 'team-5',
            photo: '/onekelly.jpg',
            name: 'ishimwe samuel kelly',
            role: 'GRAPHICS DESIGNER',
            position: '50% 20%',
            bio: 'Brings bold concepts to life through graphics, branding, and polished design details.',
        },
    ];

    const [team, setTeam] = useState<TeamMember[]>(() => (contentStore.read().team.length ? contentStore.read().team : defaultTeam));
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

    useEffect(() => {
        const onUpdate = (c: any) => setTeam((c.team && c.team.length) ? c.team : defaultTeam);
        contentStore.onUpdate(onUpdate);
    }, []);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeBio();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    const closeBio = () => setSelectedMember(null);

    const openBio = (member: TeamMember) => setSelectedMember(member);

    const getBioText = (member: TeamMember) => {
        if (member.bio && member.bio.trim()) return member.bio;
        return 'A creative member of the Flat Productions team who helps bring projects to life with skill, focus, and attention to detail.';
    };

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
                {team.map((member) => (
                    <article className="team-card" key={member.name}>
                        <button
                            type="button"
                            className="team-image-button"
                            onClick={() => openBio(member)}
                            aria-label={`Open bio for ${member.name}`}
                        >
                            <img
                                className="team-image"
                                src={member.photo}
                                alt={member.name}
                                style={{ objectPosition: member.position ?? '50% 20%' }}
                            />
                        </button>
                        <div className="team-copy">
                            <h3>{member.name}</h3>
                            <p className="team-role">{member.role}</p>
                            <p className="team-bio-preview">Click the image to read bio</p>
                        </div>
                    </article>
                ))}
            </div>

            {selectedMember && (
                <div className="team-bio-modal" role="dialog" aria-modal="true" aria-labelledby="team-bio-title" onClick={closeBio}>
                    <div className="team-bio-card" onClick={(event) => event.stopPropagation()}>
                        <button type="button" className="team-bio-close" onClick={closeBio} aria-label="Close bio popup">
                            ×
                        </button>
                        <img
                            className="team-bio-image"
                            src={selectedMember.photo}
                            alt={selectedMember.name}
                            style={{ objectPosition: selectedMember.position ?? '50% 20%' }}
                        />
                        <h3 id="team-bio-title">{selectedMember.name}</h3>
                        <p className="team-bio-role">{selectedMember.role}</p>
                        <p className="team-bio-text">{getBioText(selectedMember)}</p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Team;
