import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { NotificationsService } from './notifications.service';
import { Notification } from '../models/notification.model';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let httpClient: jest.Mocked<HttpClient>;

  const mockNotification: Notification = {
    id: '1',
    eventId: 'event-1',
    type: 'INVITATION_RECEIVED',
    params: { eventTitle: 'Test Event' },
    read: false,
    readAt: null,
    createdAt: '2026-08-15T00:00:00',
  };

  beforeEach(() => {
    httpClient = {
      get: jest.fn(),
      patch: jest.fn(),
    } as unknown as jest.Mocked<HttpClient>;

    TestBed.configureTestingModule({
      providers: [NotificationsService, { provide: HttpClient, useValue: httpClient }],
    });

    service = TestBed.inject(NotificationsService);
  });

  describe('signals', () => {
    it('should initialize unreadCount to 0', () => {
      expect(service.unreadCount()).toBe(0);
    });

    it('should initialize notifications to empty array', () => {
      expect(service.notifications()).toEqual([]);
    });
  });

  describe('unreadCount signal', () => {
    it('should update unreadCount', () => {
      service.unreadCount.set(5);
      expect(service.unreadCount()).toBe(5);
    });

    it('should increment unreadCount', () => {
      service.unreadCount.set(3);
      service.unreadCount.update((count) => count + 1);
      expect(service.unreadCount()).toBe(4);
    });
  });

  describe('notifications signal', () => {
    it('should add notification', () => {
      service.notifications.set([mockNotification]);
      expect(service.notifications()).toHaveLength(1);
      expect(service.notifications()[0].id).toBe('1');
    });

    it('should not add duplicate notification', () => {
      service.notifications.set([mockNotification]);
      service.notifications.update((notifications) => {
        if (notifications.some((n) => n.id === mockNotification.id)) return notifications;
        return [mockNotification, ...notifications];
      });
      expect(service.notifications()).toHaveLength(1);
    });

    it('should prepend new notification', () => {
      const secondNotification = { ...mockNotification, id: '2' };
      service.notifications.set([mockNotification]);
      service.notifications.update((notifications) => [secondNotification, ...notifications]);
      expect(service.notifications()[0].id).toBe('2');
      expect(service.notifications()[1].id).toBe('1');
    });
  });

  describe('connectSSE', () => {
    it('should create EventSource with token', () => {
      localStorage.setItem('accessToken', 'test-token');
      const mockEventSource = {
        addEventListener: jest.fn(),
        close: jest.fn(),
        onerror: null,
      };
      window.EventSource = jest.fn(() => mockEventSource) as unknown as typeof EventSource;

      service.connectSSE();

      expect(window.EventSource).toHaveBeenCalledWith(expect.stringContaining('token=test-token'));

      localStorage.clear();
    });
  });
});
