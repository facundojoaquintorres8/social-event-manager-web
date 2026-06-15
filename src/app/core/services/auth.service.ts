import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { AuthRequest, AuthResponse } from '../models/auth.model';
import { RegisterRequest, RegisterResponse } from '../models/register.model';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly apiUrl = `${environment.apiUrl}auth`;

  readonly accessToken = signal<string | null>(this.getStored('accessToken'));
  readonly refreshToken = signal<string | null>(this.getStored('refreshToken'));
  readonly currentUser = signal<User | null>(this.getStoredUser());

  // ---------- AUTH ----------
  register(payload: RegisterRequest) {
    return this.http.post<ApiResponse<RegisterResponse>>(`${this.apiUrl}/register`, payload);
  }

  login(payload: AuthRequest) {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, payload);
  }

  refresh() {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/refresh`, {
      refreshToken: this.refreshToken(),
    });
  }

  // ---------- STORAGE ----------

  storeUserAndTokens(response: RegisterResponse): void {
    const user = {
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
    };

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

    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.accessToken();
  }

  private getStored(key: string): string | null {
    const value = localStorage.getItem(key);
    return value && value !== 'null' ? value : null;
  }

  private getStoredUser(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? (JSON.parse(user) as User) : null;
  }
}
