import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {GameComponent} from "./game/game.component";
import {SettingsComponent} from "./settings/settings.component";
import {RangkingsComponent} from "./rangkings/rangkings.component";
import {SuccessComponent} from "./game/success/success.component";
import {RetryComponent} from "./game/retry/retry.component";


export const routes: Routes = [
  { path: 'game', component: GameComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'rankings', component: RangkingsComponent },
  { path : 'success' , component: SuccessComponent},
  { path : 'fail' , component: RetryComponent},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule{}
