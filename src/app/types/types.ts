

export interface Event {
    name: string;
    date?: string;
    museum: string;
    link?: string;
    status: "Horizon" | "Itinerary" | "Travelogue" | "";
}

export interface ListCardProps {
    title: string;
    events: Event[];
    bgColor: string;
    onEventAdded: (newEvent: Event) => void;
}

export interface ExhibCardProps {
    name: string;
    museum: string;
    link?: string;
}

