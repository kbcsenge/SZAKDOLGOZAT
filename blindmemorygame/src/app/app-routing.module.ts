import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {GameComponent} from "./game/game.component";
import {SettingsComponent} from "./settings/settings.component";


export const routes: Routes = [
  { path: 'game', component: GameComponent },
  { path: 'settings', component: SettingsComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule{}
