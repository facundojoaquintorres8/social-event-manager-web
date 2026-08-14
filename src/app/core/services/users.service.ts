import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { UserResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}users`;

  changePassword(payload: {
    currentPassword: string;
    newPassword: string;
  }): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.url}/change-password`, payload);
  }

  setPassword(payload: { newPassword: string }): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.url}/set-password`, payload);
  }

  me(): Observable<ApiResponse<UserResponse>> {
    return this.http.get<ApiResponse<UserResponse>>(`${this.url}/me`);
  }
}
