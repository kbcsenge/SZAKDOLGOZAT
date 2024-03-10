import { Routes } from '@angular/router';
import { HomepageComponent } from "./homepage/homepage.component";
import { GameComponent } from "./game/game.component";
import { SettingsComponent } from "./settings/settings.component";
import {RangkingsComponent} from "./rangkings/rangkings.component";

export const routes: Routes = [
  { path : 'game' , component: GameComponent},
  { path : 'settings' , component: SettingsComponent},
  { path : 'rankings' , component: RangkingsComponent},
  { path : '' , component: HomepageComponent}
];
