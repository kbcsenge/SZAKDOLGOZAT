import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-volumeandspeed',
  templateUrl: './volumeandspeed.component.html',
  styleUrl: './volumeandspeed.component.scss'
})
export class VolumeandspeedComponent {
  constructor(private router: Router, public dialogRef: MatDialogRef<VolumeandspeedComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  submit() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/settings']);
      this.dialogRef.close();
    });
  }
}
