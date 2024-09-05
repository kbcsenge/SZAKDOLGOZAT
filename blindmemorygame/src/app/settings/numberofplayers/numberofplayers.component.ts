import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {map, tap} from "rxjs/operators";
import {merge, Observable} from "rxjs";
import {SpeechEvent} from "../../model/speech-event";
import {SpeechNotification} from "../../model/speech-notification";
import {SpeechRecognizerService} from "../../services/speech-recognizer.service";
import {SpeechSynthesizerService} from "../../services/speech-synthesizer.service";
import {LanguageService} from "../../services/language.service";
import {Router} from "@angular/router";
import {GameService} from "../../services/game.service";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {VoiceoverService} from "../../services/voiceover.service";
import * as regex from '../../model/regex.json';
import * as text from '../../model/text.json';
@Component({
  selector: 'app-numberofplayers',
  templateUrl: './numberofplayers.component.html',
  styleUrl: './numberofplayers.component.scss'
})
export class NumberofplayersComponent implements OnInit, OnDestroy {
  @ViewChild('toggleOne') toggleOne?: MatSlideToggle;
  @ViewChild('toggleTwo') toggleTwo?: MatSlideToggle;
  currentLanguage='';
  transcript$?: Observable<string>;
  listening$?: Observable<boolean>;
  regexData: any;
  textData: any;
  loadedText: any;
  constructor(private router: Router,
              public dialogRef: MatDialogRef<NumberofplayersComponent>,
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
    this.speechSynthesizer.speak(
      'Number of players setting opened', this.currentLanguage
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
    this.gameservice.isSinglePlayer = this.toggleOne?.checked;
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
}
