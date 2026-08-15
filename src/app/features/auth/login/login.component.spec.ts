import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;
  let translateService: jest.Mocked<TranslateService>;

  const mockAuthResponse = {
    success: true,
    message: 'Login successful',
    data: {
      accessToken: 'token-123',
      refreshToken: 'refresh-123',
      email: 'facundo@test.com',
      firstName: 'Facundo',
      lastName: 'Torres',
      hasPassword: true,
      premium: false,
    },
  };

  beforeEach(() => {
    authService = {
      login: jest.fn(),
      storeUserAndTokens: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    router = {
      navigateByUrl: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    translateService = {
      instant: jest.fn().mockReturnValue('errors.oauthLoginFailed'),
    } as unknown as jest.Mocked<TranslateService>;

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: TranslateService, useValue: translateService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: jest.fn().mockReturnValue(null),
              },
            },
          },
        },
      ],
    });

    component = TestBed.createComponent(LoginComponent).componentInstance;
  });

  describe('form validation', () => {
    it('should initialize form with empty fields', () => {
      expect(component.form.value).toEqual({ email: '', password: '' });
    });

    it('should be invalid when empty', () => {
      expect(component.form.invalid).toBe(true);
    });

    it('should be valid with email and password', () => {
      component.form.setValue({ email: 'test@test.com', password: 'Password1' });
      expect(component.form.valid).toBe(true);
    });
  });

  describe('submit', () => {
    it('should not call login when form is invalid', () => {
      component.submit();
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should call login with form values', () => {
      component.form.setValue({ email: 'test@test.com', password: 'Password1' });
      authService.login.mockReturnValue(of(mockAuthResponse));

      component.submit();

      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'Password1',
      });
    });

    it('should store tokens and navigate on success', () => {
      component.form.setValue({ email: 'test@test.com', password: 'Password1' });
      authService.login.mockReturnValue(of(mockAuthResponse));

      component.submit();

      expect(authService.storeUserAndTokens).toHaveBeenCalledWith(mockAuthResponse.data);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
    });

    it('should set loading to false on error', () => {
      component.form.setValue({ email: 'test@test.com', password: 'wrongpass' });
      authService.login.mockReturnValue(throwError(() => new Error('Unauthorized')));

      component.submit();

      expect(component.loading()).toBe(false);
    });
  });

  describe('getOAuthUrl', () => {
    it('should return correct Google OAuth URL', () => {
      const url = component.getOAuthUrl('google');
      expect(url).toContain('/oauth2/authorization/google');
    });

    it('should return correct GitHub OAuth URL', () => {
      const url = component.getOAuthUrl('github');
      expect(url).toContain('/oauth2/authorization/github');
    });
  });

  describe('oauthError', () => {
    it('should set oauthError when error query param exists and translation not found', () => {
      TestBed.resetTestingModule();

      translateService.instant.mockReturnValue('errors.oauthLoginFailed');

      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, LoginComponent],
        providers: [
          { provide: AuthService, useValue: authService },
          { provide: Router, useValue: router },
          { provide: TranslateService, useValue: translateService },
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                queryParamMap: {
                  get: jest.fn().mockReturnValue('oauthLoginFailed'),
                },
              },
            },
          },
        ],
      });

      const comp = TestBed.createComponent(LoginComponent).componentInstance;
      expect(comp.oauthError()).toBe('oauthLoginFailed');
    });
  });
});
