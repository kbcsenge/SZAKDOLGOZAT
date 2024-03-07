import { Routes } from '@angular/router';
import { HomepageComponent } from "./homepage/homepage.component";
import { GameComponent } from "./game/game.component";
import { SettingsComponent } from "./settings/settings.component";

export const routes: Routes = [
  { path : 'game' , component: GameComponent},
  { path : 'settings' , component: SettingsComponent},
  { path : '' , component: HomepageComponent}
];
