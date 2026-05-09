import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponseDTO } from '../models/api-response.model';
import { AuthRequestDTO, AuthResponseDTO } from '../models/auth.model';
import { RegisterRequestDTO, RegisterResponseDTO } from '../models/register.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}auth`;

  readonly accessToken = signal<string | null>(this.getStored('accessToken'));
  readonly refreshToken = signal<string | null>(this.getStored('refreshToken'));

  // ---------- AUTH ----------
  register(payload: RegisterRequestDTO) {
    return this.http.post<ApiResponseDTO<RegisterResponseDTO>>(`${this.apiUrl}/register`, payload);
  }

  login(payload: AuthRequestDTO) {
    return this.http.post<ApiResponseDTO<AuthResponseDTO>>(`${this.apiUrl}/login`, payload);
  }

  refresh() {
    return this.http.post<ApiResponseDTO<AuthResponseDTO>>(`${this.apiUrl}/refresh`, {
      refreshToken: this.refreshToken(),
    });
  }

  // ---------- STORAGE ----------

  saveTokens(access: string, refresh: string): void {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);

    this.accessToken.set(access);
    this.refreshToken.set(refresh);
  }

  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    this.accessToken.set(null);
    this.refreshToken.set(null);
  }

  isAuthenticated(): boolean {
    return !!this.accessToken();
  }

  private getStored(key: string): string | null {
    const value = localStorage.getItem(key);
    return value && value !== 'null' ? value : null;
  }
}
