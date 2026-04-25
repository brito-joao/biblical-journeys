"use client";

import { useTimeline, availableJourneys } from "@/context/TimelineContext";

export default function Header() {
    const { activeJourneyId, setActiveJourneyId } = useTimeline();

    return (
        <header className="pointer-events-auto absolute top-0 left-0 w-full p-6 md:p-8 z-20 flex justify-between items-center bg-gradient-to-b from-[#f8f5ee]/90 to-transparent">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-[#8b251e] border-2 border-[#b89947] flex items-center justify-center text-[#f8f5ee] font-serif italic text-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_4px_10px_rgba(62,50,34,0.3)]">
                    B
                </div>
                <h1 className="font-serif text-2xl font-bold tracking-widest text-[#3e3222] drop-shadow-sm uppercase mt-1">
                    Biblical Journeys
                </h1>
            </div>

            <div className="flex bg-[#f8f5ee]/90 backdrop-blur-md rounded-full shadow-[0_4px_15px_rgba(62,50,34,0.1)] border-2 border-[#d6b45a]/60 p-1 items-center">
                {availableJourneys.map(j => (
                    <button
                        key={j.id}
                        onClick={() => setActiveJourneyId(j.id)}
                        className={`px-5 py-2 rounded-full text-sm font-bold tracking-wide transition-all ${activeJourneyId === j.id
                            ? 'bg-[#3e3222] text-[#f8f5ee] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.5)]'
                            : 'text-[#786348] hover:text-[#3e3222] hover:bg-[#e3d8c4]'
                            }`}
                    >
                        {j.name}
                    </button>
                ))}
            </div>
        </header>
    );
}
