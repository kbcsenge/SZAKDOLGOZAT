import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, merge, Observable} from "rxjs";
import {CardService} from "../services/card.service";
import {GameService} from "../services/game.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {SpeechRecognizerService} from "../services/speech-recognizer.service";
import {SpeechSynthesizerService} from "../services/speech-synthesizer.service";
import {LanguageService} from "../services/language.service";
import {cardpictures} from "../game/cardurls/cardurls";
import {map, tap} from "rxjs/operators";
import {SpeechEvent} from "../model/speech-event";
import {SpeechNotification} from "../model/speech-notification";
import {VoiceoverService} from "../services/voiceover.service";
import * as regex from '../model/regex.json';
import * as text from "../model/text.json";
import * as spokentext from "../model/spokentext.json";
import {MultiplayersuccessComponent} from "./success/multiplayersuccess.component";
@Component({
  selector: 'app-twoplayergame',
  templateUrl: './multiplayer.component.html',
  styleUrl: './multiplayer.component.scss'
})
export class MultiplayerComponent implements OnInit, AfterViewInit, OnDestroy{
  currentLanguage='';
  flipping?: string;
  rows: string[][] = [];
  row: number= 3;
  col: number= 4;
  size: string=""
  showsize: string=""
  flipped: boolean[][]=[];
  selectedCards: {row: number, col: number}[] = [];
  gameOver: boolean= false;
  matches: number= 0;
  Amatches: number= 0;
  Bmatches: number= 0;
  currentPlayer: 'A' | 'B' = 'A';
  cards: string[]=[];
  maxpairs: number = 6;
  transcript$?: Observable<string>;
  listening$?: Observable<boolean>;
  numbersInWords : any;
  regexData: any = regex;
  textData: any;
  loadedText: any;
  spokenTextData: any;
  spokenText: any;
  successText: any;
  constructor(private cardservice: CardService,
              private gameservice: GameService,
              private router: Router, public dialog: MatDialog,
              private speechrecognition: SpeechRecognizerService,
              public speechSynthesizer: SpeechSynthesizerService,
              private languageService: LanguageService,
              public voiceoverService: VoiceoverService) {
    this.languageService.getLanguage().subscribe(language => {
      this.currentLanguage=language;
    });
    this.row=this.gameservice.getRows();
    this.col=this.gameservice.getCols();
  }

  ngOnInit() {
    this.regexData = regex;
    this.textData= text;
    this.spokenTextData = spokentext;
    this.loadedText = this.textData[this.currentLanguage];
    this.spokenText = this.spokenTextData[this.currentLanguage];
    this.setUpCards();
    this.speechrecognition.initialize(this.currentLanguage);
    this.initRecognition();
    this.speechrecognition.start();
    this.maxPairs();
  }

  ngOnDestroy(){
    this.speechSynthesizer.stop();
  }

