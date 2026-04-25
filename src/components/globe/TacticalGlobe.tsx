"use client";
import { useRef, useState, useEffect } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useTimeline } from "@/context/TimelineContext";
import { TimelineEvent } from "@/types";

import { useCalculateDynamicGlobeCameraZoom } from "./hooks/useCalculateDynamicGlobeCameraZoom";
import { generateGlobeHtmlMarkerDOM } from "./utils/generateGlobeHtmlMarkerDOM";
import GlobeLocationPopupOverlay from "./features/GlobeLocationPopupOverlay";
import GlobeZoomControls from "./features/GlobeZoomControls";
import GlobeMapStyleToggle, { MapStyle, getTileUrl } from "./features/GlobeMapStyleToggle";
import GlobeVisibilityToggle from "./features/GlobeVisibilityToggle";
import GlobeJourneySvgOverlay from "./features/GlobeJourneySvgOverlay";

export default function TacticalGlobe() {
    const globeRef = useRef<GlobeMethods | undefined>(undefined);
    const clickTracker = useRef<number>(0);
    // Save camera POV before style remount so we can restore it exactly
    const savedPovRef = useRef<{ lat: number; lng: number; altitude: number } | null>(null);
    const { width, height } = useWindowSize();
    const { timelineData, activeEvent, activeEventIndex, setActiveEventIndex } = useTimeline();
    const [popupData, setPopupData] = useState<TimelineEvent | null>(null);
    const [altitude, setAltitude] = useState(0.5);
    const [mapStyle, setMapStyle] = useState<MapStyle>('parchment');
    const [showAllCities, setShowAllCities] = useState(false);

    useCalculateDynamicGlobeCameraZoom(globeRef, activeEvent, timelineData);

    // After Globe remounts (key change), restore the saved camera position immediately
    useEffect(() => {
        if (savedPovRef.current && globeRef.current) {
            globeRef.current.pointOfView(savedPovRef.current, 0);
            savedPovRef.current = null;
        }
    }, [mapStyle]);

    const handleStyleChange = (style: MapStyle) => {
        // Capture current POV before remount destroys the globe instance
        if (globeRef.current) {
            savedPovRef.current = globeRef.current.pointOfView();
        }
        setMapStyle(style);
    };

    const handleMarkerClick = (eventData: TimelineEvent) => {
        setActiveEventIndex(eventData.order - 1);
        setPopupData(eventData);
    };

    const handleGlobeClick = (coords: { lat: number; lng: number }) => {
        const now = Date.now();
        if (now - clickTracker.current < 400) {
            const pov = globeRef.current?.pointOfView();
            if (pov) {
                const targetAlt = Math.max(0.005, pov.altitude * 0.2);
                globeRef.current?.pointOfView({ lat: coords.lat, lng: coords.lng, altitude: targetAlt }, 800);
            }
        }
        clickTracker.current = now;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globeComponentRef = globeRef as any;
    const isParchment = mapStyle === 'parchment';

    return (
        <div className="h-full w-full bg-[#f8f5ee]">
            {width > 0 && (
                <div className={`w-full h-full ${isParchment ? 'filter sepia-[0.35] contrast-[1.05] brightness-[0.95] hue-rotate-[-5deg]' : ''}`}>
                    {/* key={mapStyle} forces a clean remount when tile source changes */}
                    <Globe
                        key={mapStyle}
                        ref={globeComponentRef}
                        width={width}
                        height={height}
                        globeTileEngineUrl={getTileUrl(mapStyle)}
                        showGlobe={true}
                        backgroundColor="rgba(250, 250, 250, 0)"
                        onGlobeClick={handleGlobeClick}
                        onZoom={(pov) => setAltitude(pov.altitude)}

                        htmlElementsData={showAllCities ? timelineData : timelineData.slice(0, activeEventIndex + 1)}
                        htmlLat={(d) => (d as TimelineEvent).lat}
                        htmlLng={(d) => (d as TimelineEvent).lng}
                        htmlAltitude={0}
                        htmlElement={(data) => generateGlobeHtmlMarkerDOM(data, activeEvent?.order || 0, handleMarkerClick)}

                        atmosphereColor="#e2e8f0"
                        atmosphereAltitude={0.15}
                    />
                </div>
            )}

            <GlobeJourneySvgOverlay 
                globeRef={globeRef} 
                timelineData={timelineData} 
                activeEventIndex={showAllCities ? timelineData.length - 1 : activeEventIndex} 
            />
            
            <GlobeLocationPopupOverlay data={popupData} onCloseRequest={() => setPopupData(null)} />
            <GlobeVisibilityToggle showAll={showAllCities} onChange={setShowAllCities} />
            <GlobeZoomControls globeRef={globeRef} />
            <GlobeMapStyleToggle value={mapStyle} onChange={handleStyleChange} />
        </div>
    );
}
