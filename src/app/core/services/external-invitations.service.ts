import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { ExternalInvitationPreview } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class ExternalInvitationsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}external-invitations`;

  getExternalInvitationPreview(token: string) {
    return this.http.get<ApiResponse<ExternalInvitationPreview>>(`${this.apiUrl}/${token}`);
  }

  removeInvitation(eventId: string, email: string) {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}`, {
      body: { eventId, email },
    });
  }
}
