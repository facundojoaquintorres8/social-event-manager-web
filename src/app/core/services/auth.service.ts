import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponseDTO } from '../models/api-response.model';
import { AuthRequestDTO, AuthResponseDTO } from '../models/auth.model';
import { RegisterRequestDTO, RegisterResponseDTO } from '../models/register.model';
import { UserDTO } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}auth`;

  readonly accessToken = signal<string | null>(this.getStored('accessToken'));
  readonly refreshToken = signal<string | null>(this.getStored('refreshToken'));
  readonly currentUser = signal<UserDTO | null>(this.getStoredUser());

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

  storeUserAndTokens(response: RegisterResponseDTO): void {
    const user = {
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
    } as UserDTO;

    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('currentUser', JSON.stringify(user));

    this.accessToken.set(response.accessToken);
    this.refreshToken.set(response.refreshToken);
    this.currentUser.set(user);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');

    this.accessToken.set(null);
    this.refreshToken.set(null);
    this.currentUser.set(null);
  }

  isAuthenticated(): boolean {
    return !!this.accessToken();
  }

  private getStored(key: string): string | null {
    const value = localStorage.getItem(key);
    return value && value !== 'null' ? value : null;
  }

  private getStoredUser(): UserDTO | null {
    const user = localStorage.getItem('currentUser');
    return user ? (JSON.parse(user) as UserDTO) : null;
  }
}
