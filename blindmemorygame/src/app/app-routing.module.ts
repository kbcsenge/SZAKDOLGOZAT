import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GameComponent} from "./game/game.component";
import {SettingsComponent} from "./settings/settings.component";
import {SuccessComponent} from "./game/success/success.component";
import {RetryComponent} from "./game/retry/retry.component";
import {RankingsComponent} from "./rangkings/rankings.component";
import {HomepageComponent} from "./homepage/homepage.component";

export const routes: Routes = [
  { path: 'game', component: GameComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'rankings', component: RankingsComponent },
  { path : 'success' , component: SuccessComponent},
  { path : 'fail' , component: RetryComponent},
  { path : '' , component: HomepageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
