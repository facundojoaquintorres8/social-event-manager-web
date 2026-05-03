import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { EventsService } from '../../../core/services/events.service';
import { HttpErrorResponse } from '@angular/common/http';

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

  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: [''],
    location: ['', [Validators.required]],
    eventDate: ['', [Validators.required]]
  });

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

    this.eventsService.createEvent(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/events']);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 400 && err.error?.message) {
            this.error.set(err.error.message);
            return;
          }
          this.error.set('Unexpected error occurred');
        }
      });
  }
}