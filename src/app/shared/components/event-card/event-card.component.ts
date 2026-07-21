import {
  Component,
  signal,
  HostListener,
  inject,
  output,
  input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  EventCardModel,
  EventCardVariant,
  EventStatus,
  InvitationStatus,
} from '../../../core/models/event.model';
import { canInteractWithEvent, isEventExpired } from '../../utils/event.utils';
import { StatusLabelPipe } from '../../utils/status-label.pipe';
import { buildGoogleMapsUrl } from '../../utils/maps.utils';
import { LucideArrowRight, LucideEllipsisVertical, LucidePencil, LucideX } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    CommonModule,
    StatusLabelPipe,
    LucideArrowRight,
    LucideEllipsisVertical,
    LucidePencil,
    LucideX,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-card.component.html',
})
export class EventCardComponent {
  event = input.required<EventCardModel>();
  variant = input.required<EventCardVariant>();
  showButtons = input<boolean>(true);
  loadingAction = input<'accept' | 'reject' | null>(null);

  cancelEvent = output<string>();
  acceptInvitation = output<string>();
  rejectInvitation = output<string>();

  readonly router = inject(Router);

  readonly menuOpen = signal(false);

  readonly EventStatus = EventStatus;
  readonly InvitationStatus = InvitationStatus;
  readonly canInteractWithEvent = canInteractWithEvent;
  readonly isEventExpired = isEventExpired;

  navigateToDetail(): void {
    this.router.navigate(['/events', this.event().id]);
  }

  openMaps(e: Event): void {
    e.stopPropagation();
    e.preventDefault();
    window.open(
      buildGoogleMapsUrl(this.event().latitude, this.event().longitude),
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
    return (
      canInteractWithEvent(this.event().eventDate, this.event().eventStatus) && this.showButtons()
    );
  }

  get expired(): boolean {
    return isEventExpired(this.event().eventDate);
  }
}
