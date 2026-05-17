import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { SelectedLocation } from '../../../core/models/location.model';

@Component({
  selector: 'app-location-autocomplete',
  standalone: true,
  templateUrl: './location-autocomplete.component.html',
})
export class LocationAutocompleteComponent implements AfterViewInit {
  readonly container = viewChild.required<ElementRef<HTMLDivElement>>('container');

  readonly initialValue = input('');

  readonly locationSelected = output<SelectedLocation>();

  private readonly placeAutocomplete = signal<google.maps.places.PlaceAutocompleteElement | null>(
    null,
  );

  constructor() {
    effect(() => {
      const autocomplete = this.placeAutocomplete();
      const initialValue = this.initialValue();

      if (autocomplete && initialValue) {
        autocomplete.value = initialValue;
      }
    });
  }

  async ngAfterViewInit(): Promise<void> {
    //@ts-ignore
    const autocomplete = new google.maps.places.PlaceAutocompleteElement();
    this.placeAutocomplete.set(autocomplete);

    (this.placeAutocomplete as any).componentRestrictions = {
      country: ['ar'],
    };

    autocomplete.className =
      'w-full rounded-lg border border-gray-200 bg-white text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100';

    autocomplete.addEventListener('gmp-select', async (event: any) => {
      const placePrediction = event.placePrediction;

      if (!placePrediction) {
        return;
      }

      const place = placePrediction.toPlace();

      await place.fetchFields({
        fields: ['displayName', 'formattedAddress', 'location', 'id'],
      });

      const selectedLocation: SelectedLocation = {
        location: place.displayName ?? place.formattedAddress ?? '',
        locationAddress: place.formattedAddress ?? '',
        placeId: place.id ?? '',
        latitude: place.location?.lat() ?? 0,
        longitude: place.location?.lng() ?? 0,
      };

      this.locationSelected.emit(selectedLocation);
    });

    this.container().nativeElement.appendChild(autocomplete);
  }
}
