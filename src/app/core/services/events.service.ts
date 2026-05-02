import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponseDTO } from '../models/api-response.model';
import { EventDTO } from '../models/event.model';
import { PageDTO } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}events`;

  getMyEvents(page = 0, size = 10) {
    return this.http.get<ApiResponseDTO<PageDTO<EventDTO>>>(
      `${this.apiUrl}/me?page=${page}&size=${size}`
    );
  }
}