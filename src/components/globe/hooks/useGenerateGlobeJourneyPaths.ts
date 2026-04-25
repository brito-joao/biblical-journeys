"use client";

import { useMemo } from "react";
import { TimelineEvent } from "@/types";

interface ArcDatum {
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    order: number;
}

/**
 * Generates flat arc data for react-globe.gl's arcsData prop.
 * Only includes arcs up to (but not including) the currently active event index.
 * arcAltitudeAutoScale={0} on the Globe keeps these perfectly flush with the surface,
 * so endpoint coordinates match city marker positions exactly.
 */
export function useGenerateGlobeJourneyPaths(
    timelineData: TimelineEvent[],
    activeEventIndex: number
): ArcDatum[] {
    return useMemo(() => {
        const arcs: ArcDatum[] = [];
        // Draw arcs from first city up to the active city (exclusive of future legs)
        const limit = Math.min(activeEventIndex, timelineData.length - 1);
        for (let i = 0; i < limit; i++) {
            const start = timelineData[i];
            const end = timelineData[i + 1];
            if (start && end) {
                arcs.push({
                    startLat: start.lat,
                    startLng: start.lng,
                    endLat: end.lat,
                    endLng: end.lng,
                    order: start.order,
                });
            }
        }
        return arcs;
    }, [timelineData, activeEventIndex]);
}
