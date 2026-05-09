import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  readonly darkMode = signal<boolean>(false);

  constructor() {
    this.initTheme();
  }

  toggleTheme(): void {
    const next = !this.darkMode();

    this.darkMode.set(next);

    localStorage.setItem('dark-mode', String(next));

    this.updateHtmlClass(next);
  }

  private initTheme(): void {
    const saved = localStorage.getItem('dark-mode') === 'true';

    this.darkMode.set(saved);

    this.updateHtmlClass(saved);
  }

  private updateHtmlClass(enabled: boolean): void {
    const html = this.document.documentElement;

    if (enabled) {
      html.classList.add('dark');
      return;
    }

    html.classList.remove('dark');
  }
}
