import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AsyncPipe, NgFor} from "@angular/common";
import {forkJoin} from "rxjs";
import {CardService} from "../services/card.service";
import {cardpictures} from "./cardurls/cardurls";
import {GameService} from "../services/game.service";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [NgFor, AsyncPipe],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})

export class GameComponent implements OnInit, OnDestroy{

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

   constructor(private cardservice: CardService,private gameService: GameService, private router: Router) {
   }

  ngOnInit() {
    this.setUpCards();
    this.startTimer();
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
    if (this.selectedCards.length === 2) {
      const card1 = this.rows[this.selectedCards[0].row][this.selectedCards[0].col];
      const card2 = this.rows[this.selectedCards[1].row][this.selectedCards[1].col];
      if (card1 !== card2) {
        setTimeout(() => {
          this.flipped[this.selectedCards[0].row][this.selectedCards[0].col] = false;
          this.flipped[this.selectedCards[1].row][this.selectedCards[1].col] = false;
          this.selectedCards = [];
        }, 800);
      } else {
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
          this.router.navigate(['/fail']);
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
    this.router.navigate(['/success']);
  }

  gotohome() {
    this.router.navigate(['/']);
  }
  ngOnDestroy(){
    this.stopTimer();
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
}




