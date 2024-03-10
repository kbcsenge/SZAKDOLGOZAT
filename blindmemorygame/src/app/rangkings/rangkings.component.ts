import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-rangkings',
  standalone: true,
  imports: [],
  templateUrl: './rangkings.component.html',
  styleUrl: './rangkings.component.scss'
})
export class RangkingsComponent {
  constructor(private router: Router) {
  }
  gotohome(){
    this.router.navigate(['/']);
  }
}
