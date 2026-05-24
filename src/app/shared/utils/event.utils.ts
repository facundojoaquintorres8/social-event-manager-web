import { EventStatus } from '../../core/models/event.model';

export function isEventExpired(eventDate: string | Date): boolean {
  return new Date(eventDate) < new Date();
}

export function canInteractWithEvent(eventDate: string | Date, status: EventStatus): boolean {
  return status !== EventStatus.CANCELLED && !isEventExpired(eventDate);
}
