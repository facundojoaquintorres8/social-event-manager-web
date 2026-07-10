import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'en' | 'es';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);

  private readonly storageKey = 'language';
  private readonly supportedLanguages: Language[] = ['en', 'es'];
  private readonly defaultLanguage: Language = 'en';

  init(): void {
    const saved = localStorage.getItem(this.storageKey) as Language | null;
    const browser = navigator.language.slice(0, 2) as Language;

    const language =
      saved ?? (this.supportedLanguages.includes(browser) ? browser : this.defaultLanguage);

    this.setLanguage(language);
  }

  setLanguage(language: Language): void {
    this.translate.use(language);
    localStorage.setItem(this.storageKey, language);
  }

  currentLanguage(): Language {
    const current = this.translate.currentLang();
    return (current as Language) ?? this.defaultLanguage;
  }
}
