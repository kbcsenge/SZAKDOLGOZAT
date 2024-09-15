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
import * as spokentext from "../../model/spokentext.json";
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
  spokenTextData: any;
  spokenText: any;
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
    this.regexData = regex;
    this.textData= text;
    this.spokenTextData = spokentext;
    this.loadedText = this.textData[this.currentLanguage];
    this.spokenText = this.spokenTextData[this.currentLanguage];
    this.speechSynthesizer.speak(
      this.spokenText.numberofplayersopened, this.currentLanguage
    );
    this.speechrecognition.initialize(this.currentLanguage);
    this.initRecognition();
    this.speechrecognition.start();
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
    if (notification.event === SpeechEvent.FinalContent) {
      const languagePatterns = this.regexData[this.currentLanguage];
      const message = notification.content?.trim() || '';
      let regexSinglePlayer = new RegExp(languagePatterns.sigleplayer);
      let regexMultiPlayer = new RegExp(languagePatterns.multiplayer);
      let regexSubmit = new RegExp(languagePatterns.submit);
      let testSinglePlayer = regexSinglePlayer.test(message);
      let testMultiPlayer = regexMultiPlayer.test(message);
      let testSubmit = regexSubmit.test(message);

      if (testSinglePlayer) {
        if (this.toggleOne) {
          this.toggleOne.checked = true;
        }
        if (this.toggleTwo) {
          this.toggleTwo.checked = false;
        }
      } else if (testMultiPlayer) {
        if (this.toggleOne) {
          this.toggleOne.checked = false;
        }
        if (this.toggleTwo) {
          this.toggleTwo.checked = true;
        }
      }

      if (testSubmit) {
        this.submit();
      }
    }
  }
}
