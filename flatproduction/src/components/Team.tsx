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
        return contentStore.onUpdate(onUpdate);
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
        <section id="team" className="py-16 px-5 bg-white text-[#111]">
            <div className="text-center mb-10 max-w-[760px] mx-auto">
                <p className="inline-block mb-4 px-4 py-1.5 rounded-full border border-[#111] bg-[#111] text-white uppercase tracking-[0.15em] text-[0.75rem] font-extrabold">Creative Crew</p>
                <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-3">Our Team</h2>
                <p className="text-[#555] text-base leading-relaxed">
                    Small team, big energy. We blend strategy, storytelling, and style to shape every production.
                </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-[1200px] mx-auto">
                {team.map((member) => (
                    <article className="flex flex-col items-center text-center p-5" key={member.name}>
                        <button
                            type="button"
                            className="w-full cursor-pointer border-0 p-0 bg-transparent rounded-xl overflow-hidden mb-3 block"
                            onClick={() => openBio(member)}
                            aria-label={`Open bio for ${member.name}`}
                        >
                            <img
                                className="w-full h-[260px] object-cover rounded-xl transition-all duration-300 hover:scale-105"
                                src={member.photo}
                                alt={member.name}
                                style={{ objectPosition: member.position ?? '50% 20%' }}
                            />
                        </button>
                        <div>
                            <h3 className="text-[#111] font-bold text-sm mb-0.5">{member.name}</h3>
                            <p className="text-[#888] text-xs font-semibold uppercase tracking-wide mb-1">{member.role}</p>
                            <p className="text-[#aaa] text-xs">Click the image to read bio</p>
                        </div>
                    </article>
                ))}
            </div>

            {selectedMember && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center p-5 bg-black/60 animate-bio-backdrop"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="team-bio-title"
                    onClick={closeBio}
                >
                    <div
                        className="relative bg-white rounded-2xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-2xl animate-bio-card"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border border-[rgba(17,17,17,0.14)] text-[#111] text-xl leading-none cursor-pointer bg-transparent hover:bg-[#f5f5f5] transition-colors"
                            onClick={closeBio}
                            aria-label="Close bio popup"
                        >
                            ×
                        </button>
                        <img
                            className="w-full h-[260px] object-cover rounded-xl mb-4"
                            src={selectedMember.photo}
                            alt={selectedMember.name}
                            style={{ objectPosition: selectedMember.position ?? '50% 20%' }}
                        />
                        <h3 id="team-bio-title" className="text-[#111] font-bold text-lg mb-0.5">{selectedMember.name}</h3>
                        <p className="text-[#888] text-xs font-semibold uppercase tracking-wide mb-4">{selectedMember.role}</p>
                        <p className="text-[#444] text-sm leading-relaxed">{getBioText(selectedMember)}</p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Team;
