import { jesusJourneys } from "./journeys/jesus";
import { paulJourneys } from "./journeys/paul_1";
import { davidJourneys } from "./journeys/david";
import { exodusJourneys } from "./journeys/exodus";
import { TimelineEvent } from "@/types";

export interface Journey {
    id: string;
    name: string;
    data: TimelineEvent[];
}

export const availableJourneys: Journey[] = [
    { id: "jesus", name: "Life of Jesus", data: jesusJourneys },
    { id: "paul1", name: "Paul's First Journey", data: paulJourneys },
    { id: "david", name: "Life of David", data: davidJourneys },
    { id: "exodus", name: "The Exodus", data: exodusJourneys },
];
