import { Component, signal, HostListener, inject, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, ArrowRight, EllipsisVertical, Pencil, X } from 'lucide-angular';
import {
  EventCardModel,
  EventCardVariant,
  EventStatus,
  InvitationStatus,
} from '../../../core/models/event.model';
import { canInteractWithEvent, isEventExpired } from '../../utils/event.utils';
import { StatusLabelPipe } from '../../utils/status-label.pipe';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, StatusLabelPipe],
  templateUrl: './event-card.component.html',
})
export class EventCardComponent {
  event = input.required<EventCardModel>();
  variant = input.required<EventCardVariant>();
  loadingAction = input<'accept' | 'reject' | null>(null);

  cancelEvent = output<string>();
  acceptInvitation = output<string>();
  rejectInvitation = output<string>();

  readonly router = inject(Router);

  readonly menuOpen = signal(false);

  readonly ArrowRight = ArrowRight;
  readonly EllipsisVertical = EllipsisVertical;
  readonly Pencil = Pencil;
  readonly X = X;
  readonly EventStatus = EventStatus;
  readonly InvitationStatus = InvitationStatus;
  readonly canInteractWithEvent = canInteractWithEvent;
  readonly isEventExpired = isEventExpired;

  navigateToDetail(): void {
    this.router.navigate(['/events', this.event().id]);
  }

  openMaps(e: MouseEvent): void {
    e.stopPropagation();
    e.preventDefault();
    window.open(
      `https://www.google.com/maps?q=${this.event().latitude},${this.event().longitude}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  toggleMenu(e: MouseEvent): void {
    e.stopPropagation();
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeMenu();
  }

  get showOrganizer(): boolean {
    return this.variant() === 'attending' || this.variant() === 'invitations';
  }

  get canInteract(): boolean {
    return canInteractWithEvent(this.event().eventDate, this.event().eventStatus);
  }

  get expired(): boolean {
    return isEventExpired(this.event().eventDate);
  }
}
