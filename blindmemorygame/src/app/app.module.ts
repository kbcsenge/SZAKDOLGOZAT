import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BoardSizeComponent } from './settings/boardsize/board-size.component';
import { TimeComponent } from './settings/time/time.component';
import { NumberOfPlayersComponent } from './settings/numberofplayers/number-of-players.component';
import { VolumeAndSpeedComponent } from './settings/volumeandspeed/volume-and-speed.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import {CommonModule} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSelectModule} from "@angular/material/select";
import {MatListModule} from "@angular/material/list";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatDialogModule} from "@angular/material/dialog";
import { SetLanguageComponent } from './setlanguage/set-language.component';
import { HelperComponent } from './helper/helper.component';
import { MultiPlayerComponent } from './twoplayergame/multi-player.component';
import {HttpClientModule} from "@angular/common/http";
import { MultiPlayerSuccessComponent } from './twoplayergame/success/multi-player-success.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardSizeComponent,
    TimeComponent,
    NumberOfPlayersComponent,
    VolumeAndSpeedComponent,
    SetLanguageComponent,
    HelperComponent,
    MultiPlayerComponent,
    MultiPlayerSuccessComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MatSlideToggleModule,
    MatSliderModule,
    CommonModule,
    MatInputModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatToolbarModule,
    MatSelectModule,
    MatListModule,
    MatSidenavModule,
    MatDialogModule,
    MatFormFieldModule,
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})

export const appConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyAmG6OBYutI7XQuykvBsB2nv_aPmg1iu5g",
    authDomain: "blindmemorygame-b8efa.firebaseapp.com",
    projectId: "blindmemorygame-b8efa",
    storageBucket: "blindmemorygame-b8efa.appspot.com",
    messagingSenderId: "479063867538",
    appId: "1:479063867538:web:25bea1e14516756fa2264b",
    })),
    provideFirestore(() => getFirestore()),
  ]
};

export class AppModule { 
  firestore = inject(Firestore);

  items$ = collectionData(
    collection(this.firestore, 'items')
  );
}
