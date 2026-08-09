import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Notification } from '../models/notification.model';
import { Page } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}notifications`;

  readonly unreadCount = signal(0);
  readonly notifications = signal<Notification[]>([]);

  getUnread(): Observable<ApiResponse<Notification[]>> {
    return this.http.get<ApiResponse<Notification[]>>(`${this.url}/unread`);
  }

  getAll(page = 0, size = 20): Observable<ApiResponse<Page<Notification>>> {
    return this.http.get<ApiResponse<Page<Notification>>>(`${this.url}?page=${page}&size=${size}`);
  }

  markAsRead(id: string): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.url}/${id}/read`, {});
  }

  markAllAsRead(): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.url}/read-all`, {});
  }

  connectSSE(): void {
    const token = localStorage.getItem('accessToken');
    const eventSource = new EventSource(`${this.url}/stream?token=${token}`);

    eventSource.addEventListener('notification', (event) => {
      const data = JSON.parse(event.data);
      this.unreadCount.update((count) => count + 1);
      this.notifications.update((notifications) => [data, ...notifications]);
    });

    eventSource.addEventListener('connected', () => {
      console.log('SSE connected');
    });

    eventSource.onerror = () => {
      eventSource.close();
      setTimeout(() => this.connectSSE(), 5000);
    };
  }
}
