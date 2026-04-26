"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getGlobeImageUrl, getTileUrl, MapStyle } from "@/components/globe/features/GlobeMapStyleToggle";
import GlobeMapStyleToggle from "@/components/globe/features/GlobeMapStyleToggle";
import { useWindowSize } from "@/hooks/useWindowSize";
import { availableJourneys } from "@/data";
import { TimelineEvent } from "@/types";
import { getEventCoordinates } from "@/utils/coordinates";
import { FlatAncientMap } from "@/components/globe/FlatAncientMap";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function AdminCalibratorPage() {
    const { width, height } = useWindowSize();

    // Admin state
    const [mapStyle, setMapStyle] = useState<MapStyle>('parchment');
    const [selectedJourneyId, setSelectedJourneyId] = useState(availableJourneys[0].id);
    const [journeyData, setJourneyData] = useState<TimelineEvent[]>(availableJourneys[0].data);
    const [selectedEventIndex, setSelectedEventIndex] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    // Update internal data cache when changing dropdown
    const handleJourneyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setSelectedJourneyId(id);
        const sourceData = availableJourneys.find(j => j.id === id)?.data || [];
        setJourneyData(JSON.parse(JSON.stringify(sourceData))); // Deep copy for mutability
        setSelectedEventIndex(null);
    };

    const activeJourneyMeta = availableJourneys.find(j => j.id === selectedJourneyId);

    // Resolve globe texture. If style is "parchment", we try the specific journey image first.
    const customImageUrl = mapStyle === 'parchment' ? activeJourneyMeta?.mapTextureUrl : undefined;
    const resolvedGlobeImageUrl = customImageUrl || getGlobeImageUrl(mapStyle);

    // Handles clicking the empty map to set NEW coordinates
    const handleGlobeClick = (coords: { lat: number, lng: number }) => {
        if (selectedEventIndex !== null) {
            const newData = [...journeyData];
            if (mapStyle === 'parchment') {
                newData[selectedEventIndex].ancientMap = {
                    lat: Number(coords.lat.toFixed(4)),
                    lng: Number(coords.lng.toFixed(4))
                };
            } else {
                newData[selectedEventIndex].lat = Number(coords.lat.toFixed(4));
                newData[selectedEventIndex].lng = Number(coords.lng.toFixed(4));
            }
            setJourneyData(newData);
        }
    };

    // NEW: Handles clicking an EXISTING dot to CLONE its coordinates
    const handleExistingMarkerClick = (clickedEvent: TimelineEvent) => {
        if (selectedEventIndex !== null) {
            const newData = [...journeyData];
            if (mapStyle === 'parchment') {
                const sourceLat = clickedEvent.ancientMap?.lat ?? clickedEvent.lat;
                const sourceLng = clickedEvent.ancientMap?.lng ?? clickedEvent.lng;
                newData[selectedEventIndex].ancientMap = {
                    lat: Number(sourceLat.toFixed(4)),
                    lng: Number(sourceLng.toFixed(4))
                };
            } else {
                newData[selectedEventIndex].lat = Number(clickedEvent.lat.toFixed(4));
                newData[selectedEventIndex].lng = Number(clickedEvent.lng.toFixed(4));
            }
            setJourneyData(newData);
        }
    };

    // Quick HTML injection for the data markers
    const createMarker = (d: object) => {
        const event = d as TimelineEvent;
        // Selection is now strictly tied to the sidebar state
        const isSelected = selectedEventIndex !== null && journeyData[selectedEventIndex].order === event.order;

        const el = document.createElement('div');
        el.style.width = '14px';
        el.style.height = '14px';
        el.style.backgroundColor = isSelected ? '#3b82f6' : '#d97706';
        el.style.border = '2px solid white';
        el.style.borderRadius = '50%';
        el.style.boxShadow = isSelected ? '0 0 10px 4px rgba(59, 130, 246, 0.6)' : 'none';
        el.style.cursor = 'crosshair'; // Change cursor to indicate a tool/action

        const label = document.createElement('span');
        label.innerText = typeof event.city === 'string' ? event.city : (event.city.en || '');
        label.style.position = 'absolute';
        label.style.top = '16px';
        label.style.left = '50%';
        label.style.transform = 'translateX(-50%)';
        label.style.color = 'white';
        label.style.fontSize = '12px';
        label.style.fontWeight = 'bold';
        label.style.textShadow = '0 1px 3px black';
        label.style.whiteSpace = 'nowrap';
        label.style.pointerEvents = 'none';

        el.appendChild(label);

        el.onclick = (e) => {
            e.stopPropagation();
            // Clone coordinates instead of changing selection
            handleExistingMarkerClick(event);
        };

        return el;
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(JSON.stringify(journeyData, null, 4));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative w-screen h-screen bg-[#111] overflow-hidden">

            {/* The Globe or FlatMap */}
            {width > 0 && typeof window !== 'undefined' && (
                mapStyle === 'parchment' ? (
                    <FlatAncientMap
                        textureUrl={activeJourneyMeta?.mapTextureUrl}
                        timelineData={journeyData}
                        // Always show all markers in calibration mode so you can click them
                        activeEventIndex={journeyData.length - 1}
                        onMarkerClick={handleExistingMarkerClick} // Clone coordinates
                        onMapClick={handleGlobeClick} // Set new coordinates
                    />
                ) : (
                    <Globe
                        key={resolvedGlobeImageUrl}
                        width={width}
                        height={height}
                        globeImageUrl={resolvedGlobeImageUrl}
                        globeTileEngineUrl={resolvedGlobeImageUrl ? undefined : getTileUrl(mapStyle)}
                        showGlobe={true}
                        backgroundColor="rgba(20, 20, 20, 1)"
                        onGlobeClick={handleGlobeClick}

                        htmlElementsData={journeyData}
                        htmlElement={createMarker}
                        htmlLat={(d: object) => getEventCoordinates(d as TimelineEvent, mapStyle).lat}
                        htmlLng={(d: object) => getEventCoordinates(d as TimelineEvent, mapStyle).lng}
                        htmlAltitude={0.01}
                    />
                )
            )}

            <GlobeMapStyleToggle value={mapStyle} onChange={setMapStyle} />

            {/* Left Panel */}
            <div className="absolute top-4 left-4 z-50 w-80 max-h-[90vh] flex flex-col gap-4">

                <div className="bg-black/90 p-4 rounded border border-gray-700 shadow-xl backdrop-blur">
                    <h1 className="text-sm font-bold uppercase text-amber-500 mb-3 tracking-widest">Map Point Editor</h1>

                    <select
                        className="w-full bg-gray-900 text-white p-2 border border-gray-600 rounded mb-4 outline-none"
                        value={selectedJourneyId}
                        onChange={handleJourneyChange}
                    >
                        {availableJourneys.map(j => (
                            <option key={j.id} value={j.id}>{j.name}</option>
                        ))}
                    </select>

                    <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
                        <strong className="text-white">1.</strong> Select an event below.<br />
                        <strong className="text-white">2.</strong> Click empty space to move it.<br />
                        <strong className="text-white">3.</strong> Click an existing dot to <span className="text-amber-500">clone</span> its coordinates.
                    </p>

                    <div className="overflow-y-auto max-h-[40vh] border border-gray-800 rounded">
                        {journeyData.map((ev, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedEventIndex(i)}
                                className={`w-full text-left px-3 py-2 text-xs border-b border-gray-800 last:border-b-0 transition-colors ${selectedEventIndex === i ? 'bg-blue-900/50 text-blue-200 font-bold border-l-4 border-l-blue-500' : 'text-gray-300 hover:bg-gray-800 border-l-4 border-l-transparent'
                                    }`}
                            >
                                <span className="mr-2 text-gray-500">{i + 1}.</span>
                                {typeof ev.city === 'string' ? ev.city : (ev.city.en || '')}
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* Right Panel / Export */}
            <div className="absolute top-4 right-4 z-50 w-96 flex flex-col items-end gap-3 pointer-events-none">
                <a href="/" className="pointer-events-auto px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 text-xs uppercase font-bold tracking-widest border border-gray-600 shadow-xl">
                    Exit Admin
                </a>

                <div className="pointer-events-auto w-full bg-black/90 p-4 rounded border border-gray-700 shadow-xl backdrop-blur mt-8 flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">JSON Output</h2>
                        <button
                            onClick={copyToClipboard}
                            className={`px-3 py-1 text-[10px] font-bold uppercase rounded transition-colors ${copied ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                        >
                            {copied ? 'Copied!' : 'Copy Array'}
                        </button>
                    </div>
                    <pre className="bg-gray-900 text-[10px] text-green-400 p-3 rounded font-mono overflow-auto max-h-[50vh]">
                        {JSON.stringify(journeyData, null, 2)}
                    </pre>
                </div>
            </div>

        </div>
    );
}