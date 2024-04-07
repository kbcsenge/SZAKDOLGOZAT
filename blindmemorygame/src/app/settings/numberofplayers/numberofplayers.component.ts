import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-numberofplayers',
  templateUrl: './numberofplayers.component.html',
  styleUrl: './numberofplayers.component.scss'
})
export class NumberofplayersComponent {
  constructor(private router: Router, public dialogRef: MatDialogRef<NumberofplayersComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  submit() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/settings']);
      this.dialogRef.close();
    });
  }
}
