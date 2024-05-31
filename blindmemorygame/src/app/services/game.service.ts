import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private timerSource = new BehaviorSubject<number>(90);
  currentTimer = this.timerSource.asObservable();

  private pointsSource = new BehaviorSubject<number>(0);
  currentPoints = this.pointsSource.asObservable();

  changeTimer(timer: number) {
    this.timerSource.next(timer);
  }

  changePoints(points: number) {
    this.pointsSource.next(points);
  }

  singlePlayer?: boolean | undefined = true;

  get isSinglePlayer(): boolean | undefined {
    return this.singlePlayer;
  }

  set isSinglePlayer(value: boolean | undefined) {
    this.singlePlayer = value;
  }
}
