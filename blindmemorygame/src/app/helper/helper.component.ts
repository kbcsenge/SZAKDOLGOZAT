import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SpeechRecognizerService} from "../services/speech-recognizer.service";
import {SpeechSynthesizerService} from "../services/speech-synthesizer.service";
import {LanguageService} from "../services/language.service";
import {merge, Observable} from "rxjs";
import {map, tap} from "rxjs/operators";
import {SpeechEvent} from "../model/speech-event";
import {SpeechNotification} from "../model/speech-notification";
import * as regex from '../model/regex.json';
import * as text from '../model/text.json';
import * as helpText from '../model/help.json';
import {VoiceoverService} from "../services/voiceover.service";
@Component({
  selector: 'app-helper',
  templateUrl: './helper.component.html',
  styleUrl: './helper.component.scss'
})
export class HelperComponent implements OnInit, OnDestroy{
  currentLanguage='';
  transcript$?: Observable<string>;
  listening$?: Observable<boolean>;
  regexData: any;
  textData: any;
  helpTextData: any;
  loadedText: any;
  loadedHelpText: any;
  constructor(public dialogRef: MatDialogRef<HelperComponent>,
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
    this.helpTextData= helpText;
    this.loadedHelpText = this.helpTextData[this.currentLanguage];
    this.loadedText = this.textData[this.currentLanguage];
    this.speechrecognition.initialize(this.currentLanguage);
    this.initRecognition();
    this.speechrecognition.start();
    this.languageService.getLanguage().subscribe(language => {
      this.currentLanguage = language;
      setTimeout(() => {
        this.speechSynthesizer.speak(
          this.loadedHelpText.howtoplay +
          '        ' +
          this.loadedHelpText.thisis +
          '        ' +
          this.loadedHelpText.speechinputs +
          '        ' +
          this.loadedHelpText.mainpage +
          '        ' +
          this.loadedHelpText.game +
          '        ' +
          this.loadedHelpText.settings +
          '        ' +
          this.loadedHelpText.ranglist +
          '        ' +
          this.loadedHelpText.help +
          '        ' +
          this.loadedHelpText.selectcard +
          '        ' +
          this.loadedHelpText.timeleft +
          '        ' +
          this.loadedHelpText.points +
          '        ' +
          this.loadedHelpText.savesettings +
          '        ' +
          this.loadedHelpText.return, this.currentLanguage
        )
      })
    })
  }

  ngOnDestroy(): void {
    this.speechSynthesizer.stop();
  }

  submit() {
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
    let regexHome= new RegExp(languagePatterns.home);
    let testHome = regexHome.test(message);
    if(testHome){
      this.submit();
    }
  }
}
