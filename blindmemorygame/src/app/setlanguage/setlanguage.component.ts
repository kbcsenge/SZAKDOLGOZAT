import {Component, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {LanguageService} from "../services/language.service";
import {documentId} from "@angular/fire/firestore";
import {MatSlideToggle} from "@angular/material/slide-toggle";

@Component({
  selector: 'app-setlanguage',
  templateUrl: './setlanguage.component.html',
  styleUrl: './setlanguage.component.scss'
})
export class SetlanguageComponent {
  @ViewChild('toggleEn') toggleEn?: MatSlideToggle;
  @ViewChild('toggleHu') toggleHu?: MatSlideToggle;
  constructor(private router: Router, private languageService: LanguageService) {
  }

  submit(){
    let selectedLanguage='';
    if (this.toggleHu?.checked) {
      selectedLanguage = 'hu-HU';
    } else if (this.toggleEn?.checked) {
      selectedLanguage = 'en-GB';
    }
    this.languageService.changeLanguage(selectedLanguage);
    this.router.navigate(['/home']);
  }

}
