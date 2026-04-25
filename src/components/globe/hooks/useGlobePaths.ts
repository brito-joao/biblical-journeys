import { useMemo } from "react";
import { TimelineEvent } from "@/types";

// Deterministic pseudo-random number generator
function pseudoRandom(seed: number) {
    const x = Math.sin(seed * 10000) * 10000;
    return x - Math.floor(x);
}

export function useGlobePaths(timelineData: TimelineEvent[]) {
    return useMemo(() => {
        const paths: { points: number[][], order: number }[] = [];

        // Generate a path connecting sequential events
        for (let i = 0; i < timelineData.length - 1; i++) {
            const start = timelineData[i];
            const end = timelineData[i + 1];

            const numSegments = 10; // Fewer segments for straighter look
            const points = [];

            for (let j = 0; j <= numSegments; j++) {
                const t = j / numSegments;
                // Linear interpolation of lat/lng
                const lat = start.lat + (end.lat - start.lat) * t;
                const lng = start.lng + (end.lng - start.lng) * t;
                const baseAlt = 0;

                points.push([lat, lng, baseAlt]);
            }

            paths.push({ points, order: start.order });
        }
        return paths;
    }, [timelineData]);
}
