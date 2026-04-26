import { jesusJourneys } from "./journeys/jesus";
import { paulJourneys } from "./journeys/paul_1";
import { davidJourneys } from "./journeys/david";
import { exodusJourneys } from "./journeys/exodus";
import { TimelineEvent } from "@/types";
import { abrahamJourneys } from "./journeys/abraham";

export interface Journey {
    id: string;
    name: string;
    data: TimelineEvent[];
    mapTextureUrl?: string;
}

export const availableJourneys: Journey[] = [
    { id: "jesus", name: "Life of Jesus", data: jesusJourneys, mapTextureUrl: "/textures/map_jesus.webp" },
    { id: "paul1", name: "Paul's First Journey", data: paulJourneys, mapTextureUrl: "/textures/map_paul.webp" },
    { id: "david", name: "Life of David", data: davidJourneys, mapTextureUrl: "/textures/map_david.webp" },
    { id: "exodus", name: "The Exodus", data: exodusJourneys, mapTextureUrl: "/textures/map_exodus.webp" },
    { id: "abraham", name: "Life of Abraham", data: abrahamJourneys, mapTextureUrl: "/textures/map_abraham.webp" },
];
