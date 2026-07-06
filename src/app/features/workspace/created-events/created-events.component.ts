import {
  Component,
  inject,
  signal,
  OnInit,
  DestroyRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { EventsService } from '../../../core/services/events.service';
import { ToastService } from '../../../core/services/toast.service';
import { Event, EventCardModel, EventStatus } from '../../../core/models/event.model';
import { EventCardComponent } from '../../../shared/components/event-card/event-card.component';
import { EventCardSkeletonComponent } from '../../../shared/components/event-card-skeleton/event-card-skeleton.component';
import { LucideCalendarDays, LucideCalendarX2, LucidePlus } from '@lucide/angular';

@Component({
  selector: 'app-created-events',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ConfirmModalComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    EventCardComponent,
    EventCardSkeletonComponent,
    LucidePlus,
    LucideCalendarX2,
    LucideCalendarDays,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './created-events.component.html',
})
export class CreatedEventsComponent implements OnInit {
  private readonly eventsService = inject(EventsService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly events = signal<Event[]>([]);
  readonly hasEvents = signal(false);
  readonly totalPages = signal(0);
  readonly currentPage = signal(0);
  readonly loading = signal(true);
  readonly error = signal<boolean>(false);
  readonly cancelModalOpen = signal<boolean>(false);
  readonly cancelling = signal(false);
  private readonly selectedEventId = signal<string | null>(null);

  readonly EventStatus = EventStatus;

  readonly filterForm = this.fb.nonNullable.group({
    title: [''],
    fromDate: [''],
    toDate: [''],
    status: [''],
  });

  ngOnInit(): void {
    this.initFromQueryParams();
    this.listenToQueryParams();
    this.listenToFilters();
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages()) {
      return;
    }
    this.updateQueryParams(page);
  }

  retryLoad(): void {
    const page = this.currentPage();
    this.loadEvents(page);
  }

  openCancelModal(eventId: string): void {
    this.cancelModalOpen.set(true);
    this.selectedEventId.set(eventId);
  }

  closeCancelModal(): void {
    this.cancelModalOpen.set(false);
    this.selectedEventId.set(null);
  }

  confirmCancel(): void {
    const eventId = this.selectedEventId();
    if (!eventId) return;

    this.cancelling.set(true);
    this.eventsService
      .cancelEvent(eventId)
      .pipe(finalize(() => this.cancelling.set(false)))
      .subscribe({
        next: () => {
          this.toastService.show('Event cancelled successfully', 'success');
          this.listenToQueryParams();
          this.closeCancelModal();
        },
        error: () => {
          this.toastService.show('Failed to cancel event', 'error');
        },
      });
  }

  hasActiveFilters(): boolean {
    const filters = this.filterForm.getRawValue();
    return !!(filters.title || filters.fromDate || filters.toDate || filters.status);
  }

  clearFilters(): void {
    this.filterForm.reset({
      title: '',
      fromDate: '',
      toDate: '',
      status: '',
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

  private initFromQueryParams(): void {
    const params = this.route.snapshot.queryParams;

    this.filterForm.patchValue(
      {
        title: params['title'] || '',
        fromDate: params['fromDate'] || '',
        toDate: params['toDate'] || '',
        status: params['status'] || '',
      },
      { emitEvent: false },
    );
  }

  private listenToQueryParams(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const page = Number(params['page'] || 0);
      this.loadEvents(page);
    });
  }

  private listenToFilters(): void {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.updateQueryParams(0);
      });
  }

  private updateQueryParams(page: number): void {
    const filters = this.filterForm.getRawValue();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page,
        title: filters.title || null,
        fromDate: filters.fromDate || null,
        toDate: filters.toDate || null,
        status: filters.status || null,
      },
      queryParamsHandling: 'merge',
    });
  }

  private loadEvents(page = 0): void {
    this.error.set(false);
    this.loading.set(true);

    const params = this.route.snapshot.queryParams;

    this.eventsService
      .getMyEvents({
        page,
        title: params['title'],
        fromDate: this.formatDate(params['fromDate']),
        toDate: this.formatDate(params['toDate'], true),
        status: params['status'],
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          const pageData = res.data;

          this.events.set(pageData.content);
          this.totalPages.set(pageData.totalPages);
          this.currentPage.set(pageData.number);
          if (!this.hasEvents() && pageData.totalElements > 0) {
            this.hasEvents.set(true);
          }
        },
        error: () => {
          this.error.set(true);
        },
      });
  }

  private formatDate(date: string, endOfDay = false): string | undefined {
    if (!date) return undefined;

    return endOfDay ? `${date}T23:59:59` : `${date}T00:00:00`;
  }
}
