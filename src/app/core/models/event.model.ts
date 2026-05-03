export interface EventDTO {
    id: string;
    title: string;
    description: string;
    eventDate: string;
    location: string;
    status: EventStatus;
}

export interface CreateEventRequestDTO {
    title: string;
    description?: string;
    eventDate: string;
    location: string;
}

export enum EventStatus {
    ACTIVE = 'ACTIVE',
    CANCELLED = 'CANCELLED'
}