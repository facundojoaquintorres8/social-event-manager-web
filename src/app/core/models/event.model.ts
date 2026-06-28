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

export interface EventFull extends Event {
  participants: EventParticipant[];
  contributions: Contribution[];
  createdById: string;
  owner: boolean;
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
  recentInvitations: Invitation[];
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
  createdBy: string;
  status: InvitationStatus;
  eventStatus: EventStatus;
}

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export interface EventParticipant {
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  external: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  eventDate: string;
  location: string;
  eventStatus: EventStatus;
  invitationStatus?: InvitationStatus;
  owner: boolean;
}

export interface ExternalInvitationPreview {
  eventId: string;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  latitude: number;
  longitude: number;
  createdBy: string;
  status: ExternalInvitationStatus;
  alreadyClaimed: boolean;
  invitedEmail: string;
}

export enum ExternalInvitationStatus {
  PENDING = 'PENDING',
  CLAIMED = 'CLAIMED',
  CANCELLED = 'CANCELLED',
}

export interface Contribution {
  id: string;
  name: string;
  description?: string;
  cost?: number;
  splitCost: boolean;
  completed: boolean;
  createdById: string;
  createdBy: string;
  createdByEmail: string;
  owner: boolean;
}

export interface CreateContributionRequest {
  name: string;
  description?: string;
  cost?: number | null;
  splitCost: boolean;
}

export interface UpdateContributionStatusRequest {
  completed: boolean;
}

export interface BalanceParticipantRequest {
  userId?: string;
  name: string;
}

export interface BalanceRequest {
  participants: BalanceParticipantRequest[];
}

export interface BalanceResponse {
  totalCost: number;
  participantCount: number;
  costPerPerson: number;
  balances: BalanceParticipant[];
  settlements: Settlement[];
}

export interface BalanceParticipant {
  name: string;
  paid: number;
  shouldPay: number;
  balance: number;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export type EventCardVariant = 'created' | 'attending' | 'invitations' | 'dashboard';

export interface EventCardModel {
  id: string; // eventId or invitationId
  title: string;
  eventDate: string;
  location: string;
  latitude: number;
  longitude: number;
  createdBy: string;
  eventStatus: EventStatus;
  invitationId?: string; // only invitations
  invitationStatus?: InvitationStatus; // only invitations
}
