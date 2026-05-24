import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Invitation, InvitationStatus } from '../models/event.model';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root',
})
export class InvitationsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}invitations`;

  getMyInvitations(page = 0) {
    return this.http.get<ApiResponse<Page<Invitation>>>(`${this.apiUrl}/me`, {
      params: {
        page,
        size: 10,
      },
    });
  }

  updateInvitationStatus(eventId: string, status: InvitationStatus) {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}`, {
      body: { eventId, status },
    });
  }

  removeInvitation(eventId: string, email: string) {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}`, {
      body: { eventId, email },
    });
  }
}
