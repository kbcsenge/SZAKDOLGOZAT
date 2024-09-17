import {Component, OnDestroy, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {Router} from "@angular/router";
import { BoardsizeComponent } from './boardsize/boardsize.component';
import { NumberofplayersComponent } from './numberofplayers/numberofplayers.component';
import { TimeComponent } from './time/time.component';
import { VolumeandspeedComponent } from './volumeandspeed/volumeandspeed.component';
import {map, tap} from "rxjs/operators";
import {merge, Observable} from "rxjs";
import {SpeechEvent} from "../model/speech-event";
import {SpeechNotification} from "../model/speech-notification";
import {SpeechRecognizerService} from "../services/speech-recognizer.service";
import {SpeechSynthesizerService} from "../services/speech-synthesizer.service";
import {LanguageService} from "../services/language.service";
import {VoiceoverService} from "../services/voiceover.service";
import * as regex from '../model/regex.json';
import * as text from '../model/text.json';
import * as spokentext from "../model/spokentext.json";
import {MatListOption, MatSelectionList} from "@angular/material/list";
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    MatSelectionList,
    MatListOption
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit, OnDestroy{
  currentLanguage='';
  transcript$?: Observable<string>;
  listening$?: Observable<boolean>;
  regexData: any;
  textData: any;
  loadedText: any;
  spokenTextData: any;
  spokenText: any;
  constructor(private router: Router,
              public dialog: MatDialog,
              private speechrecognition: SpeechRecognizerService,
              public speechSynthesizer: SpeechSynthesizerService,
              private languageService: LanguageService,
              public voiceoverService: VoiceoverService) {
    this.languageService.getLanguage().subscribe(language => {
      this.currentLanguage=language;
    });
  }
  ngOnInit() {
    this.regexData = regex;
    this.textData= text;
    this.spokenTextData = spokentext;
    this.loadedText = this.textData[this.currentLanguage];
    this.spokenText = this.spokenTextData[this.currentLanguage];
    this.speechSynthesizer.speak(
      this.spokenText.settingsopened, this.currentLanguage
    );
    this.speechrecognition.initialize(this.currentLanguage);
    this.initRecognition();
    this.speechrecognition.start();
  }
  ngOnDestroy() {
    this.speechSynthesizer.stop();
  }

  gotohome(){
    this.router.navigate(['/home']);
  }

  vandsDialog(): void{
    const dialogRef = this.dialog.open(VolumeandspeedComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.speechSynthesizer.speak(
        this.spokenText.vandsaved, this.currentLanguage
      );
      this.reInit();
    });
  }
  nofpDialog(): void{
    const dialogRef = this.dialog.open(NumberofplayersComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.speechSynthesizer.speak(
        this.spokenText.numberofplayerssaved, this.currentLanguage
      );
      this.reInit();
    });
  }

  boardsizeDialog(): void{
    const dialogRef = this.dialog.open(BoardsizeComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.speechSynthesizer.speak(
        this.spokenText.gameboardsizesaved, this.currentLanguage
      );
      this.reInit();
    });
  }

  timeDialog(): void{
    const dialogRef = this.dialog.open(TimeComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.speechSynthesizer.speak(
        this.spokenText.gametimesaved, this.currentLanguage
      );
      this.reInit();
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
      let regexHome = new RegExp(languagePatterns.home, 'i');
      let testHome = regexHome.test(message);
      let regexBoard = new RegExp(languagePatterns.gameboard, 'i');
      let testBoard = regexBoard.test(message);
      let regexPlayers = new RegExp(languagePatterns.players, 'i');
      let testPlayers = regexPlayers.test(message);
      let regexTime = new RegExp(languagePatterns.time, 'i');
      let testTime = regexTime.test(message);
      let regexVolume = new RegExp(languagePatterns.volume, 'i');
      let testVolume = regexVolume.test(message);
      let regexSpeed = new RegExp(languagePatterns.speed, 'i');
      let testSpeed = regexSpeed.test(message);
      if (testHome) {
        this.gotohome();
      }
      if (testPlayers) {
        this.nofpDialog();
      }
      if (testBoard) {
        this.boardsizeDialog();
      }
      if (testTime) {
        this.timeDialog();
      }
      if (testVolume || testSpeed) {
        this.vandsDialog();
      }
    }
  }

  reInit(){
    this.speechrecognition.initialize(this.currentLanguage);
    this.initRecognition();
    this.speechrecognition.start()
  }
}


