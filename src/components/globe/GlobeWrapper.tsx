"use client";

import dynamic from "next/dynamic";

// Dynamically import the GlobeViewer with ssr disabled to prevent hydration errors
const TacticalGlobe = dynamic(() => import("./TacticalGlobe"), {
    ssr: false,
    loading: () => (
        <div className="flex h-full w-full items-center justify-center bg-[#FAFAFA]">
            <div className="text-slate-400 font-sans animate-pulse">Loading Tactical Globe...</div>
        </div>
    ),
});

export default function GlobeWrapper() {
    return <TacticalGlobe />;
}
