import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import {
  BalanceRequest,
  BalanceResponse,
  CalendarEvent,
  CreateEventRequest,
  Dashboard,
  Event,
  EventFull,
} from '../models/event.model';
import { Page } from '../models/page.model';
import { PAGE_SIZE } from '../../shared/utils/constants';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}events`;

  getMyEvents(params: {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: 'asc' | 'desc';
    title?: string;
    fromDate?: string;
    toDate?: string;
    status?: string;
  }) {
    const {
      page = 0,
      size = PAGE_SIZE,
      sortBy = 'eventDate',
      direction = 'desc',
      title,
      fromDate,
      toDate,
      status,
    } = params;

    let url = `${this.apiUrl}/me?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;

    if (title) url += `&title=${encodeURIComponent(title)}`;
    if (fromDate) url += `&fromDate=${fromDate}`;
    if (toDate) url += `&toDate=${toDate}`;
    if (status) url += `&status=${status}`;

    return this.http.get<ApiResponse<Page<Event>>>(url);
  }

  getCalendarEvents(from?: string, to?: string) {
    let params = new HttpParams();

    if (from) {
      params = params.set('from', from);
    }

    if (to) {
      params = params.set('to', to);
    }

    return this.http.get<ApiResponse<CalendarEvent[]>>(`${this.apiUrl}/calendar`, { params });
  }

  createEvent(data: CreateEventRequest) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  cancelEvent(eventId: string) {
    return this.http.put(`${this.apiUrl}/${eventId}/cancel`, {});
  }

  updateEvent(eventId: string, payload: CreateEventRequest) {
    return this.http.put(`${this.apiUrl}/${eventId}`, payload);
  }

  getEventById(eventId: string) {
    return this.http.get<ApiResponse<Event>>(`${this.apiUrl}/${eventId}`);
  }

  getFullEventById(eventId: string) {
    return this.http.get<ApiResponse<EventFull>>(`${this.apiUrl}/${eventId}/full`);
  }

  getDashboard() {
    return this.http.get<ApiResponse<Dashboard>>(`${this.apiUrl}/dashboard`);
  }

  inviteUser(eventId: string, email: string) {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${eventId}/invite`, {
      email,
    });
  }

  getAttendingEvents(page = 0, size = PAGE_SIZE) {
    return this.http.get<ApiResponse<Page<Event>>>(`${this.apiUrl}/attending`, {
      params: {
        page,
        size,
      },
    });
  }

  calculateBalance(eventId: string, payload: BalanceRequest) {
    return this.http.post<ApiResponse<BalanceResponse>>(
      `${this.apiUrl}/${eventId}/balance`,
      payload,
    );
  }
}
