import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class ExternalInvitationsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}external-invitations`;

  getEvent(token: string) {
    // TODO: ajustar todo para la invitación externa
    return this.http.get<ApiResponse<Event>>(`${this.apiUrl}/${token}`);
  }

  removeInvitation(eventId: string, email: string) {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}`, {
      body: { eventId, email },
    });
  }
}
