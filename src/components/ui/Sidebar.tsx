"use client";

import { useTimeline } from "@/context/TimelineContext";
import EventCard from "@/components/ui/EventCard";
import { cn } from "@/lib/utils";

interface SidebarProps {
    className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
    const { activeEvent, activeEventIndex, setActiveEventIndex, timelineData } = useTimeline();

    const handleNext = () => {
        if (activeEventIndex < timelineData.length - 1) {
            setActiveEventIndex(activeEventIndex + 1);
        }
    };

    const handlePrev = () => {
        if (activeEventIndex > 0) {
            setActiveEventIndex(activeEventIndex - 1);
        }
    };

    return (
        <div className={cn(
            "pointer-events-auto relative flex w-full max-w-[95vw] md:max-w-sm flex-col gap-3 md:gap-5 p-4 md:p-7 explorer-card parchment-surface unfurl bg-[#f0e8d5]",
            "border border-[#c4952a]/60",
            "lantern-glow",
            className
        )}>
            {/* Rope-accent top border */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#9a7518] via-[#c4952a] to-[#9a7518]" />

            {/* Aged paper corner fold bottom-right */}
            <div 
                className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none"
                style={{
                    background: 'linear-gradient(135deg, transparent 50%, rgba(139,105,20,0.2) 50%)',
                    borderTop: '1px solid rgba(196,149,42,0.3)'
                }}
            />

            <EventCard
                event={activeEvent}
                onNext={handleNext}
                onPrev={handlePrev}
            />
        </div>
    );
}
