import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { EventsService } from '../../../core/services/events.service';
import { EventFull, EventStatus, InvitationStatus } from '../../../core/models/event.model';
import { LucideAngularModule, Trash2, ArrowLeft } from 'lucide-angular';
import { ToastService } from '../../../core/services/toast.service';
import { InviteUserModalComponent } from '../invite-user-modal/invite-user-modal.component';
import { buildGoogleMapsUrl } from '../../../shared/utils/maps.utils';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, InviteUserModalComponent],
  templateUrl: './event-details.component.html',
})
export class EventDetailsComponent implements OnInit {
  @ViewChild(InviteUserModalComponent)
  inviteModal?: InviteUserModalComponent;

  private readonly route = inject(ActivatedRoute);
  private readonly eventsService = inject(EventsService);
  private readonly toastService = inject(ToastService);
  private readonly location = inject(Location);

  readonly event = signal<EventFull | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly inviteModalOpen = signal(false);
  readonly removingParticipant = signal<string | null>(null);

  readonly EventStatus = EventStatus;
  readonly InvitationStatus = InvitationStatus;
  readonly Trash2 = Trash2;
  readonly ArrowLeft = ArrowLeft;

  readonly buildGoogleMapsUrl = buildGoogleMapsUrl;

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');

    if (!eventId) {
      this.error.set('Invalid event');
      this.loading.set(false);
      return;
    }

    this.loadEvent(eventId);
  }

  inviteUser(email: string) {
    const currentEvent = this.event();

    if (!currentEvent) return;

    this.eventsService.inviteUser(currentEvent.id, email).subscribe({
      next: () => {
        this.toastService.show('Invitation sent successfully', 'success');

        this.inviteModalOpen.set(false);

        this.inviteModal?.resetLoading();

        this.refreshEvent(currentEvent.id);
      },
      error: () => {
        this.inviteModal?.resetLoading();
      },
    });
  }

  removeParticipant(email: string) {
    const currentEvent = this.event();

    if (!currentEvent) return;

    this.removingParticipant.set(email);

    this.eventsService
      .removeInvitation(currentEvent.id, email)
      .pipe(finalize(() => this.removingParticipant.set(null)))
      .subscribe({
        next: () => {
          this.toastService.show('Participant removed successfully', 'success');

          this.event.update((event) => {
            if (!event) return event;

            return {
              ...event,
              participants: event.participants.filter((participant) => participant.email !== email),
            };
          });
        },
      });
  }

  goBack(): void {
    this.location.back();
  }

  private loadEvent(eventId: string): void {
    this.loading.set(true);

    this.eventsService
      .getFullEventById(eventId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.event.set(res.data);
        },
        error: () => {
          this.error.set('Error loading event');
        },
      });
  }

  private refreshEvent(eventId: string): void {
    this.eventsService.getFullEventById(eventId).subscribe({
      next: (res) => {
        this.event.set(res.data);
      },
      error: () => {
        this.toastService.show('Error refreshing event', 'error');
      },
    });
  }
}
