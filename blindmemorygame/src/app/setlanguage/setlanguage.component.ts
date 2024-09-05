import {Component, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {LanguageService} from "../services/language.service";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {SpeechSynthesizerService} from "../services/speech-synthesizer.service";

@Component({
  selector: 'app-setlanguage',
  templateUrl: './setlanguage.component.html',
  styleUrl: './setlanguage.component.scss'
})
export class SetlanguageComponent{
  @ViewChild('toggleEn') toggleEn?: MatSlideToggle;
  @ViewChild('toggleHu') toggleHu?: MatSlideToggle;
  constructor(private router: Router, private languageService: LanguageService,
              public speechSynthesizer: SpeechSynthesizerService) {
    this.speechSynthesizer.speak(
      'Állítsd be a nyelvet!', 'hu-HU'
    );
    this.speechSynthesizer.speak(
      'Please select language!', 'en-US'
    );
  }
  submit(){
    let selectedLanguage='';
    if (this.toggleHu?.checked) {
      selectedLanguage = 'hu-HU';
    } else if (this.toggleEn?.checked) {
      selectedLanguage = 'en-US';
    }
    this.languageService.changeLanguage(selectedLanguage);
    this.router.navigate(['/home']);
  }
 save(){
   this.speechSynthesizer.speak(
     'Mentés', 'hu-HU'
   );
   this.speechSynthesizer.speak(
     'Save', 'en-US'
   );
 }

 voiceoverHungarian(event: MouseEvent){
   const target = event.target as HTMLElement;
   const text = target.innerText;
   this.speechSynthesizer.speak( text, 'hu-HU');
 }

  voiceoverEnglish(event: MouseEvent){
    const target = event.target as HTMLElement;
    const text = target.innerText;
    this.speechSynthesizer.speak( text, 'en-US');
  }
}
