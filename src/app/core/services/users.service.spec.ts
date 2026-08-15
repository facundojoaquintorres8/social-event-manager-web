import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let httpClient: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpClient = {
      put: jest.fn(),
      get: jest.fn(),
    } as unknown as jest.Mocked<HttpClient>;

    TestBed.configureTestingModule({
      providers: [UsersService, { provide: HttpClient, useValue: httpClient }],
    });

    service = TestBed.inject(UsersService);
  });

  describe('changePassword', () => {
    it('should call PUT /change-password with payload', () => {
      const payload = { currentPassword: 'OldPass1', newPassword: 'NewPass1' };
      httpClient.put.mockReturnValue(of({ success: true, data: null }));

      service.changePassword(payload).subscribe();

      expect(httpClient.put).toHaveBeenCalledWith(
        expect.stringContaining('/change-password'),
        payload,
      );
    });
  });

  describe('setPassword', () => {
    it('should call PUT /set-password with payload', () => {
      const payload = { newPassword: 'NewPass1' };
      httpClient.put.mockReturnValue(of({ success: true, data: null }));

      service.setPassword(payload).subscribe();

      expect(httpClient.put).toHaveBeenCalledWith(
        expect.stringContaining('/set-password'),
        payload,
      );
    });
  });

  describe('me', () => {
    it('should call GET /me', () => {
      const mockUser = {
        success: true,
        data: {
          id: '1',
          firstName: 'Facundo',
          lastName: 'Torres',
          email: 'facundo@test.com',
          hasPassword: true,
          premium: false,
        },
      };
      httpClient.get.mockReturnValue(of(mockUser));

      service.me().subscribe((response) => {
        expect(response.data.email).toBe('facundo@test.com');
      });

      expect(httpClient.get).toHaveBeenCalledWith(expect.stringContaining('/me'));
    });
  });
});
