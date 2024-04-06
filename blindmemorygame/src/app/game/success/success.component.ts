import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss'
})
export class SuccessComponent {
  constructor(private router: Router) {
  }
  submit() {
    this.router.navigate(['/rankings']);
  }

  gotohome(){
    this.router.navigate(['/']);
  }
}
