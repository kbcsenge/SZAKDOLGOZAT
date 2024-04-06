import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {GameService} from "../../services/game.service";

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss'
})
export class SuccessComponent implements OnInit{
  points?: number;
  timer?: number;
  constructor(private router: Router, private firestore: AngularFirestore, private gameService: GameService) {
  }

  submit(name: string) {
    const date = new Date();
    this.firestore.collection('rankings').add({
      name: name,
      points: this.points,
      time: this.timer,
      date: date
    });
    this.router.navigate(['/rankings']);
  }

  gotohome(){
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.gameService.currentTimer.subscribe(timer => this.timer = timer);
    this.gameService.currentPoints.subscribe(points => this.points = points);
  }
}
