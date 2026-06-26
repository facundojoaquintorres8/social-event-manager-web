import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventsService } from '../../../core/services/events.service';
import { CalendarEvent, InvitationStatus } from '../../../core/models/event.model';
import { finalize } from 'rxjs';
import { LucideAngularModule, X, ArrowRight } from 'lucide-angular';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';

@Component({
  selector: 'app-events-calendar',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, ErrorStateComponent],
  templateUrl: './events-calendar.component.html',
})
export class EventsCalendarComponent implements OnInit {
  private readonly eventsService = inject(EventsService);

  loading = signal(true);
  events = signal<CalendarEvent[]>([]);
  currentDate = signal(new Date());
  selectedDay = signal<{ date: Date; isCurrentMonth: boolean; events: CalendarEvent[] } | null>(
    null,
  );
  error = signal(false);

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
      events: CalendarEvent[];
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
  skeletonDays = computed(() => {
    const date = this.currentDate();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    return Array.from({ length: firstDay + daysInMonth });
  });

  readonly weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  readonly ArrowRight = ArrowRight;
  readonly X = X;

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
    this.loading.set(true);
    this.error.set(false);

    const currentDate = this.currentDate();

    const from = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(
      2,
      '0',
    )}-01T00:00:00`;

    const to = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(),
    ).padStart(2, '0')}T23:59:59`;

    this.eventsService
      .getCalendarEvents(from, to)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.events.set(response.data);
        },
        error: () => {
          this.error.set(true);
        },
      });
  }

  previousMonth() {
    const date = this.currentDate();
    this.currentDate.set(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    this.loadEvents();
  }

  nextMonth() {
    const date = this.currentDate();
    this.currentDate.set(new Date(date.getFullYear(), date.getMonth() + 1, 1));
    this.loadEvents();
  }

  selectDay(day: { date: Date; isCurrentMonth: boolean; events: CalendarEvent[] }): void {
    if (day.events.length === 0) return;
    this.selectedDay.set(day);
  }

  closeDay(): void {
    this.selectedDay.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeDay();
  }

  getEventDotClass(event: CalendarEvent): string {
    if (event.owner) {
      return 'bg-blue-500 dark:bg-blue-400';
    }

    switch (event.invitationStatus) {
      case InvitationStatus.ACCEPTED:
        return 'bg-green-500 dark:bg-green-400';
      case InvitationStatus.PENDING:
        return 'bg-yellow-500 dark:bg-yellow-400';
      case InvitationStatus.REJECTED:
        return 'bg-gray-400 dark:bg-gray-500';
      default:
        return 'bg-gray-300';
    }
  }

  getEventClasses(event: CalendarEvent): string {
    if (event.owner) {
      return `
      bg-blue-100
      text-blue-700
      hover:bg-blue-200
      dark:bg-blue-900/30
      dark:text-blue-300
    `;
    }

    switch (event.invitationStatus) {
      case InvitationStatus.ACCEPTED:
        return `
        bg-green-100
        text-green-700
        hover:bg-green-200
        dark:bg-green-900/30
        dark:text-green-300
      `;

      case InvitationStatus.PENDING:
        return `
        bg-yellow-100
        text-yellow-700
        hover:bg-yellow-200
        dark:bg-yellow-900/30
        dark:text-yellow-300
      `;

      case InvitationStatus.REJECTED:
        return `
        bg-gray-200
        text-gray-500
        opacity-70
        hover:bg-gray-300
        dark:bg-gray-800
        dark:text-gray-400
      `;

      default:
        return '';
    }
  }
}
