import {Component, Inject} from '@angular/core';
import {Router} from "@angular/router";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {map, tap} from "rxjs/operators";
import {merge, Observable} from "rxjs";
import {SpeechEvent} from "../../model/speech-event";
import {SpeechNotification} from "../../model/speech-notification";
import {SpeechRecognizerService} from "../../services/speech-recognizer.service";
import {LanguageService} from "../../services/language.service";
import {VoiceoverService} from "../../services/voiceover.service";
import {SpeechSynthesizerService} from "../../services/speech-synthesizer.service";
import * as regex from '../../model/regex.json';
import * as text from '../../model/text.json';
import * as spokentext from '../../model/spokentext.json';
@Component({
  selector: 'app-retry',
  standalone: true,
  imports: [],
  templateUrl: './retry.component.html',
  styleUrl: './retry.component.scss'
})
export class RetryComponent {
  currentLanguage='';
  transcript$?: Observable<string>;
  listening$?: Observable<boolean>;
  regexData: any;
  textData: any;
  loadedText: any;
  spokenTextData: any
  spokenText: any
  constructor(private router: Router,
              public dialogRef: MatDialogRef<RetryComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private speechrecognition: SpeechRecognizerService,
              private languageService: LanguageService,
              public voiceoverService: VoiceoverService,
              public speechSynthesizer: SpeechSynthesizerService) {
    this.languageService.getLanguage().subscribe(language => {
      this.currentLanguage=language;
    });
  }

  ngOnInit(): void {
    this.regexData = regex;
    this.textData= text;
    this.spokenTextData= spokentext;
    this.loadedText = this.textData[this.currentLanguage];
    this.spokenText = this.spokenTextData[this.currentLanguage];
    this.speechrecognition.initialize(this.currentLanguage);
    this.initRecognition();
    this.speechrecognition.start();
  }
  retrygame() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/game']);
      this.dialogRef.close();
    });
  }

  gotohome(){
    this.router.navigate(['/home']);
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

    let regexGame = new RegExp(languagePatterns.game, 'i');
    let regexHome =new RegExp(languagePatterns.home, 'i');
    let testGame = regexGame.test(message);
    let testHome = regexHome.test(message);
    if(testGame){
      this.retrygame();
    }
    if(testHome){
      this.gotohome();
    }
  }
}
