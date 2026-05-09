import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsService } from '../../core/services/events.service';
import { EventDTO, EventStatus } from '../../core/models/event.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideAngularModule, Plus, Pencil, X } from 'lucide-angular';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    LucideAngularModule,
    ConfirmModalComponent,
  ],
  templateUrl: './events.component.html',
})
export class EventsComponent implements OnInit {
  private readonly eventsService = inject(EventsService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly events = signal<EventDTO[]>([]);
  readonly totalPages = signal(0);
  readonly currentPage = signal(0);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly actionLoading = signal<string | null>(null);
  readonly confirmModalOpen = signal<boolean>(false);
  readonly selectedEventId = signal<string | null>(null);

  readonly Plus = Plus;
  readonly Pencil = Pencil;
  readonly X = X;

  readonly filterForm = this.fb.nonNullable.group({
    title: [''],
    fromDate: [''],
    toDate: [''],
    status: [''],
  });
  readonly EventStatus = EventStatus;

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

  openCancelModal(eventId: string): void {
    if (this.actionLoading()) return;
    this.selectedEventId.set(eventId);
    this.confirmModalOpen.set(true);
  }

  confirmCancel(): void {
    const eventId = this.selectedEventId();

    if (!eventId) return;

    this.confirmModalOpen.set(false);
    this.selectedEventId.set(null);

    this.cancelEvent(eventId);
  }

  closeModal(): void {
    this.confirmModalOpen.set(false);
    this.selectedEventId.set(null);
  }

  cancelEvent(eventId: string): void {
    this.actionLoading.set(eventId);

    this.eventsService
      .cancelEvent(eventId)
      .pipe(finalize(() => this.actionLoading.set(null)))
      .subscribe({
        next: () => {
          this.toastService.show('Event cancelled');
          this.events.update((events) =>
            events.map((e) => (e.id === eventId ? { ...e, status: EventStatus.CANCELLED } : e)),
          );
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 400 && err.error?.message) {
            this.toastService.show(err.error.message, 'error');
            return;
          }
          this.toastService.show('Unexpected error occurred', 'error');
        },
      });
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
    this.loading.set(true);
    this.error.set(null);

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
        },
        error: () => {
          this.toastService.show('Error loading events', 'error');
          this.error.set('Error loading events');
        },
      });
  }

  private formatDate(date: string, endOfDay = false): string | undefined {
    if (!date) return undefined;

    return endOfDay ? `${date}T23:59:59` : `${date}T00:00:00`;
  }
}
