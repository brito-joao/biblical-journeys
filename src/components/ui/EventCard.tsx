import { useState } from "react";
import { TimelineEvent } from "@/types";
import { cn } from "@/lib/utils";
import { useTimeline } from "@/context/TimelineContext";
import { getTravelMetrics } from "@/utils/travelMetrics";
import { useBiblePassage } from "@/hooks/useBiblePassage";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/hooks/useLanguage";
import { t, tData } from "@/lib/i18n";

interface EventCardProps {
    event: TimelineEvent;
    className?: string;
    onNext?: () => void;
    onPrev?: () => void;
}

export default function EventCard({ event, className, onNext, onPrev }: EventCardProps) {
    const { activeJourney, timelineData, activeEventIndex } = useTimeline();
    const [showPassage, setShowPassage] = useState(false);
    const [isMobileExpanded, setIsMobileExpanded] = useState(false);
    const { language } = useLanguage();
    const { translation, setTranslation, TRANSLATIONS } = useTranslation();
    const { text: passageText, loading: passageLoading, reference: passageRef } = useBiblePassage(
        showPassage ? event.verses : undefined,
        translation
    );

    const prevEvent = activeEventIndex > 0 ? timelineData[activeEventIndex - 1] : null;
    const metrics = prevEvent ? getTravelMetrics(prevEvent.lat, prevEvent.lng, event.lat, event.lng) : null;

    return (
        <>
            <div className={cn("flex flex-col gap-3 md:gap-5 relative z-10 w-full", className)}>
                {/* Journey & City header */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-gradient-to-r from-[#c4952a]/60 to-transparent" />
                        <h2 className="text-[10px] font-bold tracking-[0.25em] text-[#9a7518] uppercase"
                            style={{ fontFamily: 'var(--font-merriweather, serif)' }}>
                            {tData(activeJourney.name, language)}
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-l from-[#c4952a]/60 to-transparent" />
                    </div>
                    <div className="flex items-start justify-between gap-2">
                        <h1 className="font-serif text-[1.4rem] md:text-[2.2rem] font-bold text-[#2c2015] leading-tight tracking-tight">
                            {tData(event.city, language)}
                        </h1>
                        <button
                            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
                            className="md:hidden flex-shrink-0 mt-2 px-2 py-1 flex items-center justify-center text-[10px] font-bold tracking-widest uppercase text-[#9a7518] border border-[#c4952a]/40 bg-[#e8dcc0]/50"
                        >
                            {isMobileExpanded ? t('less', language) : t('more', language)}
                        </button>
                    </div>
                </div>

                {/* Decorative rule with compass asterisk */}
                <div className={cn("flex items-center gap-2", !isMobileExpanded && "hidden md:flex")}>
                    <div className="flex-1 h-px bg-[#c4952a]/30" />
                    <span className="text-[#c4952a]/60 text-[10px]">✦</span>
                    <div className="flex-1 h-px bg-[#c4952a]/30" />
                </div>

                {/* Year — ink stamp banner */}
                <div className={cn("flex items-center gap-2 md:gap-3", !isMobileExpanded && "hidden md:flex")}>
                    <span
                        className="inline-flex items-center px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-[11px] font-bold tracking-[0.15em] text-[#f0e8d5] uppercase"
                        style={{
                            background: '#2c2015',
                            fontFamily: 'var(--font-merriweather, serif)',
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 2px 2px 0 rgba(44,32,21,0.4)'
                        }}
                    >
                        {tData(event.year, language)}
                    </span>
                </div>

                {/* Collapsible details body */}
                <div className={cn("flex-col gap-4", isMobileExpanded ? "flex" : "hidden md:flex")}>
                    {/* Travel metrics — hand-annotated look */}
                    {metrics && metrics.km > 5 && (
                        <div
                            className="flex items-center gap-3 text-[11px] text-[#6b4c28] font-bold tracking-wider uppercase italic"
                            style={{ fontFamily: 'var(--font-merriweather, serif)' }}
                        >
                            <span>📍 {metrics.km} {t('km', language)} {t('from', language)} {tData(prevEvent?.city || '', language)}</span>
                            <span className="text-[#c4952a]">·</span>
                            <span>🚶 ~{metrics.walkingDays}d {t('walk', language)}</span>
                        </div>
                    )}

                    {/* Description — clean ink on parchment */}
                    <p className="text-[0.75rem] md:text-[0.88rem] leading-[1.6] md:leading-[1.75] text-[#3a2c1a] font-sans">
                        {tData(event.description, language)}
                    </p>

                    {/* Verse reference — italic gold */}
                    {event.verses && (
                        <p className="text-[9px] md:text-xs text-[#9a7518] font-bold tracking-wide italic border-l-2 border-[#c4952a]/40 pl-2 md:pl-3">
                            {event.verses}
                        </p>
                    )}
                </div>

                {/* Bible Reader Trigger & Desktop Inline Reader */}
                {event.verses && (
                    <div className={cn("flex-col gap-3", isMobileExpanded || !isMobileExpanded ? "flex md:flex" : "hidden md:flex")}>
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setShowPassage(true)}
                                className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#7a1e18] hover:text-[#5c1612] transition-colors flex items-center gap-2"
                                style={{ fontFamily: 'var(--font-merriweather, serif)' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M5.5 2A3.5 3.5 0 0 0 2 5.5v5A3.5 3.5 0 0 0 5.5 14h5a3.5 3.5 0 0 0 3.5-3.5V8a.5.5 0 0 1 1 0v2.5a4.5 4.5 0 0 1-4.5 4.5h-5A4.5 4.5 0 0 1 1 10.5v-5A4.5 4.5 0 0 1 5.5 1H8a.5.5 0 0 1 0 1H5.5z" />
                                    <path d="M16 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                </svg>
                                ↗ {t('readPassage', language)}
                            </button>
                            {/* Only show translation dropdown inline on Desktop if passage is open */}
                            <div className="hidden md:block">
                                {showPassage && (
                                    <select
                                        value={translation}
                                        onChange={e => setTranslation(e.target.value)}
                                        className="text-[#2c2015] text-[11px] font-bold border border-[#c4952a]/40 outline-none px-2 py-1 cursor-pointer"
                                        style={{ background: '#e8dcc0', fontFamily: 'var(--font-merriweather, serif)' }}
                                    >
                                        {TRANSLATIONS.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>

                        {/* DESKTOP ONLY Inline Reader */}
                        {showPassage && (
                            <div className="hidden md:block">
                                <div
                                    className="border-l-[3px] border-[#c4952a]/70 pl-4 py-3 pr-3 max-h-48 overflow-y-auto unfurl relative"
                                    style={{ background: 'rgba(200,180,130,0.12)' }}
                                >
                                    <button onClick={() => setShowPassage(false)} className="absolute top-2 right-2 text-[#9a7518] hover:text-[#2c2015] text-[10px]">✕ {t('close', language).toUpperCase()}</button>
                                    {passageLoading && (
                                        <p className="text-xs text-[#6b4c28] italic animate-pulse" style={{ fontFamily: 'var(--font-merriweather, serif)' }}>
                                            {t('consulting', language)}
                                        </p>
                                    )}
                                    {passageText && (
                                        <>
                                            <span className="text-[10px] font-bold text-[#9a7518] uppercase tracking-[0.15em] block mb-2"
                                                style={{ fontFamily: 'var(--font-merriweather, serif)' }}>
                                                {passageRef}
                                            </span>
                                            <p className="font-serif text-[#3a2c1a] italic text-sm leading-relaxed whitespace-pre-wrap">
                                                {passageText}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Navigation — compass arrow buttons */}
                <div className="mt-1 flex items-center justify-between md:justify-start gap-4">
                    <button
                        onClick={onPrev}
                        className="flex h-10 w-10 md:h-10 md:w-10 flex-shrink-0 items-center justify-center text-[#6b4c28] transition-all hover:text-[#2c2015] focus:outline-none group"
                        style={{
                            border: '1.5px solid rgba(196,149,42,0.5)',
                            background: 'rgba(216,200,168,0.5)',
                            boxShadow: '2px 2px 0 rgba(44,32,21,0.15)'
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                        </svg>
                    </button>
                    <button
                        onClick={onNext}
                        className="flex h-10 md:h-10 flex-1 md:flex-none md:w-10 items-center justify-center text-[#e0b84a] transition-all focus:outline-none hover:scale-[1.02] md:hover:scale-105 lantern-pulse"
                        style={{
                            background: '#2c2015',
                            border: '1.5px solid #c4952a',
                            boxShadow: '2px 2px 0 rgba(44,32,21,0.4), 0 0 12px rgba(196,149,42,0.2)'
                        }}
                    >
                        <span className="md:hidden text-[11px] font-bold tracking-[0.2em] font-merriweather mr-3">{t('next', language).toUpperCase()}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* MOBILE ONLY Passage Modal Popup */}
            {showPassage && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#1a1208]/70 backdrop-blur-sm md:hidden pointer-events-auto">
                    <div
                        className="w-full max-w-sm flex flex-col bg-[#f0e8d5] shadow-2xl relative border border-[#c4952a]/60 explorer-card parchment-surface unfurl"
                        style={{ maxHeight: '85vh' }}
                    >
                        {/* Modal Header */}
                        <div className="p-4 flex items-center justify-between border-b border-[#c4952a]/30">
                            <span
                                className="text-[10px] font-bold text-[#9a7518] uppercase tracking-[0.15em] line-clamp-1 pr-4"
                                style={{ fontFamily: 'var(--font-merriweather, serif)' }}
                            >
                                {passageRef || event.verses}
                            </span>
                            <button
                                onClick={() => setShowPassage(false)}
                                className="text-[#6b4c28] hover:text-[#2c2015] flex-shrink-0"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 overflow-y-auto flex-1">
                            <div className="flex flex-col gap-4">
                                <select
                                    value={translation}
                                    onChange={e => setTranslation(e.target.value)}
                                    className="text-[#2c2015] text-[11px] font-bold border border-[#c4952a]/40 outline-none w-full px-3 py-2 cursor-pointer"
                                    style={{ background: '#e8dcc0', fontFamily: 'var(--font-merriweather, serif)' }}
                                >
                                    {TRANSLATIONS.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>

                                {passageLoading && (
                                    <p className="text-[11px] text-[#6b4c28] italic animate-pulse text-center mt-6" style={{ fontFamily: 'var(--font-merriweather, serif)' }}>
                                        {t('consulting', language)}
                                    </p>
                                )}
                                {passageText && (
                                    <p className="font-serif text-[#3a2c1a] italic text-[15px] leading-relaxed whitespace-pre-wrap">
                                        {passageText}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
