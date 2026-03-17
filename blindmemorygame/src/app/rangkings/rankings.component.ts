import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
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
import {VoiceoverService} from "../services/voiceover.service";
import * as regex from '../model/regex.json';
import * as text from '../model/text.json';
import * as spokentext from "../model/spokentext.json";

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
  regexData: any;
  textData: any;
  loadedText: any;
  spokenTextData: any;
  spokenText: any;
  name?: string | null;
  constructor(private router: Router,
              private firestore: AngularFirestore,
              private speechrecognition: SpeechRecognizerService,
              public speechSynthesizer: SpeechSynthesizerService,
              private languageService: LanguageService,
              public voiceoverService: VoiceoverService,
              private route: ActivatedRoute)
  {
    this.rankings = firestore.collection<Ranking>('rankings').valueChanges();
    this.languageService.getLanguage().subscribe(language => {
      this.currentLanguage=language;
    });
  }

  ngOnInit(): void {
    this.regexData = regex;
    this.textData= text;
    this.spokenTextData = spokentext;
    this.loadedText = this.textData[this.currentLanguage];
    this.spokenText = this.spokenTextData[this.currentLanguage];
    this.rankings.subscribe(regex => console.log(regex));
    this.speechSynthesizer.speak(
      this.spokenText.rankingsopen, this.currentLanguage
    );
    this.speechrecognition.initialize(this.currentLanguage);
    this.initRecognition();
    this.speechrecognition.start();
    this.orderRankings();
    this.name = this.route.snapshot.paramMap.get('name');
    this.rankInTheList();
  }

  ngOnDestroy(): void {
    this.speechSynthesizer.stop();
  }

  gotohome(){
    this.router.navigate(['/home']);
  }

  orderRankings(){
    this.rankings = this.firestore.collection<Ranking>('rankings').valueChanges().pipe(
      map(rankings =>
        rankings.sort((a, b) => {
          if (b.points !== a.points) {
            return b.points - a.points;
          }
          return a.time - b.time;
        })
      )
    );
  }

  rankInTheList() {
    this.rankings.pipe(
      map(rankings =>
        rankings.sort((a, b) => {
          if (b.points !== a.points) {
            return b.points - a.points;
          }
          return a.time - b.time;
        })
      )
    ).subscribe(sortedRankings => {
      if(this.name!=null){
        const rank= sortedRankings.findIndex(ranking => ranking.name === this.name) + 1;
        const textToSpeak = this.spokenText.rank.replace("${rank}", rank.toString()+".");
        this.speechSynthesizer.speak(textToSpeak, this.currentLanguage);
      }
    });
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
      const languagePatterns = this.regexData[this.currentLanguage];
      const message = notification.content?.trim() || '';
      let regexHome = new RegExp(languagePatterns.home);
      let testHome = regexHome.test(message);
      if (testHome) {
        this.gotohome();
      }
    }
  }
}
