"use client";

import { useState } from "react";

interface TranslationOption {
    id: string;
    name: string;
}

const TRANSLATIONS: TranslationOption[] = [
    { id: "kjv", name: "KJV" },
    { id: "web", name: "WEB" },
    { id: "asv", name: "ASV" },
    { id: "darby", name: "Darby" },
    { id: "ylt", name: "YLT" },
];

const TRANSLATION_KEY = "bible_map_translation";

function getStoredTranslation(): string {
    if (typeof window === "undefined") return "kjv";
    return localStorage.getItem(TRANSLATION_KEY) || "kjv";
}

export function useTranslation() {
    const [translation, setTranslationState] = useState(getStoredTranslation);

    const setTranslation = (id: string) => {
        localStorage.setItem(TRANSLATION_KEY, id);
        setTranslationState(id);
    };

    return { translation, setTranslation, TRANSLATIONS };
}
