import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventsService } from '../../../core/services/events.service';
import { Event } from '../../../core/models/event.model';

@Component({
  selector: 'app-attending-events',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './attending-events.component.html',
})
export class AttendingEventsComponent implements OnInit {
  private readonly eventsService = inject(EventsService);

  events = signal<Event[]>([]);
  loading = signal(true);

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
