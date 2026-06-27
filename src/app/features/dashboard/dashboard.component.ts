import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import {
  LucideAngularModule,
  Calendar,
  CircleCheckBig,
  CircleX,
  Clock,
  Plus,
} from 'lucide-angular';
import { EventsService } from '../../core/services/events.service';
import { Dashboard, Event, EventCardModel } from '../../core/models/event.model';
import { AuthService } from '../../core/services/auth.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { EventCardComponent } from '../../shared/components/event-card/event-card.component';
import { EventCardSkeletonComponent } from '../../shared/components/event-card-skeleton/event-card-skeleton.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule,
    EmptyStateComponent,
    ErrorStateComponent,
    EventCardComponent,
    EventCardSkeletonComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private readonly eventsService = inject(EventsService);
  readonly authService = inject(AuthService);

  readonly loading = signal(true);
  readonly dashboard = signal<Dashboard | null>(null);
  readonly error = signal(false);

  readonly Calendar = Calendar;
  readonly CircleCheckBig = CircleCheckBig;
  readonly CircleX = CircleX;
  readonly Clock = Clock;
  readonly Plus = Plus;

  constructor() {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.error.set(false);
    this.loading.set(true);

    this.eventsService
      .getDashboard()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.dashboard.set(res.data);
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
