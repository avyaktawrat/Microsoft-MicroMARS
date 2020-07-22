import { IntroComponent } from './intro/intro.component';
import { TeamComponent } from './team/team.component';
import { PlaygroundComponent } from './playground/playground.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', component: IntroComponent, data:{animation: 'TutPage'}},
  { path: 'home', component: PlaygroundComponent, data: {animation: 'PlaygroundPage'} },
  { path: 'my-team', component: TeamComponent, data: {animation: 'TeamPage'} }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
