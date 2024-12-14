import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {map, tap} from "rxjs/operators";
import {merge, Observable} from "rxjs";
import {SpeechEvent} from "../../model/speech-event";
import {SpeechNotification} from "../../model/speech-notification";
import {SpeechRecognizerService} from "../../services/speech-recognizer.service";
import {SpeechSynthesizerService} from "../../services/speech-synthesizer.service";
import {LanguageService} from "../../services/language.service";
import {VoiceoverService} from "../../services/voiceover.service";
import * as regex from '../../model/regex.json';
import * as text from "../../model/text.json";
import * as spokentext from "../../model/spokentext.json";

@Component({
  selector: 'app-volume-and-speed',
  templateUrl: './volume-and-speed.component.html',
  styleUrl: './volume-and-speed.component.scss'
})
export class VolumeAndSpeedComponent implements OnInit, OnDestroy{
  @ViewChild('volumeInput') volumeInput?: ElementRef;
  @ViewChild('rateInput') rateInput?: ElementRef;
  currentLanguage='';
  transcript$?: Observable<string>;
  listening$?: Observable<boolean>;
  regexData: any;
  textData: any;
  loadedText: any;
  spokenTextData: any;
  spokenText: any;
  constructor(public dialogRef: MatDialogRef<VolumeAndSpeedComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private speechrecognition: SpeechRecognizerService,
              public speechSynthesizer: SpeechSynthesizerService,
              private languageService: LanguageService,
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
          this.spokenText.vandopened +
          " . " +
          this.spokenText.volume +
          this.volumeInput?.nativeElement.value.toString() +
          " . "+
          this.spokenText.playbackspeed +
          this.rateInput?.nativeElement.value.toString(), this.currentLanguage);
      });
    });
    this.speechrecognition.initialize(this.currentLanguage);
    this.initRecognition();
    this.speechrecognition.start();
  }
  ngOnDestroy() {
    this.speechSynthesizer.stop();
  }

  submit() {
    this.speechSynthesizer.setVolume(Number(this.volumeInput?.nativeElement.value));
    this.speechSynthesizer.setRate(Number(this.rateInput?.nativeElement.value));
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
      let regexFast = new RegExp(languagePatterns.fast);
      let regexSlow = new RegExp(languagePatterns.slow);
      let regexLoud = new RegExp(languagePatterns.loud);
      let regexquiet= new RegExp(languagePatterns.quiet);
      let regexSubmit = new RegExp(languagePatterns.submit);
      let testFast = regexFast.test(message);
      let testSlow = regexSlow.test(message);
      let testLoud = regexLoud.test(message);
      let testQuiet= regexquiet.test(message);
      let testSubmit = regexSubmit.test(message);

      if (testFast && this.speechSynthesizer.getRate() < 5) {
        if (this.rateInput) {
          let newRate = parseFloat(this.rateInput.nativeElement.value) + 0.25;
          this.rateInput.nativeElement.value = newRate.toFixed(2);
          this.speechSynthesizer.setRate(newRate);
          this.speechSynthesizer.speak(
            this.speechSynthesizer.getRate().toString(), this.currentLanguage
          );
        }
      }

      if (testSlow && this.speechSynthesizer.getRate() > 0.25) {
        if (this.rateInput) {
          let newRate = parseFloat(this.rateInput.nativeElement.value) - 0.25;
          this.rateInput.nativeElement.value = newRate.toFixed(2);
          this.speechSynthesizer.setRate(newRate);
          this.speechSynthesizer.speak(
            this.speechSynthesizer.getRate().toString(), this.currentLanguage
          );
        }
      }

      if (testLoud && this.speechSynthesizer.getVolume() < 1) {
        if (this.volumeInput) {
          let newVolume = parseFloat(this.volumeInput.nativeElement.value) + 0.1;
          this.volumeInput.nativeElement.value = newVolume.toFixed(1);
          this.speechSynthesizer.setVolume(newVolume);
          this.speechSynthesizer.speak(
            this.speechSynthesizer.getVolume().toFixed(1), this.currentLanguage
          );
        }
      }

      if (testQuiet && this.speechSynthesizer.getVolume() > 0) {
        if (this.volumeInput) {
          let newVolume = parseFloat(this.volumeInput.nativeElement.value) - 0.1;
          this.volumeInput.nativeElement.value = newVolume.toFixed(1);
          this.speechSynthesizer.setVolume(newVolume);
          this.speechSynthesizer.speak(
            this.speechSynthesizer.getVolume().toFixed(1), this.currentLanguage
          );
        }
      }

      if (testSubmit) {
        this.submit();
      }
    }
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return `${value}`;
  }

  checkVolume(){
    this.speechSynthesizer.speak(this.spokenText.volume + this.volumeInput?.nativeElement.value.toString(), this.currentLanguage)
  }

  checkRate(){
    this.speechSynthesizer.speak(this.spokenText.playbackspeed + this.rateInput?.nativeElement.value.toString(), this.currentLanguage)
  }
}
