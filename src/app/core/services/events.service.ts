import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponseDTO } from '../models/api-response.model';
import { CreateEventRequestDTO, EventDTO } from '../models/event.model';
import { PageDTO } from '../models/page.model';

@Injectable({
  providedIn: 'root'
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
      status
    } = params;

    let url = `${this.apiUrl}/me?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;

    if (title) url += `&title=${encodeURIComponent(title)}`;
    if (fromDate) url += `&fromDate=${fromDate}`;
    if (toDate) url += `&toDate=${toDate}`;
    if (status) url += `&status=${status}`;

    return this.http.get<ApiResponseDTO<PageDTO<EventDTO>>>(url);
  }

  createEvent(data: CreateEventRequestDTO) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  cancelEvent(eventId: string) {
    return this.http.put(`${this.apiUrl}/${eventId}/cancel`, {});
  }

  updateEvent(eventId: string, payload: CreateEventRequestDTO) {
    return this.http.put(`${this.apiUrl}/${eventId}`, payload);
  }

  getEventById(eventId: string) {
    return this.http.get(`${this.apiUrl}/${eventId}`);
  }

}