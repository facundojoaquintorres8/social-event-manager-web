export interface EventDTO {
    id: string;
    title: string;
    description: string;
    eventDate: string;
    location: string;
}

export interface CreateEventRequestDTO {
    title: string;
    description: string;
    eventDate: string;
    location: string;
}