import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public selectedLanguageKey: string = "navify-selected-language"

  constructor(private translate: TranslateService) { }

  public getSelectedLanguage(): string {
    const language: string | null = localStorage.getItem(this.selectedLanguageKey);
    const defaultLanguage = 'ua';

    return language ?? defaultLanguage;
  }

  public setSelectedLanguage(selectedLaguage: string): void {
    localStorage.setItem(this.selectedLanguageKey, selectedLaguage);
    this.translate.setDefaultLang(selectedLaguage);
  }

  public setSelectedLanguageBasedOnBrowser(): void {
    if (!this.isSelectedLanguageSet()) {
      let defaultLanguage: string = "en";

      let browserLanguage: string = window.navigator.language;

      if (browserLanguage.includes('uk')) {
        defaultLanguage = 'ua';
      }

      this.setSelectedLanguage(defaultLanguage);
    } else {
      let selectedLaguage: string = this.getSelectedLanguage();
      this.setSelectedLanguage(selectedLaguage);
    }
  }

  public isSelectedLanguageSet(): boolean {
    return localStorage.getItem(this.selectedLanguageKey) !== null;
  }
}
