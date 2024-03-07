import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {GameComponent} from "../game/game.component";

@Component({
  selector: 'app-homepage',
  standalone: true,
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {

  constructor(private router: Router) {
  }
  gotogame(){
    this.router.navigate(['/game']);
  }

  gotosettings(){
    this.router.navigate(['/settings']);
  }

  gotohome(){
    this.router.navigate(['/']);
  }
}
