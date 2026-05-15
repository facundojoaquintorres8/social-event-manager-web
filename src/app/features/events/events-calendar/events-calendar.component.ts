import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventsService } from '../../../core/services/events.service';
import { Event } from '../../../core/models/event.model';

@Component({
  selector: 'app-events-calendar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './events-calendar.component.html',
})
export class EventsCalendarComponent implements OnInit {
  private readonly eventsService = inject(EventsService);

  loading = signal(true);

  events = signal<Event[]>([]);

  currentDate = signal(new Date());

  readonly weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
    this.loading.set(true);

    this.eventsService.getMyEvents({ page: 0, size: 50 }).subscribe({
      next: (response) => {
        this.events.set(response.data.content);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  monthLabel = computed(() => {
    return this.currentDate().toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  });

  calendarDays = computed(() => {
    const date = this.currentDate();

    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);

    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();

    const startWeekDay = firstDay.getDay();

    const days: {
      date: Date;
      isCurrentMonth: boolean;
      events: Event[];
    }[] = [];

    for (let i = 0; i < startWeekDay; i++) {
      days.push({
        date: new Date(year, month, -(startWeekDay - i - 1)),
        isCurrentMonth: false,
        events: [],
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(year, month, day);

      const dayEvents = this.events().filter((event) => {
        const eventDate = new Date(event.eventDate);

        return (
          eventDate.getDate() === currentDay.getDate() &&
          eventDate.getMonth() === currentDay.getMonth() &&
          eventDate.getFullYear() === currentDay.getFullYear()
        );
      });

      days.push({
        date: currentDay,
        isCurrentMonth: true,
        events: dayEvents,
      });
    }

    return days;
  });

  previousMonth() {
    const date = this.currentDate();
    this.currentDate.set(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  }

  nextMonth() {
    const date = this.currentDate();
    this.currentDate.set(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  }
}
