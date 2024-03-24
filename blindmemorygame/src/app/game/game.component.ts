import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NgFor} from "@angular/common";


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [NgFor],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})

export class GameComponent implements OnInit, OnDestroy{

  cardUrl: string[] = [
    "./assets/cards/ball.png",
    "./assets/cards/candy.png",
    "./assets/cards/car.png",
    "./assets/cards/cat.png",
    "./assets/cards/cloud.png",
    "./assets/cards/dog.png",
    "./assets/cards/flow.png",
    "./assets/cards/rose.png",
    "./assets/cards/sun.png",
    "./assets/cards/umb.png"
  ];

  rows: string[][] = [];
  flipped: boolean[][]=[];
  selectedCards: {row: number, col: number}[] = [];
  points: number = 0;
  gameOver: boolean= false;
  timer: number = 90;
  matches: number= 0;
  intervalId: NodeJS.Timeout | null=null;

  constructor(private router: Router) { }

  ngOnInit() {
    this.randomizeCards();
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
    this.shuffle(this.cardUrl);
    let cards = this.cardUrl.slice(0, 6);
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
    if(this.gameOver){
      return;
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
        }, 300);
      } else {
        this.matches++;
        this.points+=50;
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
}
