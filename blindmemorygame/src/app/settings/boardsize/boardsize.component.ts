import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {map, tap} from "rxjs/operators";
import {merge, Observable} from "rxjs";
import {SpeechEvent} from "../../model/speech-event";
import {SpeechNotification} from "../../model/speech-notification";
import {SpeechRecognizerService} from "../../services/speech-recognizer.service";
import {SpeechSynthesizerService} from "../../services/speech-synthesizer.service";
import {LanguageService} from "../../services/language.service";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {GameService} from "../../services/game.service";


@Component({
  selector: 'app-boardsize',
  templateUrl: './boardsize.component.html',
  styleUrl: './boardsize.component.scss'
})
export class BoardsizeComponent implements OnInit, OnDestroy{
  @ViewChild('toggle3x4') toggle3x4?: MatSlideToggle;
  @ViewChild('toggle4x4') toggle4x4?: MatSlideToggle;
  @ViewChild('toggle4x5') toggle4x5?: MatSlideToggle;
  currentLanguage='';
  transcript$?: Observable<string>;
  listening$?: Observable<boolean>;
  constructor(public dialogRef: MatDialogRef<BoardsizeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private speechrecognition: SpeechRecognizerService,
              private speechSynthesizer: SpeechSynthesizerService,
              private languageService: LanguageService,
              public gameservice: GameService) {
    this.languageService.getLanguage().subscribe(language => {
      this.currentLanguage=language;
    });
  }
  ngOnInit(): void {
    this.speechSynthesizer.speak(
      'Játéktér beállítás megnyitva', this.currentLanguage
    );
    this.speechrecognition.initialize(this.currentLanguage);
    this.initRecognition();
    this.speechrecognition.start()
  }

  ngOnDestroy() {
    this.speechSynthesizer.stop();
  }

  submit() {
    if(this.toggle3x4?.checked){
      this.gameservice.setTableSize(3,4);
    }
    if(this.toggle4x4?.checked){
      this.gameservice.setTableSize(4, 4);
    }
    if(this.toggle4x5?.checked){
      this.gameservice.setTableSize(4,5);
    }
    this.dialogRef.close();
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
      let regexSubmit= new RegExp('.*mentés.*')
      let testSubmit = regexSubmit.test(message);
      if(testSubmit){
        this.submit();
      }
    }
  }
}
