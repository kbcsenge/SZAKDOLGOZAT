import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private firstVisit = true;

  constructor(private router: Router) {}

  canActivate(): boolean {
    if (this.firstVisit) {
      this.firstVisit = false;
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
