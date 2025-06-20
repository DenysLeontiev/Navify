import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public selectedLanguageKey: string = "ua"

  constructor(private translate: TranslateService) { }

  public setSelectedLanguage(selectedLaguage: string): void {
    localStorage.setItem(this.selectedLanguageKey, selectedLaguage);
    this.translate.setDefaultLang(selectedLaguage);
  }
}
