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
import { VolumeandspeedComponent } from './settings/volumeandspeed/volumeandspeed.component';
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
import { SetlanguageComponent } from './setlanguage/setlanguage.component';
import { HelperComponent } from './helper/helper.component';
import { MultiplayerComponent } from './twoplayergame/multiplayer.component';
import {HttpClientModule} from "@angular/common/http";
import { MultiplayersuccessComponent } from './twoplayergame/success/multiplayersuccess.component';


@NgModule({
  declarations: [
    AppComponent,
    BoardsizeComponent,
    TimeComponent,
    NumberofplayersComponent,
    VolumeandspeedComponent,
    SetlanguageComponent,
    HelperComponent,
    MultiplayerComponent,
    MultiplayersuccessComponent
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
