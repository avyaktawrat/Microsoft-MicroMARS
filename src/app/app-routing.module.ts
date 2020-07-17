import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { SecondComponent } from './second/second.component';
import { FirstComponent } from './first/first.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { from } from 'rxjs';


const routes: Routes = [
  { path: '', component: WelcomePageComponent, data:{animation: 'TutPage'}},
  { path: 'home', component: FirstComponent, data: {animation: 'PlaygroundPage'} },
  { path: 'my-team', component: SecondComponent, data: {animation: 'TeamPage'} }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
