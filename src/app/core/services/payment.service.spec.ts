import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { PaymentService } from './payment.service';

describe('PaymentService', () => {
  let service: PaymentService;
  let httpClient: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpClient = {
      post: jest.fn(),
    } as unknown as jest.Mocked<HttpClient>;

    TestBed.configureTestingModule({
      providers: [PaymentService, { provide: HttpClient, useValue: httpClient }],
    });

    service = TestBed.inject(PaymentService);
  });

  describe('createPreference', () => {
    it('should call POST /create-preference', () => {
      const mockResponse = {
        success: true,
        data: {
          preferenceId: 'pref-123',
          initPoint: 'https://mp.com/checkout',
          sandboxInitPoint: 'https://sandbox.mp.com/checkout',
          publicKey: 'APP_USR-xxx',
        },
      };

      httpClient.post.mockReturnValue(of(mockResponse));

      service.createPreference().subscribe((response) => {
        expect(response.data.preferenceId).toBe('pref-123');
      });

      expect(httpClient.post).toHaveBeenCalledWith(
        expect.stringContaining('/create-preference'),
        {},
      );
    });
  });
});
