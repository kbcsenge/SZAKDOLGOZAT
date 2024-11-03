import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {map, tap} from "rxjs/operators";
import {merge, Observable} from "rxjs";
import {SpeechEvent} from "../../model/speech-event";
import {SpeechNotification} from "../../model/speech-notification";
import {SpeechRecognizerService} from "../../services/speech-recognizer.service";
import {SpeechSynthesizerService} from "../../services/speech-synthesizer.service";
import {LanguageService} from "../../services/language.service";
import {GameService} from "../../services/game.service";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {VoiceoverService} from "../../services/voiceover.service";
import * as regex from '../../model/regex.json';
import * as text from "../../model/text.json";
import * as spokentext from "../../model/spokentext.json";

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrl: './time.component.scss'
})
export class TimeComponent implements OnInit, OnDestroy {
  @ViewChild('toggle60') toggle60?: MatSlideToggle;
  @ViewChild('toggle120') toggle120?: MatSlideToggle;
  @ViewChild('toggle180') toggle180?: MatSlideToggle;
  @ViewChild('toggle300') toggle300?: MatSlideToggle;
  currentLanguage='';
  transcript$?: Observable<string>;
  listening$?: Observable<boolean>;
  regexData: any;
  textData: any;
  loadedText: any;
  spokenTextData: any;
  spokenText: any;
  constructor(public dialogRef: MatDialogRef<TimeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private speechrecognition: SpeechRecognizerService,
              public speechSynthesizer: SpeechSynthesizerService,
              private languageService: LanguageService,
              public gameservice: GameService,
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
    this.languageService.getLanguage().subscribe(language => {
      this.currentLanguage = language;
      setTimeout(() => {
        this.speechSynthesizer.speak(
          this.spokenText.gametimeopened, this.currentLanguage
        )
        this.checkToggles()
      })
    });
    this.speechrecognition.initialize(this.currentLanguage);
    this.initRecognition();
    this.speechrecognition.start();
  }

  ngOnDestroy(): void {
    this.speechSynthesizer.stop();
  }

  submit() {
    if(this.toggle60?.checked){
      this.gameservice.setTime(60);
    }
    if(this.toggle120?.checked){
      this.gameservice.setTime(120);
    }
    if(this.toggle180?.checked){
      this.gameservice.setTime(180);
    }
    if(this.toggle300?.checked){
      this.gameservice.setTime(300);
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
      let regex60 = new RegExp(languagePatterns.sixty);
      let regex120 = new RegExp(languagePatterns.hundredandtwenty);
      let regex180 = new RegExp(languagePatterns.hundredandeighty);
      let regex300 = new RegExp(languagePatterns.threehundred);
      let regex60WithNumber = new RegExp(languagePatterns.sixtywithnumber);
      let regex120WithNumber = new RegExp(languagePatterns.hundredandtwentywithnumber);
      let regex180WithNumber = new RegExp(languagePatterns.hundredandeightywithnumber);
      let regex300WithNumber = new RegExp(languagePatterns.threehundredwithnumber);
      let regexSubmit = new RegExp(languagePatterns.submit);
      let test60 = regex60.test(message);
      let test120 = regex120.test(message);
      let test180 = regex180.test(message);
      let test300 = regex300.test(message);
      let test60WithNumber = regex60WithNumber.test(message);
      let test120WithNumber = regex120WithNumber.test(message);
      let test180WithNumber = regex180WithNumber.test(message);
      let test300WithNumber = regex300WithNumber.test(message);
      let testSubmit = regexSubmit.test(message);
      if (test60 || test60WithNumber) {
        if (this.toggle60) {
          this.toggle60.checked = true;
          this.speechSynthesizer.speak("60" + this.spokenText.seconds + this.spokenText.choosen, this.currentLanguage);
        }
        if (this.toggle120) {
          this.toggle120.checked = false;
        }
        if (this.toggle180) {
          this.toggle180.checked = false;
        }
        if (this.toggle300) {
          this.toggle300.checked = false;
        }
      } else if (test120 || test120WithNumber) {
        if (this.toggle60) {
          this.toggle60.checked = false;
        }
        if (this.toggle120) {
          this.toggle120.checked = true;
          this.speechSynthesizer.speak("120" + this.spokenText.seconds + this.spokenText.choosen, this.currentLanguage);
        }
        if (this.toggle180) {
          this.toggle180.checked = false;
        }
        if (this.toggle300) {
          this.toggle300.checked = false;
        }
      }else if (test180 || test180WithNumber) {
        if (this.toggle60) {
          this.toggle60.checked = false;
        }
        if (this.toggle120) {
          this.toggle120.checked = false;
        }
        if (this.toggle180) {
          this.toggle180.checked = true;
          this.speechSynthesizer.speak("180" + this.spokenText.seconds + this.spokenText.choosen, this.currentLanguage);
        }
        if (this.toggle300) {
          this.toggle300.checked = false;
        }
      }else if (test300 || test300WithNumber) {
        if (this.toggle60) {
          this.toggle60.checked = false;
        }
        if (this.toggle120) {
          this.toggle120.checked = false;
        }
        if (this.toggle180) {
          this.toggle180.checked = false;
        }
        if (this.toggle300) {
          this.toggle300.checked = true;
          this.speechSynthesizer.speak("300" + this.spokenText.seconds + this.spokenText.choosen, this.currentLanguage);
        }
      }

      if (testSubmit) {
        this.submit();
      }
    }
  }
  checkToggles() {
    if (this.toggle60?.checked) {
      this.speechSynthesizer.speak("60" + this.spokenText.seconds + this.spokenText.choosen, this.currentLanguage);
    }
    if (this.toggle120?.checked) {
      this.speechSynthesizer.speak("120" + this.spokenText.seconds + this.spokenText.choosen, this.currentLanguage);
    }
    if (this.toggle180?.checked) {
      this.speechSynthesizer.speak("180" + this.spokenText.seconds + this.spokenText.choosen, this.currentLanguage);
    }
    if (this.toggle300?.checked) {
      this.speechSynthesizer.speak("300" + this.spokenText.seconds + this.spokenText.choosen, this.currentLanguage);
    }
  }
}
