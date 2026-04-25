import { Location } from "@/types";

// Haversine formula to calculate distance between two lat/lng points in km
export function calculateDistance(loc1: Location, loc2: Location): number {
    const R = 6371; // Earth's radius in km
    const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
    const dLng = (loc2.lng - loc1.lng) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(loc1.lat * (Math.PI / 180)) *
        Math.cos(loc2.lat * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Scaffolding for trajectory calculations if needed
export function calculateMidpoint(loc1: Location, loc2: Location): Location {
    return {
        lat: (loc1.lat + loc2.lat) / 2,
        lng: (loc1.lng + loc2.lng) / 2,
    };
}
