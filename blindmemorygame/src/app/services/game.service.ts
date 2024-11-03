import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private timerSource = new BehaviorSubject<number>(90);
  currentTimer = this.timerSource.asObservable();
  time: number = 120;

  row: number =3;
  col: number = 4;

  private pointsSource = new BehaviorSubject<number>(0);
  currentPoints = this.pointsSource.asObservable();

  changeTimer(timer: number) {
    this.timerSource.next(timer);
  }

  changePoints(points: number) {
    this.pointsSource.next(points);
  }

  getTime(){
    return this.time;
  }
  setTime(time: number){
    this.time=time;
  }

  getRows(){
    return this.row;
  }
  getCols(){
    return this.col;
  }

  setTableSize(row: number, col: number){
    this.row=row;
    this.col=col;
  }

  singlePlayer?: boolean | undefined = true;

  get isSinglePlayer(): boolean | undefined {
    return this.singlePlayer;
  }

  set isSinglePlayer(value: boolean | undefined) {
    this.singlePlayer = value;
  }
}
