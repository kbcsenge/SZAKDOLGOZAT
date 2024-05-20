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

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit, OnDestroy{
  currentLanguage='';
  transcript$?: Observable<string>;
  listening$?: Observable<boolean>;
  constructor(private router: Router,
              public dialog: MatDialog,
              private speechrecognition: SpeechRecognizerService,
              private speechSynthesizer: SpeechSynthesizerService,
              private languageService: LanguageService) {
    this.languageService.getLanguage().subscribe(language => {
      this.currentLanguage=language;
    });
  }
  ngOnInit() {
    this.speechSynthesizer.speak(
      'Beállítások megnyitva', this.currentLanguage
    );
    this.speechrecognition.initialize(this.currentLanguage);
    this.initRecognition();
    this.speechrecognition.start()
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
        'Hangerő és lejátszási sebesség beállítása mentve', this.currentLanguage
      );
      this.reInit();
    });
  }
  nofpDialog(): void{
    const dialogRef = this.dialog.open(NumberofplayersComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.speechSynthesizer.speak(
        'Játékosok számának beállítása mentve', this.currentLanguage
      );
      this.reInit();
    });
  }

  boardsizeDialog(): void{
    const dialogRef = this.dialog.open(BoardsizeComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.speechSynthesizer.speak(
        'Játéktér beállítása mentve', this.currentLanguage
      );
      this.reInit();
    });
  }

  timeDialog(): void{
    const dialogRef = this.dialog.open(TimeComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.speechSynthesizer.speak(
        'Játékidő beállítása mentve', this.currentLanguage
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
      const message = notification.content?.trim() || '';
      let regexHome = new RegExp('.*főoldal.*')
      let testHome = regexHome.test(message);
      let regexBoard = new RegExp('.*játékmező.*')
      let testBoard = regexBoard.test(message);
      let regexPlayers= new RegExp('.*játékosok.*')
      let testPlayers = regexPlayers.test(message);
      let regexTime= new RegExp('.*idő.*')
      let testTime = regexTime.test(message);
      let regexVolume= new RegExp('.*hangerő.*')
      let testVolume = regexVolume.test(message);
      let regexSpeed= new RegExp('.*sebesség.*')
      let testSpeed = regexSpeed.test(message);
      if(testHome){
        this.gotohome();
      }
      if(testPlayers){
        this.nofpDialog();
      }
      if(testBoard){
        this.boardsizeDialog();
      }
      if(testTime){
        this.timeDialog();
      }
      if(testVolume || testSpeed){
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


