/**
 * Haversine formula to calculate distance between two lat/lng points.
 * Returns distance in kilometers.
 */
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface TravelMetrics {
    km: number;
    walkingDays: number;
    donkeyDays: number;
}

/**
 * Returns distance and estimated ancient travel times between two points.
 * Walking speed: ~30km/day on Roman roads. Donkey: ~40km/day.
 */
export function getTravelMetrics(lat1: number, lng1: number, lat2: number, lng2: number): TravelMetrics {
    const km = haversineKm(lat1, lng1, lat2, lng2);
    return {
        km: Math.round(km),
        walkingDays: Math.round(km / 30),
        donkeyDays: Math.round(km / 40),
    };
}
