import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

const STORAGE_KEY = 'country-finder-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly isDarkMode = signal(false);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const savedTheme = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    this.setDarkMode(savedTheme ? savedTheme === 'dark' : prefersDark, false);
  }

  toggle(): void {
    this.setDarkMode(!this.isDarkMode());
  }

  private setDarkMode(enabled: boolean, persist = true): void {
    this.isDarkMode.set(enabled);
    this.document.body.classList.toggle('dark-mode', enabled);

    if (persist && isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, enabled ? 'dark' : 'light');
    }
  }
}
