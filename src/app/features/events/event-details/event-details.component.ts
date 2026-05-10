import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { EventsService } from '../../../core/services/events.service';
import { EventDTO, EventStatus } from '../../../core/models/event.model';
import { ArrowLeft, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './event-details.component.html',
})
export class EventDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly eventsService = inject(EventsService);

  readonly event = signal<EventDTO | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

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
