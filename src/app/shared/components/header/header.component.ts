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
  LucideKeyRound,
} from '@lucide/angular';
import { Language, LanguageService } from '../../../core/services/language.service';
import { TranslatePipe } from '@ngx-translate/core';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password-modal.component';

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
    LucideKeyRound,
    TranslatePipe,
    ChangePasswordModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  readonly themeService = inject(ThemeService);
  readonly languageService = inject(LanguageService);
  private readonly authService = inject(AuthService);

  readonly mobileMenuOpen = signal(false);
  readonly changePasswordOpen = signal(false);

  protected readonly darkModeIcon = computed(() =>
    this.themeService.darkMode() ? LucideSun : LucideMoon,
  );

  toggleLanguage(): void {
    const next: Language = this.languageService.currentLanguage() === 'en' ? 'es' : 'en';
    this.languageService.setLanguage(next);
  }

  logout(): void {
    this.authService.logout();
  }
}
