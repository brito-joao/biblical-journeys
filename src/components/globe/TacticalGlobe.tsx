"use client";
import { useRef, useState, useEffect } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useTimeline } from "@/context/TimelineContext";
import { TimelineEvent } from "@/types";
import { useLanguage } from "@/hooks/useLanguage";
import romanEmpireData from '@/data/geojson/roman_empire.json';

import { useCalculateDynamicGlobeCameraZoom } from "./hooks/useCalculateDynamicGlobeCameraZoom";
import { generateGlobeHtmlMarkerDOM } from "./utils/generateGlobeHtmlMarkerDOM";
import GlobeLocationPopupOverlay from "./features/GlobeLocationPopupOverlay";
import GlobeZoomControls from "./features/GlobeZoomControls";
import GlobeMapStyleToggle, { MapStyle, getTileUrl, getGlobeImageUrl } from "./features/GlobeMapStyleToggle";
import GlobeVisibilityToggle from "./features/GlobeVisibilityToggle";
import GlobeJourneySvgOverlay from "./features/GlobeJourneySvgOverlay";
import { getEventCoordinates } from "@/utils/coordinates";
import { FlatAncientMap } from "./FlatAncientMap";

export default function TacticalGlobe() {
    const globeRef = useRef<GlobeMethods | undefined>(undefined);

    // FIX: Typed as 'any' to prevent TypeScript from blocking the build due to ref union mismatches
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map2DRef = useRef<any>(null);

    const clickTracker = useRef<number>(0);
    const { width, height } = useWindowSize();
    const { timelineData, activeEvent, activeEventIndex, setActiveEventIndex, activeJourney } = useTimeline();
    const { language } = useLanguage();

    // INDEPENDENT SPATIAL MEMORY
    const savedGlobePovRef = useRef<{ lat: number; lng: number; altitude: number } | null>(null);
    const savedMap2DStateRef = useRef<{ positionX: number; positionY: number; scale: number } | null>(null);

    const [popupData, setPopupData] = useState<TimelineEvent | null>(null);
    const [altitude, setAltitude] = useState(0.5);
    const [mapStyle, setMapStyle] = useState<MapStyle>('satellite');
    const [showAllCities, setShowAllCities] = useState(false);

    useCalculateDynamicGlobeCameraZoom(globeRef, activeEvent, timelineData, mapStyle);

    // Restore 3D Globe camera when switching back to Globe mode
    useEffect(() => {
        if (savedGlobePovRef.current && globeRef.current && mapStyle !== 'parchment') {
            globeRef.current.pointOfView(savedGlobePovRef.current, 0); // 0ms = instant snap
        }
    }, [mapStyle]);

    // Save states BEFORE switching
    const handleStyleChange = (style: MapStyle) => {
        if (mapStyle === 'parchment' && map2DRef.current) {
            // We are leaving the 2D map: Save exact pan/zoom state
            // Safely grab state depending on react-zoom-pan-pinch version
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const state = map2DRef.current.state || (map2DRef.current.instance as any).transformState;
            if (state) {
                savedMap2DStateRef.current = {
                    positionX: state.positionX,
                    positionY: state.positionY,
                    scale: state.scale
                };
            }
        } else if (globeRef.current) {
            // We are leaving the 3D map: Save 3D point of view
            savedGlobePovRef.current = globeRef.current.pointOfView();
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const displayPolygons = activeEvent?.year && String(activeEvent.year).includes("AD") ? (romanEmpireData as any).features : [];

    return (
        <div className="h-full w-full bg-[#f8f5ee]">
            {width > 0 && (
                <div className={`w-full h-full absolute inset-0 ${isParchment ? 'filter sepia-[0.35] contrast-[1.05] brightness-[0.95] hue-rotate-[-5deg]' : ''}`}>
                    {isParchment ? (
                        <FlatAncientMap
                            mapRef={map2DRef}
                            initialMapState={savedMap2DStateRef.current} // Pass the saved 2D state
                            textureUrl={activeJourney.mapTextureUrl}
                            timelineData={timelineData}
                            activeEventIndex={showAllCities ? timelineData.length - 1 : activeEventIndex}
                            onMarkerClick={handleMarkerClick}
                            language={language}
                        />
                    ) : (
                        <Globe
                            key={mapStyle}
                            ref={globeComponentRef}
                            width={width}
                            height={height}
                            globeImageUrl={getGlobeImageUrl(mapStyle, activeJourney.mapTextureUrl)}
                            globeTileEngineUrl={getGlobeImageUrl(mapStyle, activeJourney.mapTextureUrl) ? undefined : getTileUrl(mapStyle)}
                            showGlobe={true}
                            backgroundColor="rgba(250, 250, 250, 0)"
                            onGlobeClick={handleGlobeClick}
                            onZoom={(pov) => setAltitude(pov.altitude)}
                            htmlElementsData={showAllCities ? timelineData : timelineData.slice(0, activeEventIndex + 1)}
                            htmlLat={(d) => getEventCoordinates(d as TimelineEvent, mapStyle).lat}
                            htmlLng={(d) => getEventCoordinates(d as TimelineEvent, mapStyle).lng}
                            htmlAltitude={0}
                            htmlElement={(data) => generateGlobeHtmlMarkerDOM(data, activeEvent?.order || 0, handleMarkerClick, language)}
                            polygonsData={displayPolygons}
                            polygonAltitude={0.005}
                            polygonCapColor={() => 'rgba(150, 20, 20, 0.15)'}
                            polygonSideColor={() => 'rgba(150, 20, 20, 0.05)'}
                            polygonStrokeColor={() => '#5c1010'}
                            atmosphereColor="#e2e8f0"
                            atmosphereAltitude={0.15}
                        />
                    )}
                </div>
            )}

            {!isParchment && (
                <GlobeJourneySvgOverlay
                    globeRef={globeRef}
                    timelineData={timelineData}
                    activeEventIndex={showAllCities ? timelineData.length - 1 : activeEventIndex}
                    mapStyle={mapStyle}
                />
            )}

            <GlobeLocationPopupOverlay data={popupData} onCloseRequest={() => setPopupData(null)} />
            <GlobeVisibilityToggle showAll={showAllCities} onChange={setShowAllCities} />
            <GlobeZoomControls globeRef={globeRef} map2DRef={map2DRef} isAntiqueMode={isParchment} />
            <GlobeMapStyleToggle value={mapStyle} onChange={handleStyleChange} />
        </div>
    );
}