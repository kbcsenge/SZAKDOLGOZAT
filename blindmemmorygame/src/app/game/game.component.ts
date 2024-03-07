import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  constructor(private router: Router) {
  }
  gotohome(){
    this.router.navigate(['/']);
  }
}
