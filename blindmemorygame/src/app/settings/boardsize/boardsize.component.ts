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
import {VoiceoverService} from "../../services/voiceover.service";
import * as regex from '../../model/regex.json';
import * as text from '../../model/text.json';
import * as spokentext from "../../model/spokentext.json";

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
  regexData: any;
  textData: any;
  loadedText: any;
  spokenTextData: any;
  spokenText: any;
  constructor(public dialogRef: MatDialogRef<BoardsizeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private speechrecognition: SpeechRecognizerService,
              public speechSynthesizer: SpeechSynthesizerService,
              private languageService: LanguageService,
              public gameservice: GameService,
              public voiceoverService: VoiceoverService ) {
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
    this.languageService.getLanguage().subscribe(language => {
      this.currentLanguage = language;
      setTimeout(() => {
        this.speechSynthesizer.speak(
          this.spokenText.gameboardsizeopened, this.currentLanguage
        )
        this.checkToggles()
      })
    });
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
      const languagePatterns = this.regexData[this.currentLanguage];
      const message = notification.content?.trim() || '';
      let regex3x4 = new RegExp(languagePatterns.threebyfour);
      let regex4x4 = new RegExp(languagePatterns.fourbyfour);
      let regex4x5 = new RegExp(languagePatterns.fourbyfive);
      let regexSubmit = new RegExp(languagePatterns.submit);
      let test3x4 = regex3x4.test(message);
      let test4x4 = regex4x4.test(message);
      let test4x5 = regex4x5.test(message);
      let testSubmit = regexSubmit.test(message);

      if (test3x4) {
        if (this.toggle3x4) {
          this.toggle3x4.checked = true;
          this.speechSynthesizer.speak(this.spokenText.threebyfour + this.spokenText.gameboard + this.spokenText.choosen, this.currentLanguage);
        }
        if (this.toggle4x4) {
          this.toggle4x4.checked = false;
        }
        if (this.toggle4x5) {
          this.toggle4x5.checked = false;
        }
      } else if (test4x4) {
        if (this.toggle4x4) {
          this.toggle4x4.checked = true;
          this.speechSynthesizer.speak(this.spokenText.fourbyfour + this.spokenText.gameboard + this.spokenText.choosen, this.currentLanguage);
        }
        if (this.toggle3x4) {
          this.toggle3x4.checked = false;
        }
        if (this.toggle4x5) {
          this.toggle4x5.checked = false;
        }
      } else if (test4x5) {
        if (this.toggle4x5) {
          this.toggle4x5.checked = true;
          this.speechSynthesizer.speak(this.spokenText.fourbyfive + this.spokenText.gameboard + this.spokenText.choosen, this.currentLanguage);
        }
        if (this.toggle3x4) {
          this.toggle3x4.checked = false;
        }
        if (this.toggle4x4) {
          this.toggle4x4.checked = false;
        }
      }
      if (testSubmit) {
        this.submit();
      }
    }
  }

  checkToggles() {
    if (this.toggle3x4?.checked) {
      this.speechSynthesizer.speak(this.spokenText.threebyfour + this.spokenText.gameboard + this.spokenText.choosen, this.currentLanguage);
    }
    if (this.toggle4x4?.checked) {
      this.speechSynthesizer.speak(this.spokenText.fourbyfour + this.spokenText.gameboard + this.spokenText.choosen, this.currentLanguage);
    }
    if (this.toggle4x5?.checked) {
      this.speechSynthesizer.speak(this.spokenText.fourbyfive +this.spokenText.gameboard + this.spokenText.choosen, this.currentLanguage);
    }
  }
}
