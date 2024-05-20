import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AsyncPipe, NgFor} from "@angular/common";
import {forkJoin, merge, Observable, take} from "rxjs";
import {CardService} from "../services/card.service";
import {cardpictures} from "./cardurls/cardurls";
import {GameService} from "../services/game.service";
import {RetryComponent} from "./retry/retry.component";
import {MatDialog} from "@angular/material/dialog";
import {SuccessComponent} from "./success/success.component";
import {map, tap} from "rxjs/operators";
import {SpeechEvent} from "../model/speech-event";
import {SpeechNotification} from "../model/speech-notification";
import {SpeechRecognizerService} from "../services/speech-recognizer.service";
import {SpeechSynthesizerService} from "../services/speech-synthesizer.service";
import {LanguageService} from "../services/language.service";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [NgFor, AsyncPipe],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit, OnDestroy, AfterViewInit{
  currentLanguage='';
  flipping?: string;
  rows: string[][] = [];
  flipped: boolean[][]=[];
  selectedCards: {row: number, col: number}[] = [];
  points: number = 0;
  gameOver: boolean= false;
  timer: number = 90;
  pastTime: number=0;
  matches: number= 0;
  intervalId: NodeJS.Timeout | null=null;
  cards: string[]=[]
  transcript$?: Observable<string>;
  listening$?: Observable<boolean>;
  numbersInWords : {[key: string]: number} = {
    első: 1,
    második: 2,
    harmadik: 3,
    negyedik: 4
  };

   constructor(private cardservice: CardService,
               private gameService: GameService,
               private router: Router, public dialog: MatDialog,
               private speechrecognition: SpeechRecognizerService,
               private speechSynthesizer: SpeechSynthesizerService,
               private languageService: LanguageService) {
     this.languageService.getLanguage().subscribe(language => {
       this.currentLanguage=language;
     });
   }

  ngOnInit() {
      this.setUpCards();
      this.speechrecognition.initialize(this.currentLanguage);
      this.initRecognition();
      this.speechrecognition.start()
  }

  ngOnDestroy(){
    this.stopTimer();
    this.speechSynthesizer.stop();
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
    let cards = (this.cards).slice(0, 6);
    cards = cards.concat(cards);
    this.shuffle(cards);
    this.rows = [];
    this.flipped = [];
    for (let i = 0; i < 3; i++) {
      this.rows.push(cards.slice(i * 4, (i + 1) * 4));
      this.flipped.push(new Array(4).fill(false));
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
          'nem talált', this.currentLanguage
        );
        setTimeout(() => {
          this.flipped[this.selectedCards[0].row][this.selectedCards[0].col] = false;
          this.flipped[this.selectedCards[1].row][this.selectedCards[1].col] = false;
          this.selectedCards = [];
        }, 800);
      } else {
        this.speechSynthesizer.speak(
          'párt találtál', this.currentLanguage
        );
        this.matches++;
        this.points+=50;
        this.gameService.changePoints(this.points);
        this.selectedCards = [];
        if(this.matches==6){
          this.success();
        }
      }
    }
  }
  startTimer(){
    if (!this.gameOver) {
      this.intervalId = setInterval(() => {
        this.timer--;
        this.pastTime++;
        this.gameService.changeTimer(this.pastTime);
        if (this.timer === 0) {
          this.gameOver = true;
          this.stopTimer();
          clearInterval(this.intervalId!);
          this.retryDialog();
        }
      }, 1000);
    }
  }
  stopTimer() {
    if(this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  success(): void {
    this.stopTimer();
    this.gameOver = true;
    this.successDialog();
  }

  gotohome() {
    this.router.navigate(['/home']);
  }
  setUpCards(){
    this.cardservice.getImage('cards/flip.png').subscribe(data=>{
      this.flipping=data
    })
    const imageObservables = cardpictures.map(card => this.cardservice.getImage(card));
    forkJoin(imageObservables).subscribe(images => {
      this.cards = images;
      this.randomizeCards();
    }, error => {
      console.error('Error loading images', error);
    });
  }
  retryDialog(): void {
    this.speechSynthesizer.speak(
      'Nem sikerült az összes párt megtalálni!', this.currentLanguage
    );
    const dialogRef = this.dialog.open(RetryComponent);

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      console.log('The dialog was closed');
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
    if (notification.event === SpeechEvent.FinalContent) {
      const message = notification.content?.trim() || '';
      let regexHome = new RegExp('.*főoldalra.*')
      let testHome = regexHome.test(message);
      let regexPonit = new RegExp('.*pont.*')
      let testPoint = regexPonit.test(message);
      let regexSelectCard = new RegExp('^([a-záéíóöőúüű]+) ([a-záéíóöőúüű]+)$');
      let testGame = regexSelectCard.exec(message)
      if(testHome){
        this.gotohome();
      }
      if(message=='mennyi idő van hátra'){
        this.speechSynthesizer.speak(
          this.timer.toString()+'másodperc van hátra', this.currentLanguage
        );
      }
      if(testPoint){
        this.speechSynthesizer.speak(
          this.points.toString()+"pontod van", this.currentLanguage
        );
      }
      if (testGame) {
        let row = this.numbersInWords[testGame[1]] - 1;
        let col = this.numbersInWords[testGame[2]] - 1;
        this.selectCard(row, col);
      }
    }
  }

  sayCard(cardname: string){
     console.log(this.currentLanguage)
     if(cardname.includes('cat.png')){
       this.speechSynthesizer.speak(
         'cica', this.currentLanguage
       );
     }
    if(cardname.includes('ball.png')){
      this.speechSynthesizer.speak(
        'labda', this.currentLanguage
      );
    }
    if(cardname.includes('candy.png')){
      this.speechSynthesizer.speak(
        'cukorka', this.currentLanguage
      );
    }
    if(cardname.includes('car.png')){
      this.speechSynthesizer.speak(
        'autó', this.currentLanguage
      );
    }
    if(cardname.includes('cloud.png')){
      this.speechSynthesizer.speak(
        'felhő', this.currentLanguage
      );
    }
    if(cardname.includes('dog.png')){
      this.speechSynthesizer.speak(
        'kutya', this.currentLanguage
      );
    }
    if(cardname.includes('flow.png')){
      this.speechSynthesizer.speak(
        'narancsárga virág', this.currentLanguage
      );
    }
    if(cardname.includes('rose.png')){
      this.speechSynthesizer.speak(
        'rózsa', this.currentLanguage
      );
    }
    if(cardname.includes('sun.png')){
      this.speechSynthesizer.speak(
        'nap', this.currentLanguage
      );
    }
    if(cardname.includes('umb.png')){
      this.speechSynthesizer.speak(
        'esernyő', this.currentLanguage
      );
    }
  }

  ngAfterViewInit(): void {
    this.speechSynthesizer.speak(
      'Játék megnyitva. Ez egy 3-szor 4-es játéktábla. Rendelkezésre álló idő: 90 másodperc. Sok sikert!', this.currentLanguage,
      () => {
        this.startTimer();
      }
    );
  }
}
