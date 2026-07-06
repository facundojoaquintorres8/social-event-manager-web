import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsService } from '../../../core/services/events.service';
import { Event, EventCardModel } from '../../../core/models/event.model';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { finalize } from 'rxjs';
import { EventCardComponent } from '../../../shared/components/event-card/event-card.component';
import { EventCardSkeletonComponent } from '../../../shared/components/event-card-skeleton/event-card-skeleton.component';
import { LucideCalendar } from '@lucide/angular';

@Component({
  selector: 'app-attending-events',
  standalone: true,
  imports: [
    CommonModule,
    EmptyStateComponent,
    ErrorStateComponent,
    EventCardComponent,
    EventCardSkeletonComponent,
    LucideCalendar,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './attending-events.component.html',
})
export class AttendingEventsComponent implements OnInit {
  private readonly eventsService = inject(EventsService);

  readonly events = signal<Event[]>([]);
  readonly error = signal<boolean>(false);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
    this.error.set(false);
    this.loading.set(true);

    this.eventsService
      .getAttendingEvents()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.events.set(response.data.content);
        },
        error: () => {
          this.error.set(true);
        },
      });
  }

  toEventCard(e: Event): EventCardModel {
    return {
      id: e.id,
      title: e.title,
      eventDate: e.eventDate,
      location: e.location,
      latitude: e.latitude,
      longitude: e.longitude,
      createdBy: e.createdBy,
      eventStatus: e.status,
    };
  }
}
