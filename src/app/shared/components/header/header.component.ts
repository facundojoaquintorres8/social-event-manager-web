import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LogOut, Moon, Sun, Menu } from 'lucide-angular';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  readonly mobileMenuOpen = signal(false);

  readonly Moon = Moon;
  readonly Sun = Sun;
  readonly LogOut = LogOut;
  readonly Menu = Menu;

  logout(): void {
    this.authService.logout();
  }
}
