import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {map, tap} from "rxjs/operators";
import {merge, Observable} from "rxjs";
import {SpeechEvent} from "../../model/speech-event";
import {SpeechNotification} from "../../model/speech-notification";
import {defaultLanguage} from "../../model/languages";
import {SpeechRecognizerService} from "../../services/speech-recognizer.service";
import {SpeechSynthesizerService} from "../../services/speech-synthesizer.service";

@Component({
  selector: 'app-volumeandspeed',
  templateUrl: './volumeandspeed.component.html',
  styleUrl: './volumeandspeed.component.scss'
})
export class VolumeandspeedComponent implements OnInit, OnDestroy{
  transcript$?: Observable<string>;
  listening$?: Observable<boolean>;
  constructor(public dialogRef: MatDialogRef<VolumeandspeedComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private speechrecognition: SpeechRecognizerService,
              private speechSynthesizer: SpeechSynthesizerService) {
  }

  ngOnInit(): void {
    this.speechSynthesizer.speak(
      'Hangerő és lejátszási sebesség beállítása megnyitva', defaultLanguage
    );
    this.speechrecognition.initialize(defaultLanguage);
    this.initRecognition();
    this.speechrecognition.start()
  }
  ngOnDestroy() {
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
    if (notification.event === SpeechEvent.FinalContent) {
      const message = notification.content?.trim() || '';
      let regexSubmit= new RegExp('.*mentés.*')
      let testSubmit = regexSubmit.test(message);
      if(testSubmit){
        this.speechSynthesizer.speak(
          'Hangerő és lejátszási sebesség beállítása mentve', defaultLanguage
        );
        this.submit();
      }
    }
  }
}
