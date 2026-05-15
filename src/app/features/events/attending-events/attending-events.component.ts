import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { EventsService } from '../../../core/services/events.service';
import { ToastService } from '../../../core/services/toast.service';
import { Event } from '../../../core/models/event.model';

@Component({
  selector: 'app-attending-events',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './attending-events.component.html',
})
export class AttendingEventsComponent implements OnInit {
  private readonly eventsService = inject(EventsService);
  private readonly toastService = inject(ToastService);

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
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);

        if (err.status === 400 && err.error?.message) {
          this.toastService.show(err.error.message, 'error');
          return;
        }

        this.toastService.show('Unexpected error occurred', 'error');
      },
    });
  }
}
