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

@Component({
  selector: 'app-volumeandspeed',
  templateUrl: './volumeandspeed.component.html',
  styleUrl: './volumeandspeed.component.scss'
})
export class VolumeandspeedComponent implements OnInit, OnDestroy{
  @ViewChild('volumeInput') volumeInput?: ElementRef;
  @ViewChild('rateInput') rateInput?: ElementRef;
  currentLanguage='';
  transcript$?: Observable<string>;
  listening$?: Observable<boolean>;
  regexData: any;
  textData: any;
  loadedText: any;
  constructor(public dialogRef: MatDialogRef<VolumeandspeedComponent>,
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
    this.speechSynthesizer.speak(
      'Volume and playback speed setting open\n', this.currentLanguage
    );
    this.speechrecognition.initialize(this.currentLanguage);
    this.initRecognition();
    this.speechrecognition.start();
    this.regexData = regex;
    this.textData= text;
    this.loadedText = this.textData[this.currentLanguage];
  }
  ngOnDestroy() {
    this.speechSynthesizer.stop();
  }

  submit() {
    this.speechSynthesizer.setVolume(Number(this.volumeInput?.nativeElement.value));
    this.speechSynthesizer.setRate(Number(this.rateInput?.nativeElement.value));
    console.log(this.speechSynthesizer.getRate())
    console.log(this.speechSynthesizer.getVolume())
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
    const languagePatterns = this.regexData[this.currentLanguage];
    const message = notification.content?.trim() || '';
    let regexSubmit= new RegExp(languagePatterns.save, 'i');
    let testSubmit = regexSubmit.test(message);
    if(testSubmit){
      this.submit();
    }
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }
}
