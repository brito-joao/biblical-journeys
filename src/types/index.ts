export type LocalizedString = string | { en: string; pt: string };

export interface TimelineEvent {
    order: number;
    city: LocalizedString;
    lat: number;
    lng: number;
    year: LocalizedString;
    description: LocalizedString;
    verses?: string;
    themeOverrides?: Record<string, [number, number]>;
    ancientMap?: { lat: number; lng: number };
}

export interface Location {
    lat: number;
    lng: number;
}
