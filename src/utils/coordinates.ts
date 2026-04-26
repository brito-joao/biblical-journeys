import { TimelineEvent } from "@/types";

export function getEventCoordinates(event: TimelineEvent, mapStyle: string): { lat: number; lng: number } {
    if (mapStyle === 'parchment' && event.ancientMap) {
        return { lat: event.ancientMap.lat, lng: event.ancientMap.lng };
    }
    if (event.themeOverrides && event.themeOverrides[mapStyle]) {
        const [lat, lng] = event.themeOverrides[mapStyle];
        return { lat, lng };
    }
    return { lat: event.lat, lng: event.lng };
}
