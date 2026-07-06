import { Component, inject, signal, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import {
  LucideDynamicIcon,
  LucideLogOut,
  LucideMenu,
  LucideMoon,
  LucideSun,
} from '@lucide/angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    LucideDynamicIcon,
    LucideLogOut,
    LucideMenu,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  readonly mobileMenuOpen = signal(false);

  protected readonly darkModeIcon = computed(() =>
    this.themeService.darkMode() ? LucideSun : LucideMoon,
  );

  logout(): void {
    this.authService.logout();
  }
}
