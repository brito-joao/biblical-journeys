"use client";

import { useEffect, useRef } from "react";
import { TimelineEvent } from "@/types";
import { GlobeMethods } from "react-globe.gl";
import { getEventCoordinates } from "@/utils/coordinates";

interface GlobeJourneySvgOverlayProps {
    globeRef: React.RefObject<GlobeMethods | undefined>;
    timelineData: TimelineEvent[];
    activeEventIndex: number;
    mapStyle: string;
}

export default function GlobeJourneySvgOverlay({ globeRef, timelineData, activeEventIndex, mapStyle }: GlobeJourneySvgOverlayProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const pathGroupRef = useRef<SVGGElement>(null);

    useEffect(() => {
        if (svgRef.current && globeRef.current) {
            // Magic DOM weaving: react-globe.gl renders a canvas and a div for HTML elements.
            // By moving our SVG into their relative parent right after the canvas, we ensure the HTML markers float above the lines!
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const canvasWrapper = (globeRef.current as any).root?.querySelector?.('canvas')?.parentElement;
            if (canvasWrapper && !canvasWrapper.contains(svgRef.current)) {
                // Remove from current React parent
                if (svgRef.current.parentElement) {
                    svgRef.current.parentElement.removeChild(svgRef.current);
                }
                // Insert as second child (after canvas)
                canvasWrapper.insertBefore(svgRef.current, canvasWrapper.children[1]);
            }
        }
        
        let frameId: number;

        const updatePaths = () => {
            if (!globeRef.current || !pathGroupRef.current) {
                frameId = requestAnimationFrame(updatePaths);
                return;
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const g = globeRef.current as any;
            const pov = g.pointOfView ? g.pointOfView() : null;

            const segments: string[] = [];
            
            for (let i = 0; i < activeEventIndex; i++) {
                const start = timelineData[i];
                const end = timelineData[i + 1];
                const startCoords = getEventCoordinates(start, mapStyle);
                const endCoords = getEventCoordinates(end, mapStyle);

                let isVisible = true;
                
                // Front-face strictly visible checking
                // Calculates angular distance from camera directly.
                if (pov) {
                    const lat1 = startCoords.lat * Math.PI / 180;
                    const lng1 = startCoords.lng * Math.PI / 180;
                    const lat2 = endCoords.lat * Math.PI / 180;
                    const lng2 = endCoords.lng * Math.PI / 180;
                    
                    const clat = pov.lat * Math.PI / 180;
                    const clng = pov.lng * Math.PI / 180;

                    // Dot products against the camera
                    const dotStart = Math.cos(lat1) * Math.cos(clat) * Math.cos(lng1 - clng) + Math.sin(lat1) * Math.sin(clat);
                    const dotEnd = Math.cos(lat2) * Math.cos(clat) * Math.cos(lng2 - clng) + Math.sin(lat2) * Math.sin(clat);
                    
                    // If dot is less than ~0, the point is on the back hemisphere relative to the camera
                    if (dotStart < -0.1 || dotEnd < -0.1) {
                        isVisible = false;
                    }
                }

                if (isVisible && typeof g.getScreenCoords === 'function') {
                    const startPx = g.getScreenCoords(start.lat, start.lng);
                    const endPx = g.getScreenCoords(end.lat, end.lng);
                    
                    if (startPx && endPx) {
                        segments.push(`M ${startPx.x} ${startPx.y} L ${endPx.x} ${endPx.y}`);
                    }
                }
            }

            pathGroupRef.current.innerHTML = `<path d="${segments.join(" ")}" fill="none" stroke="#b89947" stroke-width="2.5" stroke-dasharray="4 4" stroke-linecap="round" stroke-linejoin="round" />`;

            frameId = requestAnimationFrame(updatePaths);
        };

        frameId = requestAnimationFrame(updatePaths);
        return () => cancelAnimationFrame(frameId);
    }, [globeRef, timelineData, activeEventIndex]);

    return (
        <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
        >
            <g ref={pathGroupRef} className="filter drop-shadow(0px 1px 2px rgba(62,50,34,0.5))" />
        </svg>
    );
}
