import { TestBed } from '@angular/core/testing';
import { StatusLabelPipe } from './status-label.pipe';
import { TranslateService } from '@ngx-translate/core';

describe('StatusLabelPipe', () => {
  let pipe: StatusLabelPipe;
  let translateService: jest.Mocked<TranslateService>;

  beforeEach(() => {
    translateService = {
      instant: jest.fn(),
      currentLang: 'en',
    } as unknown as jest.Mocked<TranslateService>;

    TestBed.configureTestingModule({
      providers: [StatusLabelPipe, { provide: TranslateService, useValue: translateService }],
    });

    pipe = TestBed.inject(StatusLabelPipe);
  });

  it('should translate ACTIVE status', () => {
    translateService.instant.mockReturnValue('Active');
    expect(pipe.transform('ACTIVE')).toBe('Active');
    expect(translateService.instant).toHaveBeenCalledWith('status.ACTIVE');
  });

  it('should translate CANCELLED status', () => {
    translateService.instant.mockReturnValue('Cancelled');
    expect(pipe.transform('CANCELLED')).toBe('Cancelled');
  });

  it('should translate PENDING status', () => {
    translateService.instant.mockReturnValue('Pending');
    expect(pipe.transform('PENDING')).toBe('Pending');
  });

  it('should translate ACCEPTED status', () => {
    translateService.instant.mockReturnValue('Accepted');
    expect(pipe.transform('ACCEPTED')).toBe('Accepted');
  });

  it('should translate REJECTED status', () => {
    translateService.instant.mockReturnValue('Rejected');
    expect(pipe.transform('REJECTED')).toBe('Rejected');
  });

  it('should translate CLAIMED status', () => {
    translateService.instant.mockReturnValue('Accepted');
    expect(pipe.transform('CLAIMED')).toBe('Accepted');
  });

  it('should pass unknown status to translate', () => {
    translateService.instant.mockReturnValue('UNKNOWN');
    expect(pipe.transform('UNKNOWN')).toBe('UNKNOWN');
  });
});
