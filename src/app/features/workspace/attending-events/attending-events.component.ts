import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventsService } from '../../../core/services/events.service';
import { Event } from '../../../core/models/event.model';
import { buildGoogleMapsUrl } from '../../../shared/utils/maps.utils';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { Calendar, LucideAngularModule } from 'lucide-angular';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-attending-events',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
  templateUrl: './attending-events.component.html',
})
export class AttendingEventsComponent implements OnInit {
  private readonly eventsService = inject(EventsService);

  readonly events = signal<Event[]>([]);
  readonly error = signal<boolean>(false);
  readonly loading = signal(true);

  readonly buildGoogleMapsUrl = buildGoogleMapsUrl;
  readonly Calendar = Calendar;

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
}
