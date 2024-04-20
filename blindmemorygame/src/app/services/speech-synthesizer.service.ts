import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpeechSynthesizerService {
  speechSynthesizer!: SpeechSynthesisUtterance;

  constructor() {
    this.initSynthesis();
  }

  initSynthesis(): void {
    this.speechSynthesizer = new SpeechSynthesisUtterance();
    this.speechSynthesizer.volume = 1;
    this.speechSynthesizer.rate = 1;
    this.speechSynthesizer.pitch = 0.5;
  }

  speak(message: string, language: string, callback?: () => void): void {
    this.speechSynthesizer.lang = language;
    this.speechSynthesizer.text = message;
    this.speechSynthesizer.onend = (event) => {
      console.log('Speech has finished being spoken.');
      if (callback) {
        callback();
      }
    };
    speechSynthesis.speak(this.speechSynthesizer);
  }
  stop(): void {
    speechSynthesis.cancel();
  }
}