  maxPairs(){
    if(this.row==3 && this.col==4){
      this.maxpairs=6;
      this.size=this.spokenText.threebyfour;
      this.showsize="3x4"
    }
    if(this.row==4 && this.col==4){
      this.maxpairs=8;
      this.size=this.spokenText.fourbyfour;
      this.showsize="4x4"
    }
    if(this.row==4 && this.col==5){
      this.maxpairs=10;
      this.size=this.spokenText.fourbyfive;
      this.showsize="4x5";
    }
  }
  shuffle(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  randomizeCards() {
    this.shuffle(this.cards);
    let cards = (this.cards).slice(0, this.maxpairs);
    cards = cards.concat(cards);
    this.shuffle(cards);
    this.rows = [];
    this.flipped = [];
    for (let i = 0; i < this.row; i++) {
      this.rows.push(cards.slice(i * this.col, (i + 1) * this.col));
      this.flipped.push(new Array(this.col).fill(false));
    }
  }

  selectCard(row: number, col: number) {
    if(this.gameOver || (this.selectedCards.length === 1 && this.selectedCards[0].row === row && this.selectedCards[0].col === col || this.flipped[row][col] || this.selectedCards.length === 2)){
      return
    }
    this.flipped[row][col] = true;
    this.selectedCards.push({row, col});
    this.sayCard(this.rows[row][col]);
    if (this.selectedCards.length === 2) {
      const card1 = this.rows[this.selectedCards[0].row][this.selectedCards[0].col];
      const card2 = this.rows[this.selectedCards[1].row][this.selectedCards[1].col];
      if (card1 !== card2) {
        if(this.currentPlayer === 'A'){
          this.currentPlayer = 'B';
        } else if(this.currentPlayer === 'B'){
          this.currentPlayer = 'A';
        }
        this.speechSynthesizer.speak(
          this.spokenText.notmatching + " " + this.currentPlayer + this.spokenText.playerturns,
          this.currentLanguage
        );
        setTimeout(() => {
          this.flipped[this.selectedCards[0].row][this.selectedCards[0].col] = false;
          this.flipped[this.selectedCards[1].row][this.selectedCards[1].col] = false;
          this.selectedCards = [];
        }, 800);
      } else {
        this.speechSynthesizer.speak(
          this.spokenText.foundpair, this.currentLanguage
        );

        if(this.currentPlayer === 'A') {
          this.Amatches++;
        } else {
          this.Bmatches++;
        }
        this.selectedCards = [];
        if(this.Amatches + this.Bmatches == this.maxpairs){
          this.success();
        }
      }
    }
  }

  success(): void {
    this.gameOver = true;
    this.successDialog();
  }

  gotohome() {
    this.router.navigate(['/home']);
  }
  setUpCards(){
    this.cardservice.getImage('cards/flip.png').subscribe(regex=>{
      this.flipping=regex
    })
    const imageObservables = cardpictures.map(card => this.cardservice.getImage(card));
    forkJoin(imageObservables).subscribe(images => {
      this.cards = images;
      this.randomizeCards();
    }, error => {
      console.error('Error loading images', error);
    });
  }

  successDialog(): void{
    if(this.Amatches===this.Bmatches){
      this.successText= this.spokenText.drawn;
    }else{
      this.successText=this.currentPlayer + this.spokenText.playerwon
    }
    this.speechSynthesizer.speak(
      this.successText, this.currentLanguage
    );
    const dialogRef = this.dialog.open(MultiplayersuccessComponent, {
      data: { successText: this.successText }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
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
  private processNotification(notification: SpeechNotification<string>):void {
    if (notification.event === SpeechEvent.FinalContent) {
      const message = notification.content?.trim() || '';
      const languagePatterns = this.regexData[this.currentLanguage];
      this.numbersInWords = {
        [languagePatterns.first]: 1,
        [languagePatterns.second]: 2,
        [languagePatterns.third]: 3,
        [languagePatterns.fourth]: 4,
        [languagePatterns.fifth]: 5
      };
      let regexHome = new RegExp(languagePatterns.home);
      let regexSelectCard = new RegExp(languagePatterns.selectCard);
      let testHome = regexHome.test(message);
      let testGame = regexSelectCard.exec(message);

      if (testHome) {
        this.gotohome();
      }

      if (testGame) {
        let row = this.numbersInWords[testGame[1]] - 1;
        let col = this.numbersInWords[testGame[2]] - 1;
        if(!isNaN(col) && !isNaN(row)){
          this.selectCard(row, col);
        }
      }
    }
  }

  sayCard(cardname: string){
    if(cardname.includes('cat.png')){
      this.speechSynthesizer.speak(
        this.spokenText.cat, this.currentLanguage
      );
    }
    if(cardname.includes('ball.png')){
      this.speechSynthesizer.speak(
        this.spokenText.ball, this.currentLanguage
      );
    }
    if(cardname.includes('candy.png')){
      this.speechSynthesizer.speak(
        this.spokenText.candy, this.currentLanguage
      );
    }
    if(cardname.includes('car.png')){
      this.speechSynthesizer.speak(
        this.spokenText.car, this.currentLanguage
      );
    }
    if(cardname.includes('cloud.png')){
      this.speechSynthesizer.speak(
        this.spokenText.cloud, this.currentLanguage
      );
    }
    if(cardname.includes('dog.png')){
      this.speechSynthesizer.speak(
        this.spokenText.dog, this.currentLanguage
      );
    }
    if(cardname.includes('flow.png')){
      this.speechSynthesizer.speak(
        this.spokenText.flower, this.currentLanguage
      );
    }
    if(cardname.includes('rose.png')){
      this.speechSynthesizer.speak(
        this.spokenText.rose, this.currentLanguage
      );
    }
    if(cardname.includes('sun.png')){
      this.speechSynthesizer.speak(
        this.spokenText.sun, this.currentLanguage
      );
    }
    if(cardname.includes('umb.png')){
      this.speechSynthesizer.speak(
        this.spokenText.umb, this.currentLanguage
      );
    }
  }

  ngAfterViewInit(): void {
    this.speechSynthesizer.speak(
      this.spokenText.gamestarted+" "+ this.spokenText.itsa+" " +this.size+" " +this.spokenText.gameboard, this.currentLanguage,
    );
  }
}
