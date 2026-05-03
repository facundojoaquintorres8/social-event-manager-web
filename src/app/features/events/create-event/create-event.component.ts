import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { EventsService } from '../../../core/services/events.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './create-event.component.html'
})
export class CreateEventComponent {

  private readonly fb = inject(FormBuilder);
  private readonly eventsService = inject(EventsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastService = inject(ToastService);

  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly isEditMode = signal<boolean>(false);
  readonly eventId = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: [''],
    location: ['', [Validators.required]],
    eventDate: ['', [Validators.required]]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode.set(true);
      this.eventId.set(id);
      this.loadEvent(id);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const value = this.form.getRawValue();

    const payload = {
      ...value,
      eventDate: value.eventDate.length === 16
        ? `${value.eventDate}:00`
        : value.eventDate
    };

    const request = this.isEditMode()
      ? this.eventsService.updateEvent(this.eventId()!, payload)
      : this.eventsService.createEvent(payload);

    request
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.toastService.show(
            this.isEditMode() ? 'Event updated' : 'Event created'
          );
          this.router.navigate(['/events']);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 400 && err.error?.message) {
            this.toastService.show(err.error.message, 'error');
            this.error.set(err.error.message);
            return;
          }
          this.error.set('Unexpected error occurred');
        }
      });
  }

  private loadEvent(id: string): void {
    this.loading.set(true);

    this.eventsService.getEventById(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res: any) => {
          const event = res.data;

          this.form.patchValue({
            title: event.title,
            description: event.description,
            location: event.location,
            eventDate: this.formatForInput(event.eventDate)
          });
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 400 && err.error?.message) {
            this.toastService.show(err.error.message, 'error');
            this.error.set(err.error.message);
            return;
          }
          this.error.set('Unexpected error occurred');
        }
      });
  }

  private formatForInput(date: string): string {
    return date?.slice(0, 16);
  }

}