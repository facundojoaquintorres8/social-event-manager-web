import {
  EventStatus,
  Contribution,
  EventFull,
  InvitationStatus,
} from '../../core/models/event.model';

export function isEventExpired(eventDate: string | Date): boolean {
  return new Date(eventDate) < new Date();
}

export function canInteractWithEvent(eventDate: string | Date, status: EventStatus): boolean {
  return status !== EventStatus.CANCELLED && !isEventExpired(eventDate);
}

export function canManageContributions(event: EventFull, currentUserEmail?: string): boolean {
  if (!event || !currentUserEmail) {
    return false;
  }

  if (event.owner) {
    return true;
  }

  const participant = event.participants.find(
    (participant) => participant.email.toLowerCase() === currentUserEmail.toLowerCase(),
  );

  return participant?.status === InvitationStatus.ACCEPTED;
}

export function canEditContribution(
  event: EventFull,
  contribution: Contribution,
  currentUserEmail?: string,
): boolean {
  if (!event || !currentUserEmail) {
    return false;
  }

  if (event.owner) {
    return true;
  }

  return contribution.createdByEmail.toLowerCase() === currentUserEmail.toLowerCase();
}
