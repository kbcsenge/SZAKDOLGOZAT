import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, merge, Observable, take} from "rxjs";
import {CardService} from "../services/card.service";
import {GameService} from "../services/game.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {SpeechRecognizerService} from "../services/speech-recognizer.service";
import {SpeechSynthesizerService} from "../services/speech-synthesizer.service";
import {LanguageService} from "../services/language.service";
import {cardpictures} from "../game/cardurls/cardurls";
import {SuccessComponent} from "../game/success/success.component";
import {map, tap} from "rxjs/operators";
import {SpeechEvent} from "../model/speech-event";
import {SpeechNotification} from "../model/speech-notification";
import {VoiceoverService} from "../services/voiceover.service";
import * as regex from '../model/regex.json';
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
  numbersInWords : {[key: string]: number} = {
    first: 1,
    second: 2,
    third: 3,
    fourth: 4,
    fifth: 5,
  };
  regexData: any = regex;

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
    this.maxPairs();
  }

  ngOnInit() {
    this.setUpCards();
    this.speechrecognition.initialize(this.currentLanguage);
    this.initRecognition();
    this.speechrecognition.start()
  }

  ngOnDestroy(){
    this.speechSynthesizer.stop();
  }

  maxPairs(){
    if(this.row==3 && this.col==4){
      this.maxpairs=6;
      this.size="3 by 4";
      this.showsize="3x4"
    }
    if(this.row==4 && this.col==4){
      this.maxpairs=8;
      this.size="4 by 4";
      this.showsize="4x4"
    }
    if(this.row==4 && this.col==5){
      this.maxpairs=10;
      this.size="4 by 5"
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
    console.log(this.rows[row][col])
    this.sayCard(this.rows[row][col]);
    if (this.selectedCards.length === 2) {
      const card1 = this.rows[this.selectedCards[0].row][this.selectedCards[0].col];
      const card2 = this.rows[this.selectedCards[1].row][this.selectedCards[1].col];
      if (card1 !== card2) {
        this.speechSynthesizer.speak(
          'not matching', this.currentLanguage
        );
        setTimeout(() => {
          this.flipped[this.selectedCards[0].row][this.selectedCards[0].col] = false;
          this.flipped[this.selectedCards[1].row][this.selectedCards[1].col] = false;
          this.selectedCards = [];
        }, 800);
      } else {
        this.speechSynthesizer.speak(
          'you found a pair', this.currentLanguage
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
    const dialogRef = this.dialog.open(SuccessComponent);

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
  private processNotification(notification: SpeechNotification<string>): void {
      const languagePatterns = this.regexData[this.currentLanguage];
      const message = notification.content?.trim() || '';
      let regexHome = new RegExp(languagePatterns.home, 'i');
      let testHome = regexHome.test(message);
      let regexSelectCard = new RegExp(languagePatterns.selectCard, 'i');
      let testGame = regexSelectCard.exec(message)
      if(testHome){
        this.gotohome();
      }
      if (testGame) {
        let row = this.numbersInWords[testGame[1]] - 1;
        let col = this.numbersInWords[testGame[2]] - 1;
        this.selectCard(row, col);
      }
  }

  sayCard(cardname: string){
    console.log(this.currentLanguage)
    if(cardname.includes('cat.png')){
      this.speechSynthesizer.speak(
        'cat', this.currentLanguage
      );
    }
    if(cardname.includes('ball.png')){
      this.speechSynthesizer.speak(
        'ball', this.currentLanguage
      );
    }
    if(cardname.includes('candy.png')){
      this.speechSynthesizer.speak(
        'candy', this.currentLanguage
      );
    }
    if(cardname.includes('car.png')){
      this.speechSynthesizer.speak(
        'car', this.currentLanguage
      );
    }
    if(cardname.includes('cloud.png')){
      this.speechSynthesizer.speak(
        'cloud', this.currentLanguage
      );
    }
    if(cardname.includes('dog.png')){
      this.speechSynthesizer.speak(
        'dog', this.currentLanguage
      );
    }
    if(cardname.includes('flow.png')){
      this.speechSynthesizer.speak(
        'flower', this.currentLanguage
      );
    }
    if(cardname.includes('rose.png')){
      this.speechSynthesizer.speak(
        'rose', this.currentLanguage
      );
    }
    if(cardname.includes('sun.png')){
      this.speechSynthesizer.speak(
        'sun', this.currentLanguage
      );
    }
    if(cardname.includes('umb.png')){
      this.speechSynthesizer.speak(
        'umbrella', this.currentLanguage
      );
    }
  }

  ngAfterViewInit(): void {
    this.speechSynthesizer.speak(
      'Játék megnyitva. Ez egy '+this.size+' játéktábla.', this.currentLanguage,
    );
  }
}