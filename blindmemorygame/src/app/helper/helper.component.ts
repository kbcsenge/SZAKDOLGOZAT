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
  loadedText: any;
  constructor(public dialogRef: MatDialogRef<HelperComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private speechrecognition: SpeechRecognizerService,
              private speechSynthesizer: SpeechSynthesizerService,
              private languageService: LanguageService) {
    this.languageService.getLanguage().subscribe(language => {
      this.currentLanguage=language;
    });
  }
  ngOnInit(): void {
    this.speechSynthesizer.speak(
      'Hogyan kell használni a játékot?'+
      '        ' +
      'Ez egy memóriajáték vakok-és látássérültek, illetve színtévesztőknek. A játékot hangvezérléssel lehet irányítani, mely beszédszintézissel segíti a felhasználót a tájékozódásban. Sikeres játék esetén felkerülhetsz a ranglistára.' +
      '        ' +
      'A weboldalt és a játékot a következő parancsokkal lehet irányítani:' +
      '        ' +
      'Főoldalra navigálás: legyen benne a mondatban a főoldal szó.' +
      '        ' +
      'Játékra navigálás: legyen benne a mondatban a játék szó.' +
      '        ' +
      'Beállításokra navigálás: legyen benne a mondatban a beállítás szó.' +
      '        ' +
      'Ranglistára navigálás: legyen benne a mondatban a ranglista szó.' +
      '        ' +
      'Segítség ablakra navigálás: legyen benne a mondatban a segítség szó.' +
      '        ' +
      'A játékban a lapokat sor oszlop páros kimondásával lehet felfordítani( például az első sor első oszlopában lévő lap felfordításához mondd azt hogy első első).' +
      '        ' +
      'A játék hátralévő ideje lekérdezhető a "mennyi idő van hátra" kérdéssel.' +
      '        ' +
      'Aktuális pontok lekérdezéséhez legyen benne a mondatban a pont szó.' +
      '        ' +
      'A beállítások mentésénél legyen benne a mondatban a mentés szó.', this.currentLanguage
    );
    this.speechrecognition.initialize(this.currentLanguage);
    this.initRecognition();
    this.speechrecognition.start();
    this.regexData = regex;
    this.textData= text;
    this.loadedText = this.textData[this.currentLanguage];
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
    let regexHome= new RegExp(languagePatterns.home, 'i');
    let testHome = regexHome.test(message);
    if(testHome){
      this.submit();
    }
  }
}
