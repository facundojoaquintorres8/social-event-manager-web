import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { LucideTriangleAlert } from '@lucide/angular';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [LucideTriangleAlert],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './error-state.component.html',
})
export class ErrorStateComponent {
  readonly title = input('Something went wrong');
  readonly description = input('Please try again later.');

  readonly retry = output<void>();
}
