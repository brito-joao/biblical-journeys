"use client";

import { useTimeline } from "@/context/TimelineContext";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";

interface TimelineScrubberProps {
    className?: string;
}

export default function TimelineScrubber({ className }: TimelineScrubberProps) {
    const { activeEventIndex, setActiveEventIndex, timelineData } = useTimeline();
    const scrollRef = useRef<HTMLDivElement>(null);
    const activeRef = useRef<HTMLDivElement>(null);

    // Auto-scroll so the active stop is always centred in view
    useEffect(() => {
        if (activeRef.current && scrollRef.current) {
            activeRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
            });
        }
    }, [activeEventIndex]);

    const scrollBy = (delta: number) => {
        scrollRef.current?.scrollBy({ left: delta, behavior: 'smooth' });
    };

    const arrowStyle: React.CSSProperties = {
        flexShrink: 0,
        width: 36,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #e8dcc0 0%, #d6c8a8 100%)',
        border: 'none',
        borderRight: '1px solid rgba(196,149,42,0.35)',
        cursor: 'pointer',
        color: '#6b4c28',
        transition: 'background 0.15s',
    };

    return (
        <div
            className={cn("pointer-events-auto flex items-stretch relative", className)}
            style={{
                background: 'linear-gradient(180deg, #f0e8d5 0%, #e8dcc0 100%)',
                border: '1.5px solid rgba(196,149,42,0.6)',
                boxShadow: '0 -4px 20px rgba(44,32,21,0.2), 0 4px 20px rgba(44,32,21,0.15), inset 0 1px 0 rgba(224,184,74,0.2)',
                maxWidth: '100vw',
            }}
        >
            {/* Gold top accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c4952a]/60 to-transparent pointer-events-none" />

            {/* ◀ Scroll Left */}
            <button
                onClick={() => scrollBy(-200)}
                style={{ ...arrowStyle }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#e0c98a'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'linear-gradient(180deg, #e8dcc0 0%, #d6c8a8 100%)'; }}
                title="Scroll left"
            >
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                </svg>
            </button>

            {/* Scrollable track */}
            <div
                ref={scrollRef}
                className="flex items-center gap-0 overflow-x-auto"
                style={{
                    flex: 1,
                    scrollbarWidth: 'none',   /* Firefox */
                    msOverflowStyle: 'none',   /* IE */
                    WebkitOverflowScrolling: 'touch',
                }}
            >
                {/* Hide webkit scrollbar */}
                <style>{`.timeline-scroll::-webkit-scrollbar{display:none}`}</style>

                <div className="flex items-center gap-0 px-4 py-3">
                    {timelineData.map((stop, index) => {
                        const isActive = index === activeEventIndex;
                        const isPast = index < activeEventIndex;
                        
                        // Clean up the year string to fit better
                        const displayYear = stop.year.replace('c. ', '');

                        return (
                            <div
                                key={stop.order}
                                ref={isActive ? activeRef : undefined}
                                className="flex items-center"
                            >
                                <button
                                    onClick={() => setActiveEventIndex(index)}
                                    className="relative flex items-center justify-center text-[10px] font-bold tracking-[0.08em] transition-all whitespace-nowrap"
                                    style={{
                                        flexShrink: 0,
                                        height: 36,
                                        padding: '0 14px',
                                        fontFamily: 'var(--font-merriweather, serif)',
                                        background: isActive
                                            ? '#2c2015'
                                            : isPast
                                            ? 'rgba(156,120,60,0.25)'
                                            : 'rgba(216,200,168,0.6)',
                                        color: isActive ? '#e0b84a' : isPast ? '#9a7518' : '#8a6c3c',
                                        border: isActive
                                            ? '1.5px solid #c4952a'
                                            : isPast
                                            ? '1.5px solid rgba(154,117,24,0.5)'
                                            : '1.5px solid rgba(196,149,42,0.25)',
                                        borderRadius: 0,
                                        transform: isActive ? 'scale(1.12)' : 'scale(1)',
                                        boxShadow: isActive
                                            ? '2px 2px 0 rgba(44,32,21,0.4), 0 0 12px rgba(196,149,42,0.3)'
                                            : 'none',
                                        zIndex: isActive ? 10 : 1,
                                    }}
                                >
                                    {displayYear}
                                </button>

                                {index < timelineData.length - 1 && (
                                    <div
                                        style={{
                                            flexShrink: 0,
                                            width: 16,
                                            height: 2,
                                            background: index < activeEventIndex
                                                ? 'linear-gradient(90deg, #9a7518, #c4952a)'
                                                : 'rgba(196,149,42,0.2)',
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ▶ Scroll Right */}
            <button
                onClick={() => scrollBy(200)}
                style={{ ...arrowStyle, borderRight: 'none', borderLeft: '1px solid rgba(196,149,42,0.35)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#e0c98a'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'linear-gradient(180deg, #e8dcc0 0%, #d6c8a8 100%)'; }}
                title="Scroll right"
            >
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                </svg>
            </button>
        </div>
    );
}
