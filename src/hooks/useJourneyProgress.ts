"use client";

import { useState, useRef, useLayoutEffect } from "react";

interface JourneyProgress {
    [journeyId: string]: number[];
}

const STORAGE_KEY = "bible_map_progress";

function loadFromStorage(): JourneyProgress {
    if (typeof window === "undefined") return {};
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
}

export function useJourneyProgress(journeyId: string, activeEventIndex: number) {
    const [progress, setProgress] = useState<JourneyProgress>(loadFromStorage);
    const prevIndexRef = useRef<number>(-1);

    // Only update when the event index actually changes
    useLayoutEffect(() => {
        if (prevIndexRef.current === activeEventIndex) return;
        prevIndexRef.current = activeEventIndex;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProgress(prev => {
            const current = prev[journeyId] || [];
            if (current.includes(activeEventIndex)) return prev;
            const next = { ...prev, [journeyId]: [...current, activeEventIndex] };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, [journeyId, activeEventIndex]);

    const getCompletion = (jId: string, totalEvents: number) => {
        const visited = progress[jId]?.length || 0;
        return Math.round((visited / totalEvents) * 100);
    };

    return { progress, getCompletion };
}
