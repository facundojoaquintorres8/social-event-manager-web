import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponseDTO } from '../models/api-response.model';
import { AuthResponseDTO } from '../models/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}auth`;

  readonly token = signal<string | null>(localStorage.getItem('token'));

  login(data: { email: string; password: string }) {
    return this.http.post<ApiResponseDTO<AuthResponseDTO>>(
      `${this.apiUrl}/login`,
      data
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
    this.token.set(token);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.token.set(null);
  }

  isAuthenticated(): boolean {
    return !!this.token();
  }
}