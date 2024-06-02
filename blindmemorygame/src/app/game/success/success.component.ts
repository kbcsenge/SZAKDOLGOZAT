import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {GameService} from "../../services/game.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {map, tap} from "rxjs/operators";
import {merge, Observable} from "rxjs";
import {SpeechEvent} from "../../model/speech-event";
import {SpeechNotification} from "../../model/speech-notification";
import {LanguageService} from "../../services/language.service";
import {SpeechRecognizerService} from "../../services/speech-recognizer.service";

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss'
})
export class SuccessComponent implements OnInit{
  currentLanguage='';
  transcript$?: Observable<string>;
  listening$?: Observable<boolean>;
  points?: number;
  timer?: number;
  name?: string ='';
  constructor(private router: Router,
              private firestore: AngularFirestore,
              private gameService: GameService,
              public dialogRef: MatDialogRef<SuccessComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private languageService: LanguageService,
              private speechrecognition: SpeechRecognizerService,) {
    this.languageService.getLanguage().subscribe(language => {
      this.currentLanguage=language;
    });
  }

  submit(name: string | undefined) {
    const date = new Date();
    this.firestore.collection('rankings').add({
      name: name,
      points: this.points,
      time: this.timer,
      date: date
    });
    this.dialogRef.close();
    this.router.navigate(['/rankings']);
  }

  gotohome(){
    this.router.navigate(['/home']);
    this.dialogRef.close();
  }
  retrygame() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/game']);
      this.dialogRef.close();
    });
  }

  ngOnInit(): void {
    this.gameService.currentTimer.subscribe(timer => this.timer = timer);
    this.gameService.currentPoints.subscribe(points => this.points = points);
    this.speechrecognition.initialize(this.currentLanguage);
    this.initRecognition();
    this.speechrecognition.start();
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
      const message = notification.content?.trim() || '';
      let regexGame = new RegExp('.*játék.*')
      let regexHome = new RegExp('.*főoldal.*')
      let regexSubmit = new RegExp('.*rendben.*')
      let regexRetryname = new RegExp('.*újra.*')
      let testGame = regexGame.test(message);
      let testHome = regexHome.test(message);
      let testSubmit = regexSubmit.test(message);
      let testRetryname = regexRetryname.test(message);
      if(testGame){
        this.retrygame();
      }
      if(testHome){
        this.gotohome();
      }
      if(testSubmit){
        this.submit(this.name)
      }
      if(testRetryname){
        this.name='';
      }
      if(!testHome && !testGame && !testSubmit && !testRetryname){
        this.name=message;
      }
    }
  }
}
