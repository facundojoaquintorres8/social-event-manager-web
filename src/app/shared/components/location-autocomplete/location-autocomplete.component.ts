import { AfterViewInit, Component, ElementRef, input, output, viewChild } from '@angular/core';

@Component({
  selector: 'app-location-autocomplete',
  standalone: true,
  templateUrl: './location-autocomplete.component.html',
})
export class LocationAutocompleteComponent implements AfterViewInit {
  readonly locationInput = viewChild.required<ElementRef<HTMLInputElement>>('locationInput');

  readonly initialValue = input('');

  readonly locationSelected = output<string>();

  ngAfterViewInit(): void {
    const input = this.locationInput().nativeElement;

    input.value = this.initialValue();

    const autocomplete = new google.maps.places.Autocomplete(input, {
      componentRestrictions: {
        country: ['ar'],
      },
      fields: ['formatted_address'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (place.formatted_address) {
        this.locationSelected.emit(place.formatted_address);
      }
    });
  }
}
