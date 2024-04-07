import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-boardsize',
  templateUrl: './boardsize.component.html',
  styleUrl: './boardsize.component.scss'
})
export class BoardsizeComponent {
  constructor(private router: Router, public dialogRef: MatDialogRef<BoardsizeComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  submit() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/settings']);
      this.dialogRef.close();
    });
  }
}
