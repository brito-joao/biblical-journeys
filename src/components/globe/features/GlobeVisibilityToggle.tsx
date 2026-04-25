interface GlobeVisibilityToggleProps {
    showAll: boolean;
    onChange: (showAll: boolean) => void;
}

export default function GlobeVisibilityToggle({ showAll, onChange }: GlobeVisibilityToggleProps) {
    return (
        <div className="absolute top-14 right-2 md:top-auto md:bottom-[92px] md:right-6 z-20">
            <button
                onClick={() => onChange(!showAll)}
                title={showAll ? "Hide Future Cities" : "Show All Cities"}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '7px 12px',
                    background: showAll 
                        ? '#2c2015'
                        : 'linear-gradient(180deg, #f0e8d5 0%, #e4d9bc 100%)',
                    border: '1.5px solid rgba(196,149,42,0.55)',
                    boxShadow: '0 4px 12px rgba(44,32,21,0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                }}
            >
                {showAll ? (
                    <svg style={{ width: '14px', height: '14px', color: '#e0b84a' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                ) : (
                    <svg style={{ width: '14px', height: '14px', color: '#9a7518' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                )}
                <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: showAll ? '#e0b84a' : '#6b4c28',
                    fontFamily: 'var(--font-merriweather, serif)',
                }}>
                    {showAll ? "All Cities" : "Active Only"}
                </span>
            </button>
        </div>
    );
}
