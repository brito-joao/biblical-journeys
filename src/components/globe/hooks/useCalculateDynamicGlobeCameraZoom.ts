import { useEffect, MutableRefObject, useRef } from "react";
import { GlobeMethods } from "react-globe.gl";
import { TimelineEvent } from "@/types";

export function useCalculateDynamicGlobeCameraZoom(
    globeRef: MutableRefObject<GlobeMethods | undefined>,
    activeEvent: TimelineEvent | null,
    timelineData: TimelineEvent[]
) {
    const previousJourneyRef = useRef<number | null>(null);

    useEffect(() => {
        if (globeRef.current && activeEvent && timelineData && timelineData.length > 0) {
            
            // Check if we switched to a new journey vs moving natively across the same timeline
            const isNewJourney = previousJourneyRef.current !== timelineData.length;
            previousJourneyRef.current = timelineData.length;

            let targetAltitude = globeRef.current.pointOfView().altitude;
            
            // Recompute boundary clamps only if the user jumped strictly to a new journey!
            if (isNewJourney) {
                const lats = timelineData.map(d => d.lat).sort((a, b) => a - b);
                const lngs = timelineData.map(d => d.lng).sort((a, b) => a - b);
                
                const q1Lat = lats[Math.floor(lats.length * 0.1)];
                const q9Lat = lats[Math.floor(lats.length * 0.9)];
                const q1Lng = lngs[Math.floor(lngs.length * 0.1)];
                const q9Lng = lngs[Math.floor(lngs.length * 0.9)];
                
                const latSpread = Math.abs(q9Lat - q1Lat);
                const lngSpread = Math.abs(q9Lng - q1Lng);
                const maxSpread = Math.max(latSpread, lngSpread);
                
                let dynamicAltitude = (maxSpread * 0.03) + 0.05;
                dynamicAltitude = Math.min(Math.max(dynamicAltitude, 0.05), 1.2);
                targetAltitude = dynamicAltitude;
            }

            // Move camera safely towards current active step targeting fixed zoom!
            setTimeout(() => {
                globeRef.current?.pointOfView({
                    lat: activeEvent.lat,
                    lng: activeEvent.lng,
                    altitude: targetAltitude
                }, 1200);
            }, 100);
        }
    }, [activeEvent, globeRef, timelineData]);
}
