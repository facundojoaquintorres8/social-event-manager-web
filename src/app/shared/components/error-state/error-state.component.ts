import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { LucideTriangleAlert } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [LucideTriangleAlert, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './error-state.component.html',
})
export class ErrorStateComponent {
  readonly title = input<string | null>(null);
  readonly description = input<string | null>(null);
  readonly retry = output<void>();
}
