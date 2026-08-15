import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AuthResponse } from '../models/auth.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpClient: jest.Mocked<HttpClient>;
  let router: jest.Mocked<Router>;

  const mockAuthResponse: AuthResponse = {
    accessToken: 'access-token-123',
    refreshToken: 'refresh-token-123',
    email: 'facundo@test.com',
    firstName: 'Facundo',
    lastName: 'Torres',
    hasPassword: true,
    premium: false,
  };

  beforeEach(() => {
    localStorage.clear();

    httpClient = {
      post: jest.fn(),
      get: jest.fn(),
    } as unknown as jest.Mocked<HttpClient>;

    router = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpClient, useValue: httpClient },
        { provide: Router, useValue: router },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('storeUserAndTokens', () => {
    it('should store tokens in localStorage', () => {
      service.storeUserAndTokens(mockAuthResponse);
      expect(localStorage.getItem('accessToken')).toBe('access-token-123');
      expect(localStorage.getItem('refreshToken')).toBe('refresh-token-123');
    });

    it('should store user in localStorage', () => {
      service.storeUserAndTokens(mockAuthResponse);
      const stored = JSON.parse(localStorage.getItem('currentUser')!);
      expect(stored.email).toBe('facundo@test.com');
      expect(stored.firstName).toBe('Facundo');
      expect(stored.hasPassword).toBe(true);
      expect(stored.premium).toBe(false);
    });

    it('should update signals', () => {
      service.storeUserAndTokens(mockAuthResponse);
      expect(service.accessToken()).toBe('access-token-123');
      expect(service.refreshToken()).toBe('refresh-token-123');
      expect(service.currentUser()?.email).toBe('facundo@test.com');
    });
  });

  describe('logout', () => {
    it('should clear localStorage', () => {
      service.storeUserAndTokens(mockAuthResponse);
      service.logout();
      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('currentUser')).toBeNull();
    });

    it('should clear signals', () => {
      service.storeUserAndTokens(mockAuthResponse);
      service.logout();
      expect(service.accessToken()).toBeNull();
      expect(service.refreshToken()).toBeNull();
      expect(service.currentUser()).toBeNull();
    });

    it('should navigate to login', () => {
      service.logout();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when access token exists', () => {
      service.storeUserAndTokens(mockAuthResponse);
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when no access token', () => {
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('updateHasPassword', () => {
    it('should update hasPassword in current user', () => {
      service.storeUserAndTokens(mockAuthResponse);
      service.updateHasPassword(false);
      expect(service.currentUser()?.hasPassword).toBe(false);
    });

    it('should not update when no current user', () => {
      service.updateHasPassword(true);
      expect(service.currentUser()).toBeNull();
    });
  });
});
