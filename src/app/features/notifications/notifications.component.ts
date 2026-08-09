import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../core/services/notifications.service';
import { Notification } from '../../core/models/notification.model';
import { finalize } from 'rxjs';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, ErrorStateComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent implements OnInit {
  private readonly notificationsService = inject(NotificationsService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  readonly loading = signal(true);
  readonly error = signal(false);
  readonly notifications = signal<Notification[]>([]);
  readonly currentPage = signal(0);
  readonly totalPages = signal(0);
  readonly pageSize = 20;

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading.set(true);
    this.error.set(false);

    this.notificationsService
      .getAll(this.currentPage(), this.pageSize)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.notifications.set(res.data.content);
          this.totalPages.set(res.data.totalPages);
        },
        error: () => this.error.set(true),
      });
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadNotifications();
  }

  onNotificationClick(notification: Notification): void {
    if (!notification.read) {
      this.notificationsService.markAsRead(notification.id).subscribe({
        next: () => {
          this.notifications.update((notifications) =>
            notifications.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
          );
          this.notificationsService.unreadCount.update((count) => Math.max(0, count - 1));
        },
      });
    }
    this.router.navigate(['/events', notification.eventId]);
  }

  markAllAsRead(): void {
    this.notificationsService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.update((notifications) =>
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

  private toCamelCase(type: string): string {
    return type.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }
}
