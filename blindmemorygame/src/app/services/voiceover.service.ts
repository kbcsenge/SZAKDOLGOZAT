import { Injectable } from '@angular/core';
import {LanguageService} from "./language.service";
import {SpeechSynthesizerService} from "./speech-synthesizer.service";

@Injectable({
  providedIn: 'root'
})
export class VoiceoverService {

  currentLanguage = '';
  constructor(private languageService: LanguageService, public speechSynthesizer: SpeechSynthesizerService) {
    this.languageService.currentLanguage.subscribe(language => this.currentLanguage = language)
  }

  readingText(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const text = target.innerText;
    this.voiceover(text);
  }

  voiceover(words: string){
    this.speechSynthesizer.speak( words, this.currentLanguage);
  }
}
