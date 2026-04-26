"use client";

import { useTranslation } from "./useTranslation";
import { Language } from "@/lib/i18n";

export function useLanguage() {
    const { translation, setTranslation } = useTranslation();
    
    // We treat 'almeida' as the flag for Portuguese mode
    const language: Language = translation === 'almeida' ? 'pt' : 'en';

    // Sets both the UI language AND the default scripture API translation
    const setLanguage = (lang: Language) => {
        setTranslation(lang === 'pt' ? 'almeida' : 'web');
    };

    return { language, setLanguage };
}
