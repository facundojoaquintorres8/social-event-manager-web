import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsService } from '../../core/services/events.service';
import { EventDTO, EventStatus } from '../../core/models/event.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit {

  private readonly eventsService = inject(EventsService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly events = signal<EventDTO[]>([]);
  readonly totalPages = signal(0);
  readonly currentPage = signal(0);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly filterForm = this.fb.nonNullable.group({
    title: [''],
    fromDate: [''],
    toDate: [''],
    status: ['']
  });
  readonly EventStatus = EventStatus;

  ngOnInit(): void {
    this.initFromQueryParams();
    this.listenToQueryParams();
    this.listenToFilters();
  }

  goToPage(page: number): void {
    this.updateQueryParams(page);
  }

  private initFromQueryParams(): void {
    const params = this.route.snapshot.queryParams;

    this.filterForm.patchValue({
      title: params['title'] || '',
      fromDate: params['fromDate'] || '',
      toDate: params['toDate'] || '',
      status: params['status'] || ''
    }, { emitEvent: false });
  }

  private listenToQueryParams(): void {
    this.route.queryParams.subscribe(params => {

      const page = Number(params['page'] || 0);

      this.loadEvents(page);
    });
  }

  private listenToFilters(): void {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
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
        status: filters.status || null
      },
      queryParamsHandling: 'merge'
    });
  }

  private loadEvents(page = 0): void {
    this.loading.set(true);

    const params = this.route.snapshot.queryParams;

    this.eventsService.getMyEvents({
      page,
      title: params['title'],
      fromDate: this.formatDate(params['fromDate']),
      toDate: this.formatDate(params['toDate'], true),
      status: params['status']
    })
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (res) => {
          const pageData = res.data;

          this.events.set(pageData.content);
          this.totalPages.set(pageData.totalPages);
          this.currentPage.set(pageData.number);
        },
        error: () => {
          this.error.set('Error loading events');
        }
      });
  }

  private formatDate(date: string, endOfDay = false): string | undefined {
    if (!date) return undefined;

    return endOfDay
      ? `${date}T23:59:59`
      : `${date}T00:00:00`;
  }

}