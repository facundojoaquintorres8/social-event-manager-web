import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsService } from '../../core/services/events.service';
import { EventDTO } from '../../core/models/event.model';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit {

  private readonly eventsService = inject(EventsService);

  readonly events = signal<EventDTO[]>([]);
  readonly totalPages = signal(0);
  readonly currentPage = signal(0);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadEvents();
  }

  public loadEvents(page = 0): void {
    this.loading.set(true);

    this.eventsService.getMyEvents(page).subscribe({
      next: (res) => {
        const pageData = res.data;

        this.events.set(pageData.content);
        this.totalPages.set(pageData.totalPages);
        this.currentPage.set(pageData.number);
      },
      error: () => {
        this.error.set('Error loading events');
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }
}