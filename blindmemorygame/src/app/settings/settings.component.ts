import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  constructor(private router: Router) {
  }
  gotohome(){
    this.router.navigate(['/']);
  }
}


