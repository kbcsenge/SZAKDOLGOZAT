import {Component, OnDestroy, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {Router} from "@angular/router";
import { BoardsizeComponent } from './boardsize/boardsize.component';
import { LanguageComponent } from './language/language.component';
import { NumberofplayersComponent } from './numberofplayers/numberofplayers.component';
import { TimeComponent } from './time/time.component';
import { VolumeandspeedComponent } from './volumeandspeed/volumeandspeed.component';
import {map, tap} from "rxjs/operators";
import {merge, Observable} from "rxjs";
import {SpeechEvent} from "../model/speech-event";
import {SpeechNotification} from "../model/speech-notification";
import {defaultLanguage} from "../model/languages";
import {SpeechRecognizerService} from "../services/speech-recognizer.service";
import {SpeechSynthesizerService} from "../services/speech-synthesizer.service";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit, OnDestroy{

  transcript$?: Observable<string>;
  listening$?: Observable<boolean>;
  constructor(private router: Router,
              public dialog: MatDialog,
              private speechrecognition: SpeechRecognizerService,
              private speechSynthesizer: SpeechSynthesizerService) {
  }
  ngOnInit() {
    this.speechSynthesizer.speak(
      'Beállítások megnyitva', defaultLanguage
    );
    this.speechrecognition.initialize(defaultLanguage);
    this.initRecognition();
    this.speechrecognition.start()
  }
  ngOnDestroy() {
    this.speechSynthesizer.stop();
  }

  gotohome(){
    this.router.navigate(['/']);
  }
  langueageDialog(): void{
    const dialogRef = this.dialog.open(LanguageComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.reInit();
    });

  }
  vandsDialog(): void{
    const dialogRef = this.dialog.open(VolumeandspeedComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.reInit();
    });
  }
  nofpDialog(): void{
    const dialogRef = this.dialog.open(NumberofplayersComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.reInit();
    });
  }

  boardsizeDialog(): void{
    const dialogRef = this.dialog.open(BoardsizeComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.reInit();
    });
  }

  timeDialog(): void{
    const dialogRef = this.dialog.open(TimeComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
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
      let regexHome = new RegExp('.*főoldalra.*')
      let testHome = regexHome.test(message);
      let regexLanguage = new RegExp('.*nyelv.*')
      let testLanguage = regexLanguage.test(message);
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
      if(testLanguage){
        this.langueageDialog();
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
    this.ngOnInit();
  }
}


