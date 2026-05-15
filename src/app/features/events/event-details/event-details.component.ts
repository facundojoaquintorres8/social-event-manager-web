import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { EventsService } from '../../../core/services/events.service';
import { Event, EventStatus } from '../../../core/models/event.model';
import { ArrowLeft, LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../../core/services/toast.service';
import { InviteUserModalComponent } from '../invite-user-modal/invite-user-modal.component';

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

  readonly event = signal<Event | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly inviteModalOpen = signal(false);

  readonly EventStatus = EventStatus;
  readonly ArrowLeft = ArrowLeft;

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
    this.eventsService.inviteUser(this.event()!.id, email).subscribe({
      next: () => {
        this.toastService.show('Invitation sent successfully', 'success');
        this.inviteModalOpen.set(false);
        this.inviteModal?.resetLoading();
      },
      error: (err) => {
        this.toastService.show(err.error?.message ?? 'Failed to invite user', 'error');
        this.inviteModal?.resetLoading();
      },
    });
  }

  goBack(): void {
    this.location.back();
  }

  private loadEvent(eventId: string): void {
    this.loading.set(true);

    this.eventsService
      .getEventById(eventId)
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
}
