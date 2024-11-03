import { Component } from '@angular/core';
import {LanguageService} from "./services/language.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent{
  title = 'blindmemorygame';
  setLanguage = '';

  constructor(private languageService: LanguageService) {
    this.languageService.currentLanguage.subscribe(language => this.setLanguage = language);
  }
}
