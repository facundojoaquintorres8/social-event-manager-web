import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { EventsService } from '../../core/services/events.service';
import { Dashboard, Event, EventCardModel, Invitation } from '../../core/models/event.model';
import { AuthService } from '../../core/services/auth.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { EventCardComponent } from '../../shared/components/event-card/event-card.component';
import { EventCardSkeletonComponent } from '../../shared/components/event-card-skeleton/event-card-skeleton.component';
import {
  LucideCalendar,
  LucideCircleCheckBig,
  LucideCircleX,
  LucideClock,
  LucidePlus,
} from '@lucide/angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    EmptyStateComponent,
    ErrorStateComponent,
    EventCardComponent,
    EventCardSkeletonComponent,
    LucideCalendar,
    LucideCircleCheckBig,
    LucideCircleX,
    LucideClock,
    LucidePlus,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private readonly eventsService = inject(EventsService);
  readonly authService = inject(AuthService);

  readonly loading = signal(true);
  readonly dashboard = signal<Dashboard | null>(null);
  readonly error = signal(false);

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

  toInvitationCard(inv: Invitation): EventCardModel {
    return {
      id: inv.eventId,
      title: inv.title,
      eventDate: inv.eventDate,
      location: inv.location,
      latitude: inv.latitude,
      longitude: inv.longitude,
      createdBy: inv.createdBy,
      eventStatus: inv.eventStatus,
      invitationId: inv.invitationId,
      invitationStatus: inv.status,
    };
  }
}
