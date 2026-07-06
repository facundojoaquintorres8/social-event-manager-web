import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
  title = input.required<string>();
  description = input.required<string>();

  buttonText = input<string>();
}
