import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../environments/environment";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BoardsizeComponent } from './settings/boardsize/boardsize.component';
import { TimeComponent } from './settings/time/time.component';
import { NumberofplayersComponent } from './settings/numberofplayers/numberofplayers.component';
import { LanguageComponent } from './settings/language/language.component';
import { VolumeandspeedComponent } from './settings/volumeandspeed/volumeandspeed.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardsizeComponent,
    TimeComponent,
    NumberofplayersComponent,
    LanguageComponent,
    VolumeandspeedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
