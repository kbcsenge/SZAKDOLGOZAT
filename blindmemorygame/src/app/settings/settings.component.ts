import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {Router} from "@angular/router";
import { BoardsizeComponent } from './boardsize/boardsize.component';
import { LanguageComponent } from './language/language.component';
import { NumberofplayersComponent } from './numberofplayers/numberofplayers.component';
import { TimeComponent } from './time/time.component';
import { VolumeandspeedComponent } from './volumeandspeed/volumeandspeed.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  constructor(private router: Router,public dialog: MatDialog) {
  }
  gotohome(){
    this.router.navigate(['/']);
  }
  langueageDialog(): void{
    const dialogRef = this.dialog.open(LanguageComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  vandsDialog(): void{
    const dialogRef = this.dialog.open(VolumeandspeedComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  nofpDialog(): void{
    const dialogRef = this.dialog.open(NumberofplayersComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  boardsizeDialog(): void{
    const dialogRef = this.dialog.open(BoardsizeComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  timeDialog(): void{
    const dialogRef = this.dialog.open(TimeComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}


