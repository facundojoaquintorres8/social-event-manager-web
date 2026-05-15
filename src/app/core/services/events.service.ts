import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import {
  CreateEventRequest,
  Dashboard,
  Event,
  Invitation,
  InvitationStatus,
} from '../models/event.model';
import { Page } from '../models/page.model';

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
      size = 10,
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

  getDashboard() {
    return this.http.get<ApiResponse<Dashboard>>(`${this.apiUrl}/dashboard`);
  }

  getMyInvitations(page = 0) {
    return this.http.get<ApiResponse<Page<Invitation>>>(`${this.apiUrl}/invitations`, {
      params: {
        page,
        size: 10,
      },
    });
  }

  inviteUser(eventId: string, email: string) {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${eventId}/invite`, {
      email,
    });
  }

  updateInvitationStatus(invitationId: string, status: InvitationStatus) {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/invitations/${invitationId}`, {
      status,
    });
  }
}
