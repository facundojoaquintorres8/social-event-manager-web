import { Component, input, output } from '@angular/core';
import { LucideAngularModule, TriangleAlert } from 'lucide-angular';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './error-state.component.html',
})
export class ErrorStateComponent {
  readonly title = input('Something went wrong');
  readonly description = input('Please try again later.');

  readonly retry = output<void>();

  readonly TriangleAlert = TriangleAlert;
}
