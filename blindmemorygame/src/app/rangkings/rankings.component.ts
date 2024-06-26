import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {merge, Observable} from "rxjs";
import {Ranking} from "../model/Ranking";
import {CommonModule} from "@angular/common";
import {map, tap} from "rxjs/operators";
import {SpeechEvent} from "../model/speech-event";
import {SpeechNotification} from "../model/speech-notification";
import {SpeechRecognizerService} from "../services/speech-recognizer.service";
import {SpeechSynthesizerService} from "../services/speech-synthesizer.service";
import {LanguageService} from "../services/language.service";

@Component({
  selector: 'app-rangkings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rangkings.component.html',
  styleUrl: './rangkings.component.scss'
})
export class RankingsComponent implements OnInit, OnDestroy{
  currentLanguage='';
  transcript$?: Observable<string>;
  listening$?: Observable<boolean>;
  rankings: Observable<Ranking[]>;
  constructor(private router: Router,
              private firestore: AngularFirestore,
              private speechrecognition: SpeechRecognizerService,
              private speechSynthesizer: SpeechSynthesizerService,
              private languageService: LanguageService)
  {
    this.rankings = firestore.collection<Ranking>('rankings').valueChanges();
    this.languageService.getLanguage().subscribe(language => {
      this.currentLanguage=language;
    });
  }

  ngOnInit(): void {
    this.rankings.subscribe(data => console.log(data));
    this.speechSynthesizer.speak(
      'Ranglista megnyitva', this.currentLanguage
    );
    this.speechrecognition.initialize(this.currentLanguage);
    this.initRecognition();
    this.speechrecognition.start()
  }

  ngOnDestroy(): void {
    this.speechSynthesizer.stop();
  }

  gotohome(){
    this.router.navigate(['/home']);
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
      let regexHome = new RegExp('.*főoldalra.*')
      let testHome = regexHome.test(message);
      if(testHome){
        this.gotohome();
      }
    }
  }
}
