export type NotificationType =
  | 'INVITATION_RECEIVED'
  | 'INVITATION_ACCEPTED'
  | 'INVITATION_REJECTED'
  | 'EVENT_EDITED'
  | 'EVENT_CANCELLED'
  | 'CONTRIBUTION_ADDED'
  | 'CONTRIBUTION_EDITED'
  | 'CONTRIBUTION_DELETED'
  | 'CONTRIBUTION_COMPLETED';

export interface Notification {
  id: string;
  eventId: string;
  type: NotificationType;
  params: Record<string, string>;
  read: boolean;
  readAt: string | null;
  createdAt: string;
}
