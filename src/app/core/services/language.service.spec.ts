import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language.service';
import { TranslateService } from '@ngx-translate/core';

describe('LanguageService', () => {
  let service: LanguageService;
  let translateService: jest.Mocked<TranslateService>;

  beforeEach(() => {
    translateService = {
      use: jest.fn(),
      currentLang: jest.fn(),
    } as unknown as jest.Mocked<TranslateService>;

    TestBed.configureTestingModule({
      providers: [LanguageService, { provide: TranslateService, useValue: translateService }],
    });

    service = TestBed.inject(LanguageService);

    localStorage.clear();
  });

  describe('init', () => {
    it('should use saved language from localStorage', () => {
      localStorage.setItem('language', 'es');
      service.init();
      expect(translateService.use).toHaveBeenCalledWith('es');
    });

    it('should use browser language when no saved language', () => {
      Object.defineProperty(navigator, 'language', {
        value: 'es-AR',
        configurable: true,
      });
      service.init();
      expect(translateService.use).toHaveBeenCalledWith('es');
    });

    it('should fallback to english when browser language not supported', () => {
      Object.defineProperty(navigator, 'language', {
        value: 'fr-FR',
        configurable: true,
      });
      service.init();
      expect(translateService.use).toHaveBeenCalledWith('en');
    });

    it('should prefer saved language over browser language', () => {
      localStorage.setItem('language', 'en');
      Object.defineProperty(navigator, 'language', {
        value: 'es-AR',
        configurable: true,
      });
      service.init();
      expect(translateService.use).toHaveBeenCalledWith('en');
    });
  });

  describe('setLanguage', () => {
    it('should call translate.use with the language', () => {
      service.setLanguage('es');
      expect(translateService.use).toHaveBeenCalledWith('es');
    });

    it('should save language to localStorage', () => {
      service.setLanguage('es');
      expect(localStorage.getItem('language')).toBe('es');
    });

    it('should save english to localStorage', () => {
      service.setLanguage('en');
      expect(localStorage.getItem('language')).toBe('en');
    });
  });

  describe('currentLanguage', () => {
    it('should return current language from translate service', () => {
      translateService.currentLang.mockReturnValue('es');
      expect(service.currentLanguage()).toBe('es');
    });

    it('should return default language when currentLang is null', () => {
      translateService.currentLang.mockReturnValue(null);
      expect(service.currentLanguage()).toBe('en');
    });
  });
});
