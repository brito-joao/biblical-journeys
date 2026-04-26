"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { tData } from "@/lib/i18n";
import { LocalizedString } from "@/types";

type MapStyle = 'parchment' | 'satellite' | 'topo';

interface GlobeMapStyleToggleProps {
    value: MapStyle;
    onChange: (style: MapStyle) => void;
}

const styles: { id: MapStyle; label: LocalizedString; glyph: string; textureUrl?: string }[] = [
    { id: 'parchment', label: { en: 'Antique', pt: 'Antigo' }, glyph: '🗺' },
    { id: 'satellite', label: { en: 'Satellite', pt: 'Satélite' }, glyph: '🛰' },
    { id: 'topo', label: { en: 'Terrain', pt: 'Terreno' }, glyph: '⛰' },
];

const sharedBtnStyle = (isActive: boolean, i: number, axis: 'x' | 'y') => ({
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontFamily: 'var(--font-merriweather, serif)',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    transition: 'all 0.15s ease',
    background: isActive ? '#2c2015' : 'transparent',
    color: isActive ? '#e0b84a' : '#6b4c28',
    ...(axis === 'y'
        ? { padding: '8px 14px', fontSize: '11px', letterSpacing: '0.08em', borderTop: i > 0 ? '1px solid rgba(196,149,42,0.3)' : 'none' }
        : { padding: '7px 10px', fontSize: '9px', letterSpacing: '0.06em', borderLeft: i > 0 ? '1px solid rgba(196,149,42,0.3)' : 'none' }),
});

export default function GlobeMapStyleToggle({ value, onChange }: GlobeMapStyleToggleProps) {
    const { language } = useLanguage();

    return (
        <>
            {/* Mobile: compact horizontal strip at top-right */}
            <div
                className="absolute top-[100px] right-2 flex flex-row md:hidden z-[50] overflow-hidden"
                style={{
                    background: 'linear-gradient(180deg, #f0e8d5 0%, #e4d9bc 100%)',
                    border: '1.5px solid rgba(196,149,42,0.55)',
                    boxShadow: '0 4px 12px rgba(44,32,21,0.22)',
                }}
            >
                {styles.map((s, i) => (
                    <button
                        key={s.id}
                        onClick={() => onChange(s.id)}
                        title={typeof s.label === 'string' ? s.label : s.label[language] || s.label.en}
                        style={sharedBtnStyle(value === s.id, i, 'x')}
                    >
                        <span style={{ fontSize: '13px', lineHeight: 1 }}>{s.glyph}</span>
                        <span>{tData(s.label, language)}</span>
                    </button>
                ))}
            </div>

            {/* Desktop: vertical stack at bottom-right */}
            <div
                className="absolute bottom-[140px] right-6 hidden md:flex flex-col z-[50] overflow-hidden"
                style={{
                    background: 'linear-gradient(180deg, #f0e8d5 0%, #e4d9bc 100%)',
                    border: '1.5px solid rgba(196,149,42,0.55)',
                    boxShadow: '0 8px 24px rgba(44,32,21,0.28), 0 0 0 0.5px rgba(196,149,42,0.3)',
                }}
            >
                {styles.map((s, i) => (
                    <button
                        key={s.id}
                        onClick={() => onChange(s.id)}
                        title={typeof s.label === 'string' ? s.label : s.label[language] || s.label.en}
                        style={sharedBtnStyle(value === s.id, i, 'y')}
                    >
                        <span style={{ fontSize: '14px', lineHeight: 1 }}>{s.glyph}</span>
                        <span>{tData(s.label, language)}</span>
                        {value === s.id && (
                            <span style={{ marginLeft: 'auto', color: '#c4952a', fontSize: '8px' }}>✦</span>
                        )}
                    </button>
                ))}
            </div>
        </>
    );
}

export type { MapStyle };

export function getGlobeImageUrl(style: MapStyle, customTextureUrl?: string): string | undefined {
    if (style === 'parchment' && customTextureUrl) {
        return customTextureUrl;
    }
    const s = styles.find(s => s.id === style);
    return s?.textureUrl;
}

export function getTileUrl(style: MapStyle): (x: number, y: number, level: number) => string {
    switch (style) {
        case 'satellite':
            return (x, y, level) =>
                `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${level}/${y}/${x}`;
        case 'topo':
            return (x, y, level) =>
                `https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/${level}/${y}/${x}`;
        case 'parchment':
        default:
            return (x, y, level) =>
                `https://a.basemaps.cartocdn.com/rastertiles/voyager_nolabels/${level}/${x}/${y}.png`;
    }
}
