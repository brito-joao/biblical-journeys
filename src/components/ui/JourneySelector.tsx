"use client";

import { useTimeline, availableJourneys } from "@/context/TimelineContext";
import { useLanguage } from "@/hooks/useLanguage";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
// Make sure this path matches where you saved the AboutModal component!
import AboutModal from "@/components/ui/AboutModal";

const journeyIcons: Record<string, string> = {
    'jesus': '✝',
    'paul': '⚓',
    'david': '⚔',
    'exodus': '🌿',
    'abraham': '⛺',
};

export default function JourneySelector() {
    const { activeJourneyId, setActiveJourneyId } = useTimeline();
    const { language, setLanguage } = useLanguage();

    // States for dropdown and modal
    const [isOpen, setIsOpen] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const activeJourney = availableJourneys.find(j => j.id === activeJourneyId);

    // Check if the current translation is Portuguese to set the toggle state
    const isPt = language === "pt";

    const toggleLanguage = () => {
        setLanguage(isPt ? "en" : "pt");
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <div className="pointer-events-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 w-full md:max-w-xl mx-auto bg-[#f0e8d5] lantern-glow shadow-md md:shadow-xl relative explorer-card parchment-surface"
                style={{
                    borderTop: '3px solid #c4952a',
                    padding: '8px 16px',
                    borderBottomLeftRadius: '4px',
                    borderBottomRightRadius: '4px',
                }}>

                {/* Upper decorative edge rope line mapping */}
                <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c4952a] to-transparent" />

                {/* Title / Logo marker for Desktop */}
                <div className="hidden md:flex items-center gap-2 mr-2">
                    <span className="text-[#c4952a] text-lg">✦</span>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#6b4c28]" style={{ fontFamily: 'var(--font-merriweather, serif)' }}>
                        Biblical Journeys
                    </span>
                </div>

                {/* Controls Container: Dropdown + Language + About */}
                <div className="flex w-full md:w-auto items-center gap-2 md:gap-3">

                    {/* Journey Dropdown Menu */}
                    <div className="relative flex-1 md:w-64" ref={dropdownRef}>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full flex items-center justify-between bg-[#2c2015] text-[#e0b84a] px-3 md:px-4 py-2.5 border border-[#c4952a]/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_2px_2px_0_rgba(44,32,21,0.4)] transition-all active:translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_2px_2px_0_rgba(44,32,21,0.6)]"
                        >
                            <div className="flex items-center gap-2 truncate">
                                <span className="text-sm">{journeyIcons[activeJourney?.id || ''] ?? '◈'}</span>
                                <span className="text-[10px] md:text-xs font-bold tracking-[0.08em] uppercase truncate" style={{ fontFamily: 'var(--font-merriweather, serif)' }}>
                                    {activeJourney?.name}
                                </span>
                            </div>
                            <span className="text-[9px] ml-2 opacity-80 shrink-0">{isOpen ? '▲' : '▼'}</span>
                        </button>

                        {/* Dropdown List */}
                        {isOpen && (
                            <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-[#f0e8d5] border border-[#c4952a]/60 flex flex-col shadow-2xl z-50 overflow-hidden transform origin-top animate-in fade-in slide-in-from-top-2">
                                {availableJourneys.map((j) => (
                                    <button
                                        key={j.id}
                                        onClick={() => {
                                            setActiveJourneyId(j.id);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-[#c4952a]/20 last:border-b-0",
                                            activeJourneyId === j.id
                                                ? "bg-[#e8dcc0] text-[#2c2015]"
                                                : "text-[#6b4c28] hover:bg-[#e8dcc0]/50 hover:text-[#2c2015]"
                                        )}
                                    >
                                        <span className={cn("text-base", activeJourneyId === j.id ? "text-[#c4952a]" : "opacity-60")}>
                                            {journeyIcons[j.id] ?? '◈'}
                                        </span>
                                        <span className="text-[10px] font-bold tracking-[0.08em] uppercase" style={{ fontFamily: 'var(--font-merriweather, serif)' }}>
                                            {j.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Language Toggle Box slider */}
                    <button
                        onClick={toggleLanguage}
                        className={cn(
                            "relative flex flex-shrink-0 items-center w-[64px] md:w-[72px] h-8 rounded border transition-colors duration-300 overflow-hidden cursor-pointer shadow-inner",
                            isPt ? "bg-[#c4952a] border-[#b89947]" : "bg-[#2c2015] border-[#c4952a]/50"
                        )}
                        aria-label="Toggle language"
                    >
                        {/* Slider Puck */}
                        <div className={cn(
                            "absolute flex items-center justify-center w-[28px] md:w-8 h-[26px] bg-[#f0e8d5] rounded-[2px] transition-transform duration-300 shadow-md border border-[#c4952a]/40",
                            isPt ? "translate-x-[32px] md:translate-x-[37px]" : "translate-x-[3px]"
                        )}
                            style={{ zIndex: 2 }}>
                            <span className="text-[9px] md:text-[10px] font-bold text-[#2c2015] tracking-widest mt-px" style={{ fontFamily: 'var(--font-merriweather, serif)' }}>
                                {isPt ? "PT" : "EN"}
                            </span>
                        </div>

                        {/* Background Labels */}
                        <div className="absolute inset-0 flex justify-between items-center px-2 md:px-3" style={{ zIndex: 1 }}>
                            <span className={cn("text-[8px] md:text-[9px] font-bold tracking-widest transition-opacity duration-300", isPt ? "opacity-0" : "text-[#e0b84a] opacity-60")}>EN</span>
                            <span className={cn("text-[8px] md:text-[9px] font-bold tracking-widest transition-opacity duration-300", isPt ? "text-[#2c2015] opacity-60" : "opacity-0")}>PT</span>
                        </div>
                    </button>

                    {/* NEW: About Button */}
                    <button
                        onClick={() => setIsAboutOpen(true)}
                        className="flex-shrink-0 flex items-center justify-center h-8 px-2 md:px-3 rounded border transition-colors duration-200"
                        style={{
                            backgroundColor: 'transparent',
                            borderColor: 'rgba(196,149,42,0.6)',
                            color: '#6b4c28',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(196,149,42,0.1)'; e.currentTarget.style.color = '#2c2015'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#6b4c28'; }}
                    >
                        <span className="text-[9px] md:text-[10px] font-bold tracking-[0.08em] uppercase mt-px" style={{ fontFamily: 'var(--font-merriweather, serif)' }}>
                            {isPt ? "Sobre" : "About"}
                        </span>
                    </button>

                </div>
            </div>

            {/* The Modal */}
            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
        </>
    );
}