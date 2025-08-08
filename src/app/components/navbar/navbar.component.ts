import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../_services/language/language.service';
import { FormsModule } from '@angular/forms';
import { Journey } from '../../models/journey';
import { LocalStorageService } from '../../_services/localStorage/local-storage.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, TranslatePipe, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  public selectedLanguage: string = "";

  constructor(public translate: TranslateService, private languageService: LanguageService, private l: LocalStorageService) {
    this.languageService.setSelectedLanguageBasedOnBrowser();
    this.setInitialLanguage();
  }

  private setInitialLanguage() {
    this.selectedLanguage = this.languageService.getSelectedLanguage();
    this.languageService.setSelectedLanguage(this.selectedLanguage);
  }

  public onLanguageChange(event: Event) {
    let language = (event.target as HTMLSelectElement).value;
    this.languageService.setSelectedLanguage(language);
  }
}
