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
  ArrowRight,
  CalendarDays,
} from 'lucide-angular';
import { EventsService } from '../../core/services/events.service';
import { Dashboard } from '../../core/models/event.model';
import { AuthService } from '../../core/services/auth.service';
import { buildGoogleMapsUrl } from '../../shared/utils/maps.utils';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { StatusLabelPipe } from '../../shared/utils/status-label.pipe';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule,
    EmptyStateComponent,
    StatusLabelPipe,
    ErrorStateComponent,
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
  readonly ArrowRight = ArrowRight;
  readonly CalendarDays = CalendarDays;

  readonly buildGoogleMapsUrl = buildGoogleMapsUrl;

  constructor() {
    this.loadDashboard();
  }

  openMaps(e: MouseEvent, lat: number, lng: number): void {
    e.stopPropagation();
    e.preventDefault();
    window.open(this.buildGoogleMapsUrl(lat, lng), '_blank', 'noopener,noreferrer');
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
}
