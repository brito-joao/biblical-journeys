"use client";

import { useState, useEffect } from "react";

interface BiblePassageResult {
    text: string | null;
    reference: string | null;
    loading: boolean;
    error: string | null;
}

const cache: Record<string, { text: string; reference: string }> = {};

/**
 * Fetches a Bible passage from the free bible-api.com service.
 * Results are cached in memory to avoid duplicate requests.
 */
export function useBiblePassage(verseRef: string | undefined, translation: string): BiblePassageResult {
    const [text, setText] = useState<string | null>(null);
    const [reference, setReference] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!verseRef) return;
        const primaryRef = verseRef.split(",")[0].trim();
        const cacheKey = `${primaryRef}__${translation}`;
        const cached = cache[cacheKey];

        // If already cached, schedule state update via microtask to avoid sync setState-in-effect
        if (cached) {
            Promise.resolve().then(() => {
                setText(cached.text);
                setReference(cached.reference);
            });
            return;
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setError(null);
        const encoded = encodeURIComponent(primaryRef);

        fetch(`https://bible-api.com/${encoded}?translation=${translation}`)
            .then(r => r.json())
            .then(data => {
                if (data.text) {
                    cache[cacheKey] = { text: data.text.trim(), reference: data.reference };
                    setText(data.text.trim());
                    setReference(data.reference);
                } else {
                    setError("Passage not found");
                }
            })
            .catch(() => setError("Failed to load passage"))
            .finally(() => setLoading(false));
    }, [verseRef, translation]);

    return { text, reference, loading, error };
}
