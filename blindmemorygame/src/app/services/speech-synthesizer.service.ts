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
    this.speechSynthesizer.pitch = 0.5;
  }
  setVolume(value: number){
    this.speechSynthesizer.volume=value;
  }

  setRate(value: number){
    this.speechSynthesizer.rate = value;
  }
  getVolume(){
    return  this.speechSynthesizer.volume;
  }
  getRate(){
    return  this.speechSynthesizer.rate;
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
