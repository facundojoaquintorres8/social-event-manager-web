import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { EventsService } from '../../../core/services/events.service';
import { ToastService } from '../../../core/services/toast.service';
import { Location } from '@angular/common';
import { LocationAutocompleteComponent } from '../../../shared/components/location-autocomplete/location-autocomplete.component';
import { SelectedLocation } from '../../../core/models/location.model';
import { CalendarDays, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [ReactiveFormsModule, LocationAutocompleteComponent, LucideAngularModule],
  templateUrl: './create-event.component.html',
})
export class CreateEventComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly eventsService = inject(EventsService);
  private readonly route = inject(ActivatedRoute);
  private readonly toastService = inject(ToastService);
  private readonly location = inject(Location);

  readonly loading = signal<boolean>(false);
  readonly isEditMode = signal<boolean>(false);
  readonly eventId = signal<string | null>(null);

  readonly CalendarDays = CalendarDays;

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: [''],
    location: ['', [Validators.required]],
    locationAddress: ['', Validators.required],
    placeId: ['', Validators.required],
    latitude: [0, Validators.required],
    longitude: [0, Validators.required],
    eventDate: ['', [Validators.required]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode.set(true);
      this.eventId.set(id);
      this.loadEvent(id);
    }
  }

  onLocationSelected(location: SelectedLocation) {
    this.form.patchValue({
      location: location.location,
      locationAddress: location.locationAddress,
      placeId: location.placeId,
      latitude: location.latitude,
      longitude: location.longitude,
    });
  }

  goBack(): void {
    this.location.back();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const value = this.form.getRawValue();

    const payload = {
      ...value,
      eventDate: value.eventDate.length === 16 ? `${value.eventDate}:00` : value.eventDate,
    };

    const request = this.isEditMode()
      ? this.eventsService.updateEvent(this.eventId()!, payload)
      : this.eventsService.createEvent(payload);

    request.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => {
        this.toastService.show(this.isEditMode() ? 'Event updated' : 'Event created');
        this.goBack();
      },
    });
  }

  private loadEvent(id: string): void {
    this.loading.set(true);

    this.eventsService
      .getEventById(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res: any) => {
          const event = res.data;

          this.form.patchValue({
            title: event.title,
            description: event.description,
            location: event.location,
            locationAddress: event.locationAddress,
            placeId: event.placeId,
            latitude: event.latitude,
            longitude: event.longitude,
            eventDate: this.formatForInput(event.eventDate),
          });
        },
      });
  }

  private formatForInput(date: string): string {
    return date?.slice(0, 16);
  }
}
