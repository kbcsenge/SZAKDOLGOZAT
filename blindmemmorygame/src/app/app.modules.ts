import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {BrowserModule} from "@angular/platform-browser";
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDnve51xQ0a7GLLMdhsAv0i-6Y1oJj_Mcg",
  authDomain: "blindmemorygame.firebaseapp.com",
  projectId: "blindmemorygame",
  storageBucket: "blindmemorygame.appspot.com",
  messagingSenderId: "731678078423",
  appId: "1:731678078423:web:347c1f461b85942de60792",
  measurementId: "G-TSKYRTN645"
};
@NgModule({
  declarations:[
    AppComponent
  ],
  imports:[
    BrowserModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ],
  providers:[],
  bootstrap: [AppComponent]
})
export class AppModules{}
