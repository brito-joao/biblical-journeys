import { useEffect, MutableRefObject } from "react";
import { GlobeMethods } from "react-globe.gl";
import { TimelineEvent } from "@/types";

export function useGlobeCamera(
    globeRef: MutableRefObject<GlobeMethods | undefined>,
    activeEvent: TimelineEvent,
    timelineData: TimelineEvent[]
) {
    useEffect(() => {
        if (globeRef.current && activeEvent && timelineData && timelineData.length > 0) {
            // Calculate Journey Spread to fit the entire journey dynamically
            const lats = timelineData.map(d => d.lat).sort((a, b) => a - b);
            const lngs = timelineData.map(d => d.lng).sort((a, b) => a - b);
            
            // Eliminate outliers to prevent a single weird point from destroying bounds
            const q1Lat = lats[Math.floor(lats.length * 0.1)];
            const q9Lat = lats[Math.floor(lats.length * 0.9)];
            const q1Lng = lngs[Math.floor(lngs.length * 0.1)];
            const q9Lng = lngs[Math.floor(lngs.length * 0.9)];
            
            const latSpread = Math.abs(q9Lat - q1Lat);
            const lngSpread = Math.abs(q9Lng - q1Lng);
            const maxSpread = Math.max(latSpread, lngSpread);
            
            // Re-calibrate degree variance to a dynamic altitude clamping that enables true zoom into very tight regions!
            let dynamicAltitude = (maxSpread * 0.05) + 0.1;
            
            // Allow far tighter minimal zoom (0.15) for geographically compact journeys (Jesus), 
            // capping safely before infinite zooms (1.2)
            dynamicAltitude = Math.min(Math.max(dynamicAltitude, 0.15), 1.2);

            // Small timeout ensures the globe is ready to receive pointOfView
            setTimeout(() => {
                globeRef.current?.pointOfView({
                    // Offset camera positioning slightly to keep the active point in visual harmony with the UI overlay
                    lat: activeEvent.lat,
                    lng: activeEvent.lng,
                    altitude: dynamicAltitude
                }, 1200);
            }, 100);
        }
    }, [activeEvent, globeRef, timelineData]);
}
