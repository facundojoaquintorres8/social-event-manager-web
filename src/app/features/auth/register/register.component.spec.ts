import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;
  let toastService: jest.Mocked<ToastService>;
  let translateService: jest.Mocked<TranslateService>;

  const mockAuthResponse = {
    success: true,
    message: 'User registered successfully',
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
      register: jest.fn(),
      storeUserAndTokens: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    router = {
      navigateByUrl: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    toastService = {
      show: jest.fn(),
    } as unknown as jest.Mocked<ToastService>;

    translateService = {
      instant: jest.fn().mockReturnValue(''),
    } as unknown as jest.Mocked<TranslateService>;

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: ToastService, useValue: toastService },
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

    component = TestBed.createComponent(RegisterComponent).componentInstance;
  });

  describe('form validation', () => {
    it('should initialize form with empty fields', () => {
      expect(component.form.value).toEqual({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    });

    it('should be invalid when empty', () => {
      expect(component.form.invalid).toBe(true);
    });

    it('should be valid with all required fields', () => {
      component.form.setValue({
        firstName: 'Facundo',
        lastName: 'Torres',
        email: 'facundo@test.com',
        password: 'Password1',
        confirmPassword: 'Password1',
      });
      expect(component.form.valid).toBe(true);
    });

    it('should be invalid when passwords do not match', () => {
      component.form.setValue({
        firstName: 'Facundo',
        lastName: 'Torres',
        email: 'facundo@test.com',
        password: 'Password1',
        confirmPassword: 'Password2',
      });
      expect(component.form.invalid).toBe(true);
    });

    it('should be invalid when password does not meet requirements', () => {
      component.form.setValue({
        firstName: 'Facundo',
        lastName: 'Torres',
        email: 'facundo@test.com',
        password: 'password',
        confirmPassword: 'password',
      });
      expect(component.form.invalid).toBe(true);
    });
  });

  describe('submit', () => {
    it('should not call register when form is invalid', () => {
      component.submit();
      expect(authService.register).not.toHaveBeenCalled();
    });

    it('should call register with form values on valid submit', () => {
      component.form.setValue({
        firstName: 'Facundo',
        lastName: 'Torres',
        email: 'facundo@test.com',
        password: 'Password1',
        confirmPassword: 'Password1',
      });
      authService.register.mockReturnValue(of(mockAuthResponse));

      component.submit();

      expect(authService.register).toHaveBeenCalled();
    });

    it('should store tokens and navigate on success', () => {
      component.form.setValue({
        firstName: 'Facundo',
        lastName: 'Torres',
        email: 'facundo@test.com',
        password: 'Password1',
        confirmPassword: 'Password1',
      });
      authService.register.mockReturnValue(of(mockAuthResponse));

      component.submit();

      expect(authService.storeUserAndTokens).toHaveBeenCalledWith(mockAuthResponse.data);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
    });

    it('should show toast on success', () => {
      component.form.setValue({
        firstName: 'Facundo',
        lastName: 'Torres',
        email: 'facundo@test.com',
        password: 'Password1',
        confirmPassword: 'Password1',
      });
      authService.register.mockReturnValue(of(mockAuthResponse));

      component.submit();

      expect(toastService.show).toHaveBeenCalled();
    });

    it('should set loading to false on error', () => {
      component.form.setValue({
        firstName: 'Facundo',
        lastName: 'Torres',
        email: 'facundo@test.com',
        password: 'Password1',
        confirmPassword: 'Password1',
      });
      authService.register.mockReturnValue(throwError(() => new Error('Error')));

      component.submit();

      expect(component.loading()).toBe(false);
    });
  });
});
