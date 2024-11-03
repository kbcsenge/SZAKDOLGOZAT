import {Component, Inject} from '@angular/core';
import {VoiceoverService} from "../../services/voiceover.service";
import {map, tap} from "rxjs/operators";
import {merge, Observable} from "rxjs";
import {SpeechEvent} from "../../model/speech-event";
import {SpeechNotification} from "../../model/speech-notification";
import * as regex from '../../model/regex.json';
import * as text from '../../model/text.json';
import * as spokentext from '../../model/spokentext.json';
import {Router} from "@angular/router";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SpeechRecognizerService} from "../../services/speech-recognizer.service";
import {LanguageService} from "../../services/language.service";
import {SpeechSynthesizerService} from "../../services/speech-synthesizer.service";
@Component({
  selector: 'app-multiplayersuccess',
  templateUrl: './multiplayersuccess.component.html',
  styleUrl: './multiplayersuccess.component.scss'
})
export class MultiplayersuccessComponent {
  currentLanguage='';
  transcript$?: Observable<string>;
  listening$?: Observable<boolean>;
  regexData: any;
  textData: any;
  loadedText: any;
  spokenTextData: any
  spokenText: any
  constructor(private router: Router,
              public dialogRef: MatDialogRef<MultiplayersuccessComponent>,
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
      this.router.navigate(['/multiplayer']);
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
    if (notification.event === SpeechEvent.FinalContent) {
      const languagePatterns = this.regexData[this.currentLanguage];
      const message = notification.content?.trim() || '';
      let regexGame = new RegExp(languagePatterns.game);
      let regexHome = new RegExp(languagePatterns.home);
      let testGame = regexGame.test(message);
      let testHome = regexHome.test(message);
      if (testGame) {
        this.retrygame();
      }
      if (testHome) {
        this.gotohome();
      }
    }
  }
}
