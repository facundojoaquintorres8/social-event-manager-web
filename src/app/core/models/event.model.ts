export interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  createdBy: string;
  status: EventStatus;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  eventDate: string;
  location: string;
}

export enum EventStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
}

export interface Dashboard {
  totalEvents: number;
  activeEvents: number;
  cancelledEvents: number;
  upcomingEvents: number;
  recentEvents: Event[];
}

export interface Invitation {
  invitationId: string;
  eventId: string;
  title: string;
  eventDate: string;
  location: string;
  invitedBy: string;
  status: InvitationStatus;
}

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}
