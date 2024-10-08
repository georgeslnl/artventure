

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
    onEventAdded: (newEvent: Event) => void;
    onEventDelete: (id: string) => void;
    onEventEdit: (updatedEvent: Event) => void;
}

export interface ExhibCardProps {
    _id: string;
    name: string;
    museum: string;
    link: string;
    status: "Horizon" | "Itinerary" | "Travelogue";
    onEventDelete: (id: string) => void;
    onEventEdit: (updatedEvent: Event) => void;
}

