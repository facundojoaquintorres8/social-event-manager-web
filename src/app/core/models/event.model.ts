export interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  locationAddress: string;
  placeId: string;
  latitude: number;
  longitude: number;
  createdBy: string;
  status: EventStatus;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  eventDate: string;
  location: string;
  locationAddress: string;
  placeId: string;
  latitude: number;
  longitude: number;
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
  locationAddress: string;
  placeId: string;
  latitude: number;
  longitude: number;
  invitedBy: string;
  status: InvitationStatus;
}

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export interface EventParticipant {
  firstName: string;
  lastName: string;
  email: string;
  status: InvitationStatus;
}
