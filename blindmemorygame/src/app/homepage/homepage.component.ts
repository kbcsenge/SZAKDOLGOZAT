import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {merge, Observable} from "rxjs";
import {SpeechRecognizerService} from "../services/speech-recognizer.service";
import {map, tap} from "rxjs/operators";
import {SpeechEvent} from "../model/speech-event";
import {SpeechNotification} from "../model/speech-notification";
import {SpeechSynthesizerService} from "../services/speech-synthesizer.service";
import {LanguageService} from "../services/language.service";
import {HelperComponent} from "../helper/helper.component";
import {MatDialog} from "@angular/material/dialog";
import {GameService} from "../services/game.service";
import {VoiceoverService} from "../services/voiceover.service";
import * as regex from '../model/regex.json';
import * as text from '../model/text.json';
import * as spokentext from "../model/spokentext.json";
@Component({
  selector: 'app-homepage',
  standalone: true,
  templateUrl: './homepage.component.html',
  imports: [
  ],
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit, OnDestroy{
  currentLanguage='';
  transcript$?: Observable<string>;
  listening$?: Observable<boolean>;
  regexData: any;
  textData: any;
  loadedText: any;
  spokenTextData: any;
  spokenText: any;
  constructor(private router: Router,
              private speechrecognition: SpeechRecognizerService,
              public speechSynthesizer: SpeechSynthesizerService,
              private languageService: LanguageService,
              public dialog: MatDialog,
              private gameservice: GameService,
              public voiceoverService: VoiceoverService) {
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
    this.speechSynthesizer.speak(
      this.spokenText.welcome, this.currentLanguage
    );
    this.speechrecognition.initialize(this.currentLanguage);
    this.initRecognition();
    this.speechrecognition.start();
  }

  ngOnDestroy(): void {
    this.speechSynthesizer.stop();
  }

  gotogame() {
    if (this.gameservice.isSinglePlayer) {
      this.router.navigate(['/game']);
    } else {
      this.router.navigate(['/multiplayer']);
    }
  }

  gotosettings(){
    this.router.navigate(['/settings']);
  }

  gotohome(){
    this.router.navigate(['/home']);
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
      const languagePatterns = this.regexData[this.currentLanguage];
      const message = notification.content?.trim() || '';
      let regexSettings = new RegExp(languagePatterns.settings);
      let regexGame = new RegExp(languagePatterns.game);
      let regexRanglist = new RegExp(languagePatterns.ranking);
      let regexHelp = new RegExp(languagePatterns.help);
      let testSettings = regexSettings.test(message);
      let testGame = regexGame.test(message);
      let testRanglist = regexRanglist.test(message);
      let testHelp = regexHelp.test(message);
      if (testSettings) {
        this.gotosettings();
      }
      if (testGame) {
        this.gotogame();
      }
      if (testRanglist) {
        this.gotoresults();
      }
      if (testHelp) {
        this.gotohelp();
      }
    }
  }

  gotohelp(): void{
    const dialogRef = this.dialog.open(HelperComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.speechSynthesizer.speak(
        this.spokenText.helpclosed, this.currentLanguage
      );
      this.reInit();
    });
  }
  reInit(){
    this.speechrecognition.initialize(this.currentLanguage);
    this.initRecognition();
    this.speechrecognition.start()
  }
}
