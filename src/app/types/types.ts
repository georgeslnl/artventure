export interface Event {
    _id: string;
    name: string;
    date?: string;
    museum: string;
    link: string;
    status: "Horizon" | "Itinerary" | "Travelogue";
}

export interface ListCardProps {
    title: string;
    events: Event[];
    bgColor: string;
}

export interface ExhibCardProps {
    name: string;
    museum: string;
    link: string;
}

