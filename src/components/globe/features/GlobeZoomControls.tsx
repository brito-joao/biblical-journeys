import { MutableRefObject } from "react";
import { GlobeMethods } from "react-globe.gl";

interface GlobeZoomControlsProps {
    globeRef: MutableRefObject<GlobeMethods | undefined>;
}

export default function GlobeZoomControls({ globeRef }: GlobeZoomControlsProps) {
    const handleZoomIn = () => {
        if (!globeRef.current) return;
        const pov = globeRef.current.pointOfView();
        const alt = Math.max(0.005, pov.altitude * 0.4);
        globeRef.current.pointOfView({ ...pov, altitude: alt }, 500);
    };

    const handleZoomOut = () => {
        if (!globeRef.current) return;
        const pov = globeRef.current.pointOfView();
        const alt = Math.min(2.5, pov.altitude * 1.4);
        globeRef.current.pointOfView({ ...pov, altitude: alt }, 500);
    };

    const btnBase = {
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #f0e8d5 0%, #e4d9bc 100%)',
        color: '#6b4c28',
        border: '1.5px solid rgba(196,149,42,0.55)',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
    };

    return (
        <div 
            className="absolute top-6 right-6 hidden md:flex flex-col z-[50] overflow-hidden"
            style={{ boxShadow: '0 8px 24px rgba(44,32,21,0.28), 0 0 0 0.5px rgba(196,149,42,0.3)' }}
        >
            <button
                onClick={handleZoomIn}
                style={{ ...btnBase, borderBottom: 'none' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#e0c98a'; (e.currentTarget as HTMLElement).style.color = '#2c2015'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'linear-gradient(180deg, #f0e8d5 0%, #e4d9bc 100%)'; (e.currentTarget as HTMLElement).style.color = '#6b4c28'; }}
                title="Zoom In"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                </svg>
            </button>
            {/* Hairline divider */}
            <div style={{ height: '1px', background: 'rgba(196,149,42,0.4)' }} />
            <button
                onClick={handleZoomOut}
                style={btnBase}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#e0c98a'; (e.currentTarget as HTMLElement).style.color = '#2c2015'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'linear-gradient(180deg, #f0e8d5 0%, #e4d9bc 100%)'; (e.currentTarget as HTMLElement).style.color = '#6b4c28'; }}
                title="Zoom Out"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z" />
                </svg>
            </button>
        </div>
    );
}
