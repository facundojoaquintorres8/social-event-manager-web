import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventsService } from '../../../core/services/events.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss'
})
export class CreateEventComponent {

  private readonly fb = inject(FormBuilder);
  private readonly eventsService = inject(EventsService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    eventDate: ['', Validators.required],
    location: ['', Validators.required]
  });

  submit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);

    this.eventsService.createEvent(this.form.getRawValue()).subscribe({
      next: () => {
        this.router.navigate(['/events']);
      },
      error: () => {
        this.error.set('Error creating event');
        this.loading.set(false);
      }
    });
  }
}