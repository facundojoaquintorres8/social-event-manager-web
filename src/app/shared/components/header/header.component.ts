import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
  computed,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import {
  LucideDynamicIcon,
  LucideLogOut,
  LucideMenu,
  LucideMoon,
  LucideSun,
  LucideKeyRound,
  LucideBell,
  LucideCrown,
} from '@lucide/angular';
import { Language, LanguageService } from '../../../core/services/language.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password-modal.component';
import { NotificationsService } from '../../../core/services/notifications.service';
import { Notification } from '../../../core/models/notification.model';

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
    LucideBell,
    LucideCrown,
    TranslatePipe,
    ChangePasswordModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  readonly themeService = inject(ThemeService);
  readonly languageService = inject(LanguageService);
  readonly notificationsService = inject(NotificationsService);
  private readonly authService = inject(AuthService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  readonly mobileMenuOpen = signal(false);
  readonly changePasswordOpen = signal(false);
  readonly setPasswordOpen = signal(false);
  readonly notificationsPanelOpen = signal(false);

  protected readonly darkModeIcon = computed(() =>
    this.themeService.darkMode() ? LucideSun : LucideMoon,
  );

  readonly hasPassword = computed(() => this.authService.currentUser()?.hasPassword ?? true);
  readonly isPremium = computed(() => this.authService.currentUser()?.premium ?? false);

  @HostListener('document:click')
  onDocumentClick(): void {
    this.notificationsPanelOpen.set(false);
  }

  constructor() {
    if (this.authService.isAuthenticated()) {
      this.loadUnreadNotifications();
      this.notificationsService.connectSSE();
    }
  }

  toggleLanguage(): void {
    const next: Language = this.languageService.currentLanguage() === 'en' ? 'es' : 'en';
    this.languageService.setLanguage(next);
  }

  loadUnreadNotifications(): void {
    this.notificationsService.getUnread().subscribe({
      next: (res) => {
        this.notificationsService.notifications.set(res.data);
        this.notificationsService.unreadCount.set(
          res.data.filter((n: Notification) => !n.read).length,
        );
      },
    });
  }

  onNotificationClick(notification: Notification): void {
    if (!notification.read) {
      this.notificationsService.markAsRead(notification.id).subscribe({
        next: () => {
          this.notificationsService.notifications.update((notifications) =>
            notifications.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
          );
          this.notificationsService.unreadCount.update((count) => Math.max(0, count - 1));
        },
      });
    }
    this.notificationsPanelOpen.set(false);
    this.router.navigate(['/events', notification.eventId]);
  }

  markAllAsRead(): void {
    this.notificationsService.markAllAsRead().subscribe({
      next: () => {
        this.notificationsService.notifications.update((notifications) =>
          notifications.map((n) => ({ ...n, read: true })),
        );
        this.notificationsService.unreadCount.set(0);
      },
    });
  }

  getNotificationMessage(notification: Notification): string {
    return this.translate.instant(
      `notifications.${this.toCamelCase(notification.type)}`,
      notification.params,
    );
  }

  logout(): void {
    this.authService.logout();
  }

  private toCamelCase(type: string): string {
    return type.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }
}
