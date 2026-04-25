"use client";

import { useEffect, useRef } from "react";

/**
 * Autoplay hook — advances the active event index on a timer.
 * Returns controls so the UI can start/pause/change speed.
 */
export function useJourneyAutoplay(
    activeEventIndex: number,
    setActiveEventIndex: (i: number) => void,
    totalEvents: number,
    isPlaying: boolean,
    speedMs: number
) {
    const timer = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (timer.current) clearInterval(timer.current);
        if (!isPlaying) return;

        timer.current = setInterval(() => {
            setActiveEventIndex(
                activeEventIndex >= totalEvents - 1 ? 0 : activeEventIndex + 1
            );
        }, speedMs);

        return () => {
            if (timer.current) clearInterval(timer.current);
        };
    }, [isPlaying, activeEventIndex, setActiveEventIndex, totalEvents, speedMs]);
}
