import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { CreateContributionRequest } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class ContributionsService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}events`;

  createContribution(eventId: string, payload: CreateContributionRequest) {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${eventId}/contributions`, payload);
  }

  updateContribution(eventId: string, contributionId: string, payload: CreateContributionRequest) {
    return this.http.put<ApiResponse<void>>(
      `${this.apiUrl}/${eventId}/contributions/${contributionId}`,
      payload,
    );
  }

  updateContributionStatus(eventId: string, contributionId: string, completed: boolean) {
    return this.http.patch(`${this.apiUrl}/${eventId}/contributions/${contributionId}/status`, {
      completed,
    });
  }

  deleteContribution(eventId: string, contributionId: string) {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/${eventId}/contributions/${contributionId}`,
    );
  }
}
