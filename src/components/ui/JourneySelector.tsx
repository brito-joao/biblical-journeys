"use client";

import { useTimeline, availableJourneys } from "@/context/TimelineContext";

const journeyIcons: Record<string, string> = {
    'jesus': '✝',
    'paul': '⚓',
    'david': '⚔',
    'exodus': '🌿',
};

export default function JourneySelector() {
    const { activeJourneyId, setActiveJourneyId } = useTimeline();

    return (
        <div className="pointer-events-auto flex bg-[#f0e8d5] lantern-glow border-t-[3px] border-t-[#c4952a]" 
             style={{ borderTop: '3px solid', borderTopColor: '#c4952a' }}>
            {/* Decorative top rope line */}
            <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c4952a] to-transparent" />
            
            {availableJourneys.map((j, i) => {
                const isActive = activeJourneyId === j.id;
                return (
                    <button
                        key={j.id}
                        onClick={() => setActiveJourneyId(j.id)}
                        className={`relative flex flex-1 md:flex-none items-center justify-center gap-1.5 md:gap-2 px-2 md:px-5 py-2 md:py-3 text-[10px] md:text-sm font-bold tracking-[0.05em] md:tracking-[0.08em] transition-all duration-200 border-r border-[#d6c8a8] last:border-r-0 ${
                            isActive
                                ? 'bg-[#2c2015] text-[#e0b84a]'
                                : 'text-[#6b4c28] hover:text-[#2c2015] hover:bg-[#e8dcc0]/70'
                        }`}
                        style={{ fontFamily: 'var(--font-merriweather, serif)' }}
                    >
                        {/* Icon */}  
                        <span className={`text-[12px] md:text-base leading-none ${isActive ? 'text-[#c4952a]' : 'opacity-60'}`}>
                            {journeyIcons[j.id] ?? '◈'}
                        </span>
                        <span>{j.name}</span>

                        {/* Active underline ink stroke */}
                        {isActive && (
                            <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-[#c4952a] to-transparent" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
