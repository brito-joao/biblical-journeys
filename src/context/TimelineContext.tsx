"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { TimelineEvent } from "@/types";
import { availableJourneys, Journey } from "@/data";

export { availableJourneys };
export type { Journey };

interface TimelineContextType {
    activeJourneyId: string;
    setActiveJourneyId: (id: string) => void;
    activeEventIndex: number;
    setActiveEventIndex: (index: number) => void;
    activeJourney: Journey;
    activeEvent: TimelineEvent;
    timelineData: TimelineEvent[];
}

const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export function TimelineProvider({ children }: { children: ReactNode }) {
    const [activeJourneyId, setActiveJourneyId] = useState(availableJourneys[0].id);
    const [activeEventIndex, setActiveEventIndex] = useState(0);

    const activeJourney = availableJourneys.find((j) => j.id === activeJourneyId) || availableJourneys[0];
    const timelineData = activeJourney.data;
    const activeEvent = timelineData[activeEventIndex] || timelineData[0];

    // Reset to first event whenever journey changes
    const updateJourney = (id: string) => {
        setActiveJourneyId(id);
        setActiveEventIndex(0);
    };

    return (
        <TimelineContext.Provider
            value={{
                activeJourneyId,
                setActiveJourneyId: updateJourney,
                activeEventIndex,
                setActiveEventIndex,
                activeJourney,
                activeEvent,
                timelineData,
            }}
        >
            {children}
        </TimelineContext.Provider>
    );
}

export function useTimeline() {
    const context = useContext(TimelineContext);
    if (context === undefined) {
        throw new Error("useTimeline must be used within a TimelineProvider");
    }
    return context;
}
