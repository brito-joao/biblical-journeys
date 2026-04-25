import { TimelineEvent } from "@/types";

interface GlobeLocationPopupOverlayProps {
    data: TimelineEvent | null;
    onCloseRequest: () => void;
}

export default function GlobeLocationPopupOverlay({ data, onCloseRequest }: GlobeLocationPopupOverlayProps) {
    if (!data) return null;

    return (
        <div className="absolute top-1/2 right-12 transform -translate-y-1/2 bg-[#f8f5ee]/95 backdrop-blur-lg shadow-[0_20px_50px_rgba(62,50,34,0.3)] p-8 flex flex-col z-[100] max-w-sm w-[400px] border-2 border-[#e3d8c4] pointer-events-auto before:absolute before:inset-2 before:border before:border-[#d6b45a]/30 before:pointer-events-none transition-all duration-300">
            <button 
                onClick={onCloseRequest}
                className="absolute top-6 right-6 text-[#786348] hover:text-[#8b251e] transition-colors z-20"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                </svg>
            </button>
            <h3 className="font-serif text-4xl font-bold text-[#3e3222] tracking-wide relative z-10 mb-2">{data.city}</h3>
            <div className="text-[#b89947] text-xs font-bold tracking-[0.2em] uppercase relative z-10 mb-4">{data.year}</div>
            
            <div className="h-px w-full bg-[#d6b45a]/30 relative z-10 mb-4" />

            <p className="text-[#3e3222] text-sm leading-relaxed mb-4 relative z-10">
                {data.description}
            </p>
            
            {data.verses && (
                <div className="mt-2 bg-[#e3d8c4]/30 border-l-4 border-[#b89947] p-5 shadow-inner relative z-10">
                    <span className="text-[10px] font-bold text-[#b89947] uppercase tracking-[0.15em] block mb-2">Biblical Citation</span>
                    <span className="font-serif text-[#5c4a35] italic text-[15px] leading-relaxed">{data.verses}</span>
                </div>
            )}
        </div>
    );
}
