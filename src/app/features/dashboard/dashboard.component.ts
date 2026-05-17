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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private readonly eventsService = inject(EventsService);
  readonly authService = inject(AuthService);

  readonly loading = signal(true);
  readonly dashboard = signal<Dashboard | null>(null);

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

  private loadDashboard(): void {
    this.eventsService
      .getDashboard()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.dashboard.set(res.data);
        },
      });
  }
}
