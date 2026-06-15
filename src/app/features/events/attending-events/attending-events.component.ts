import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventsService } from '../../../core/services/events.service';
import { Event } from '../../../core/models/event.model';
import { buildGoogleMapsUrl } from '../../../shared/utils/maps.utils';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { Calendar, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-attending-events',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, EmptyStateComponent],
  templateUrl: './attending-events.component.html',
})
export class AttendingEventsComponent implements OnInit {
  private readonly eventsService = inject(EventsService);

  events = signal<Event[]>([]);
  loading = signal(true);

  readonly buildGoogleMapsUrl = buildGoogleMapsUrl;
  readonly Calendar = Calendar;

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
    this.loading.set(true);

    this.eventsService.getAttendingEvents().subscribe({
      next: (response) => {
        this.events.set(response.data.content);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
