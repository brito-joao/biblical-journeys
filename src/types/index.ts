export interface TimelineEvent {
    order: number;
    city: string;
    lat: number;
    lng: number;
    year: string;
    description: string;
    verses?: string;
}

export interface Location {
    lat: number;
    lng: number;
}
