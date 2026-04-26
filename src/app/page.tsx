import JourneySelector from "@/components/ui/JourneySelector";
import Sidebar from "@/components/ui/Sidebar";
import TimelineScrubber from "@/components/ui/TimelineScrubber";
import AutoplayControls from "@/components/ui/AutoplayControls";
import GlobeWrapper from "@/components/globe/GlobeWrapper";

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#f8f5ee]">

      {/* 3D Background — full bleed */}
      <div className="absolute inset-0 z-0">
        <GlobeWrapper />
      </div>

      {/* Journey selector — fixed at top center */}
      <div className="absolute top-0 left-0 right-0 z-30 flex justify-center pt-2 md:pt-6 px-2 md:px-0 pointer-events-none w-full">
        <div className="pointer-events-auto w-full max-w-xl">
          <JourneySelector />
        </div>
      </div>

      {/* Sidebar — Mobile: anchored near bottom; Desktop: fixed left */}
      <div className="absolute inset-x-2 md:inset-x-auto md:left-12 top-14 md:top-24 bottom-[100px] md:bottom-36 z-20 flex flex-col justify-end md:justify-start items-center md:items-start pointer-events-none">
        <div className="pointer-events-auto overflow-y-auto w-full md:w-auto flex justify-center" style={{ maxHeight: '100%' }}>
          <Sidebar />
        </div>
      </div>

      {/* Bottom bar — fixed at bottom, always visible */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center gap-1 md:gap-3 pb-0 md:pb-6 pointer-events-none">
        <div className="pointer-events-auto w-full md:w-auto px-2 pb-1 md:pb-0 flex justify-center max-w-full overflow-x-auto no-scrollbar">
          <AutoplayControls />
        </div>
        <div className="pointer-events-auto w-full md:w-auto overflow-hidden">
          <TimelineScrubber className="md:rounded-sm" />
        </div>
      </div>
    </main>
  );
}
