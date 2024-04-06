import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-retry',
  standalone: true,
  imports: [],
  templateUrl: './retry.component.html',
  styleUrl: './retry.component.scss'
})
export class RetryComponent {
  constructor(private router: Router) {
  }
  retrygame() {
    this.router.navigate(['/game']);
  }

  gotohome(){
    this.router.navigate(['/']);
  }
}
