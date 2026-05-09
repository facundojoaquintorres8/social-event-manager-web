import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastService } from './core/services/toast.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from './core/services/theme.service';
import { LucideAngularModule, Moon, Sun } from 'lucide-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LucideAngularModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  readonly toastService = inject(ToastService);
  readonly themeService = inject(ThemeService);

  readonly Moon = Moon;
  readonly Sun = Sun;
}
