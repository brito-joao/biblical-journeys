"use client";

import { useState } from "react";
import { useTimeline } from "@/context/TimelineContext";
import { useJourneyAutoplay } from "@/components/globe/hooks/useJourneyAutoplay";

export default function AutoplayControls() {
    const { activeEventIndex, setActiveEventIndex, timelineData } = useTimeline();
    const [isPlaying, setIsPlaying] = useState(false);
    const [speedMs, setSpeedMs] = useState(2500);

    useJourneyAutoplay(activeEventIndex, setActiveEventIndex, timelineData.length, isPlaying, speedMs);

    return (
        <div 
            className="pointer-events-auto flex items-center gap-2 md:gap-3 px-3 md:px-5 py-1.5 md:py-2.5 relative"
            style={{
                background: 'linear-gradient(180deg, #f0e8d5 0%, #e8dcc0 100%)',
                border: '1.5px solid rgba(196,149,42,0.55)',
                boxShadow: '0 4px 16px rgba(44,32,21,0.2), inset 0 1px 0 rgba(224,184,74,0.15)',
            }}
        >
            {/* Gold top accent */}
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#c4952a]/50 to-transparent" />

            {/* Play/Pause button */}
            <button
                onClick={() => setIsPlaying(p => !p)}
                className="flex items-center gap-2 text-[#6b4c28] hover:text-[#2c2015] transition-colors font-bold text-[12px] tracking-[0.15em] uppercase"
                style={{ fontFamily: 'var(--font-merriweather, serif)' }}
                title={isPlaying ? "Pause journey" : "Autoplay journey"}
            >
                {isPlaying ? (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="text-[#c4952a]">
                            <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z" />
                        </svg>
                        Pause
                    </>
                ) : (
                    <>
                        <span className="text-[#c4952a]">▶</span>
                        Autoplay
                    </>
                )}
            </button>

            <div className="h-4 w-px" style={{ background: 'rgba(196,149,42,0.35)' }} />

            <select
                value={speedMs}
                onChange={e => setSpeedMs(Number(e.target.value))}
                className="text-[#6b4c28] text-[11px] font-bold tracking-wide border-none outline-none cursor-pointer uppercase"
                style={{ background: 'transparent', fontFamily: 'var(--font-merriweather, serif)' }}
            >
                <option value={1500}>Fast</option>
                <option value={2500}>Normal</option>
                <option value={4000}>Slow</option>
            </select>
        </div>
    );
}
