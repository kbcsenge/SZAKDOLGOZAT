import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GameComponent} from "./game/game.component";
import {SettingsComponent} from "./settings/settings.component";
import {SuccessComponent} from "./game/success/success.component";
import {RetryComponent} from "./game/retry/retry.component";
import {RankingsComponent} from "./rangkings/rankings.component";
import {HomepageComponent} from "./homepage/homepage.component";
import {SetlanguageComponent} from "./setlanguage/setlanguage.component";
import {MultiplayerComponent} from "./twoplayergame/multiplayer.component";
import {AuthGuard} from "./Authguard";


export const routes: Routes = [
  { path: 'game', component: GameComponent, canActivate: [AuthGuard]},
  { path: 'multiplayer', component: MultiplayerComponent, canActivate: [AuthGuard]},
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
  { path: 'rankings', component: RankingsComponent, canActivate: [AuthGuard]},
  { path : 'success' , component: SuccessComponent, canActivate: [AuthGuard]},
  { path : 'fail' , component: RetryComponent, canActivate: [AuthGuard]},
  { path : 'home' , component: HomepageComponent,  canActivate: [AuthGuard]},
  { path : '' , component: SetlanguageComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
