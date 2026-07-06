import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastService } from './core/services/toast.service';
import { CommonModule } from '@angular/common';
import { LucideX } from '@lucide/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LucideX],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
})
export class AppComponent {
  readonly toastService = inject(ToastService);
}
