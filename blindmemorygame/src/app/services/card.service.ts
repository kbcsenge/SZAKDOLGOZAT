import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Injectable({
  providedIn: 'root'
})
export class CardService {
  constructor(private afs : AngularFirestore, private storage: AngularFireStorage) { }

  getImage(imageUrl: string){
    return this.storage.ref(imageUrl).getDownloadURL()
  }

}
