export const UI_TRANSLATIONS = {
    en: {
        title: "Biblical Journeys",
        allCities: "All Cities",
        activeOnly: "Active Only",
        readPassage: "Read Passage",
        hidePassage: "Hide Passage",
        close: "Close",
        next: "Next",
        more: "More ∨",
        less: "Less ∧",
        consulting: "Consulting the scriptures...",
        walk: "walk",
        from: "from",
        km: "km",
        showAllCities: "Show All Cities",
        hideFutureCities: "Hide Future Cities"
    },
    pt: {
        title: "Jornadas Bíblicas",
        allCities: "Todas Cidades",
        activeOnly: "Apenas Ativas",
        readPassage: "Ler Passagem",
        hidePassage: "Ocultar Passagem",
        close: "Fechar",
        next: "Próximo",
        more: "Mais ∨",
        less: "Menos ∧",
        consulting: "Consultando as escrituras...",
        walk: "caminhada",
        from: "de",
        km: "km",
        showAllCities: "Mostrar Todas as Cidades",
        hideFutureCities: "Ocultar Cidades Futuras"
    }
};

export type Language = 'en' | 'pt';

// Helper to translate static UI elements
export function t(key: keyof typeof UI_TRANSLATIONS['en'], lang: Language) {
    return UI_TRANSLATIONS[lang][key] || UI_TRANSLATIONS['en'][key];
}

// Helper to translate dynamic database content based on LocalizedString typing
export function tData(field: string | { en: string, pt: string }, lang: Language): string {
    if (!field) return "";
    if (typeof field === 'string') return field;
    return field[lang] || field.en;
}
