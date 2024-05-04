import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import {SpeechNotification} from "../model/speech-notification";
import {SpeechEvent} from "../model/speech-event";

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root',
})
export class SpeechRecognizerService {

  recognition!: typeof webkitSpeechRecognition;
  language!: string;
  isListening = false;

  constructor(private ngZone: NgZone) {}

  initialize(language: string): boolean {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.setLanguage(language);
      return true;
    }

    return false;
  }

  setLanguage(language: string): void {
    this.language = language;
    this.recognition.lang = language;
  }

  start(): void {
    if (!this.recognition) {
      return;
    }

    this.recognition.start();
    this.isListening = true;

    this.recognition.onend = () => {
      if (this.isListening) {
        this.recognition.start();
      }
    };
  }

  onStart(): Observable<SpeechNotification<never>> {
    if (!this.recognition) {
      this.initialize(this.language);
    }

    return new Observable(observer => {
      this.recognition.onstart = () => {
        this.ngZone.run(() => {
          observer.next({
            event: SpeechEvent.Start
          });
        });
      };
    });
  }

  onEnd(): Observable<SpeechNotification<never>> {
    return new Observable(observer => {
      this.recognition.onend = () => {
        this.ngZone.run(() => {
          observer.next({
            event: SpeechEvent.End
          });
          this.isListening = false;
        });
      };
    });
  }

  onResult(): Observable<SpeechNotification<string>> {
    return new Observable(observer => {
      this.recognition.onresult = (event: any) => {
        let interimContent = '';
        let finalContent = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalContent += event.results[i][0].transcript;
            this.ngZone.run(() => {
              observer.next({
                event: SpeechEvent.FinalContent,
                content: finalContent
              });
            });
          } else {
            interimContent += event.results[i][0].transcript;
            this.ngZone.run(() => {
              observer.next({
                event: SpeechEvent.InterimContent,
                content: interimContent
              });
            });
          }
        }
      };
    });
  }

}
