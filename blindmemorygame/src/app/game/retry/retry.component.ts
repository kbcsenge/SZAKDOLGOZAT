import {Component, Inject} from '@angular/core';
import {Router} from "@angular/router";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-retry',
  standalone: true,
  imports: [],
  templateUrl: './retry.component.html',
  styleUrl: './retry.component.scss'
})
export class RetryComponent {
  constructor(private router: Router, public dialogRef: MatDialogRef<RetryComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  retrygame() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/game']);
      this.dialogRef.close();
    });
  }

  gotohome(){
    this.router.navigate(['/']);
    this.dialogRef.close();
  }
}
