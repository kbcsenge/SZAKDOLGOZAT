import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";
import {Ranking} from "../model/Ranking";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-rangkings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rangkings.component.html',
  styleUrl: './rangkings.component.scss'
})
export class RankingsComponent implements OnInit{
  rankings: Observable<Ranking[]>;
  constructor(private router: Router, private firestore: AngularFirestore) {
    this.rankings = firestore.collection<Ranking>('rankings').valueChanges();
  }
  gotohome(){
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.rankings.subscribe(data => console.log(data));
  }
}
