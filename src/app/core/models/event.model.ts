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
  CANCELLED = 'CANCELLED',
}

export interface DashboardDTO {
  totalEvents: number;
  activeEvents: number;
  cancelledEvents: number;
  upcomingEvents: number;
  recentEvents: EventDTO[];
}
