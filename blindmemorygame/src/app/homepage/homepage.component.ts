import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {defaultLanguage} from "../model/languages";
import {merge, Observable} from "rxjs";
import {SpeechRecognizerService} from "../services/speech-recognizer.service";
import {map, tap} from "rxjs/operators";
import {SpeechEvent} from "../model/speech-event";
import {SpeechNotification} from "../model/speech-notification";
import {SpeechSynthesizerService} from "../services/speech-synthesizer.service";

@Component({
  selector: 'app-homepage',
  standalone: true,
  templateUrl: './homepage.component.html',
  imports: [
  ],
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit, OnDestroy{
  transcript$?: Observable<string>;
  listening$?: Observable<boolean>;
  constructor(private router: Router,
              private speechrecognition: SpeechRecognizerService,
              private speechSynthesizer: SpeechSynthesizerService) {
  }


  ngOnInit(): void {
    this.speechSynthesizer.speak(
      'Szia! Ez egy beszédfelismerő játék vakok és látássérültek számára!', defaultLanguage
    );
    this.speechrecognition.initialize(defaultLanguage);
    this.initRecognition();
    this.speechrecognition.start()
  }

  ngOnDestroy(): void {
    this.speechSynthesizer.stop();
  }

  gotogame(){
    this.router.navigate(['/game']);
  }

  gotosettings(){
    this.router.navigate(['/settings']);
  }

  gotohome(){
    this.router.navigate(['/']);
  }
  gotoresults(){
    this.router.navigate(['/rankings']);
  }
  private initRecognition(): void {
    this.transcript$ = this.speechrecognition.onResult().pipe(
      tap((notification) => {
        this.processNotification(notification);
      }),
      map((notification) => notification.content || '')
    );
    this.transcript$.subscribe();
    this.listening$ = merge(
      this.speechrecognition.onStart(),
      this.speechrecognition.onEnd()
    ).pipe(map((notification) => notification.event === SpeechEvent.Start));
  }
  private processNotification(notification: SpeechNotification<string>): void {
    if (notification.event === SpeechEvent.FinalContent) {
      const message = notification.content?.trim() || '';
      let regexSettings = new RegExp('.*beállítás.*')
      let regexGame = new RegExp('.*játék.*')
      let regexRanglist = new RegExp('.*ranglist.*')
      let testSettings = regexSettings.test(message);
      let testGame = regexGame.test(message);
      let testRanglist = regexRanglist.test(message);
      if(testSettings){
        this.gotosettings();
      }
      if(testGame){
        this.gotogame();
      }
      if(testRanglist){
        this.gotoresults();
      }
    }
  }
}
