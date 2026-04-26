import React, { useState, useEffect, useRef } from 'react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { TimelineEvent } from '@/types';

interface FlatAncientMapProps {
    textureUrl?: string;
    timelineData: TimelineEvent[];
    activeEventIndex: number;
    onMarkerClick: (event: TimelineEvent) => void;
    language?: 'en' | 'pt';
    onMapClick?: (coords: { lat: number, lng: number }) => void;
    mapRef?: React.RefObject<ReactZoomPanPinchRef>;
    initialMapState?: { positionX: number, positionY: number, scale: number } | null;
}

export function FlatAncientMap({
    textureUrl,
    timelineData,
    activeEventIndex,
    onMarkerClick,
    language = 'en',
    onMapClick,
    mapRef,
    initialMapState
}: FlatAncientMapProps) {
    const [imageLoaded, setImageLoaded] = useState(false);

    // NEW: We attach a ref to the main container to directly inject the CSS variable
    const containerRef = useRef<HTMLDivElement>(null);

    // Updates the CSS variable at 60 frames-per-second, bypassing React's slow render cycle
    const updateScaleVariable = (scale: number) => {
        if (containerRef.current) {
            const inverseScale = 1 / Math.pow(scale, 0.85);
            containerRef.current.style.setProperty('--inv-scale', inverseScale.toString());
        }
    };

    // This fires continuously while the user is actively zooming or dragging
    const handleTransform = (ref: ReactZoomPanPinchRef) => {
        updateScaleVariable(ref.state.scale);
    };

    useEffect(() => {
        if (imageLoaded && mapRef?.current && initialMapState) {
            mapRef.current.setTransform(
                initialMapState.positionX,
                initialMapState.positionY,
                initialMapState.scale,
                0 // 0ms animation = instant snap
            );
            // Instantly apply the CSS scale when loading from memory
            updateScaleVariable(initialMapState.scale);
        }
    }, [imageLoaded, initialMapState, mapRef]);

    if (!textureUrl) {
        return <div className="w-full h-full flex items-center justify-center text-gray-500">No map texture available</div>;
    }

    const getCoords = (event: TimelineEvent) => {
        const lat = event.ancientMap?.lat ?? event.lat;
        const lng = event.ancientMap?.lng ?? event.lng;

        const xPct = ((lng + 180) / 360) * 100;
        const yPct = ((90 - lat) / 180) * 100;
        return { x: xPct, y: yPct };
    };

    const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!onMapClick) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width;
        const yPct = (e.clientY - rect.top) / rect.height;

        const lng = (xPct * 360) - 180;
        const lat = 90 - (yPct * 180);

        onMapClick({ lat, lng });
    };

    const visibleData = timelineData.slice(0, activeEventIndex + 1);

    return (
        <div
            ref={containerRef} // Attach the container ref here
            className="w-full h-full overflow-hidden bg-[#eaddce] cursor-grab active:cursor-grabbing"
        >
            <TransformWrapper
                ref={mapRef}
                initialScale={1}
                minScale={0.1}
                maxScale={8}
                centerOnInit={true}
                limitToBounds={false}
                wheel={{ step: 0.1 }}
                panning={{ velocityDisabled: true }}

                // FIX: Hook into the live library events using the correct v3+ prop name
                onTransform={handleTransform}
                onInit={handleTransform}
            >
                {() => (
                    <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%', pointerEvents: onMapClick ? 'auto' : 'none' }}>
                        <div
                            className="relative shadow-2xl rounded-sm mx-auto"
                            style={{ width: '150vh', maxWidth: '2000px', pointerEvents: 'auto' }}
                            onClick={handleImageClick}
                        >
                            <img
                                src={textureUrl}
                                alt="Antique Map"
                                className="w-full h-auto object-contain pointer-events-none"
                                onLoad={() => setImageLoaded(true)}
                            />
                            {imageLoaded && (
                                <>
                                    {/* SVG Lines */}
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 10 }}>
                                        {visibleData.map((ev, i) => {
                                            if (i === 0) return null;
                                            const prev = getCoords(visibleData[i - 1]);
                                            const curr = getCoords(ev);
                                            return (
                                                <g key={`path-${i}`}>
                                                    {/* Using the CSS variable via 'calc' to perfectly scale lines! */}
                                                    <line
                                                        x1={`${prev.x}%`} y1={`${prev.y}%`}
                                                        x2={`${curr.x}%`} y2={`${curr.y}%`}
                                                        stroke="rgba(0,0,0,0.4)"
                                                        style={{
                                                            strokeWidth: 'calc(4px * var(--inv-scale, 1))',
                                                            strokeDasharray: 'calc(6px * var(--inv-scale, 1)), calc(6px * var(--inv-scale, 1))'
                                                        }}
                                                    />
                                                    <line
                                                        x1={`${prev.x}%`} y1={`${prev.y}%`}
                                                        x2={`${curr.x}%`} y2={`${curr.y}%`}
                                                        stroke="#c93c3c"
                                                        style={{
                                                            strokeWidth: 'calc(2px * var(--inv-scale, 1))',
                                                            strokeDasharray: 'calc(6px * var(--inv-scale, 1)), calc(6px * var(--inv-scale, 1))'
                                                        }}
                                                    />
                                                </g>
                                            )
                                        })}
                                    </svg>

                                    {/* HTML Markers */}
                                    {visibleData.map((ev, i) => {
                                        const coords = getCoords(ev);
                                        const isCurrent = i === activeEventIndex;
                                        const isVisited = i < activeEventIndex;

                                        return (
                                            <div
                                                key={i}
                                                className="absolute cursor-pointer z-20 group origin-center"
                                                style={{
                                                    top: `${coords.y}%`,
                                                    left: `${coords.x}%`,
                                                    // CSS variable smoothly applies the inverse scale dynamically
                                                    transform: `translate(-50%, -50%) scale(var(--inv-scale, 1))`
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onMarkerClick(ev);
                                                }}
                                            >
                                                <div className={`w-2.5 h-2.5 rounded-full border-[1.5px] border-white shadow-md transition-colors duration-300 ${isCurrent ? 'bg-red-600' : isVisited ? 'bg-amber-600' : 'bg-gray-400'}`}>
                                                    {isCurrent && <div className="absolute inset-0 border-[1.5px] border-red-500 rounded-full animate-ping opacity-75"></div>}
                                                </div>

                                                <div className={`absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-300 ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                    <div className="bg-black/80 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap">
                                                        {typeof ev.city === 'string' ? ev.city : ev.city[language]}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    </TransformComponent>
                )}
            </TransformWrapper>
        </div>
    );
}

export default FlatAncientMap;