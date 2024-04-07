import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrl: './time.component.scss'
})
export class TimeComponent {
  constructor(private router: Router, public dialogRef: MatDialogRef<TimeComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  submit() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/settings']);
      this.dialogRef.close();
    });
  }
}
