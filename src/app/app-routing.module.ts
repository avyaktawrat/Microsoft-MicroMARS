import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { SecondComponentComponent } from './second-component/second-component.component';
import { FirstComponentComponent } from './first-component/first-component.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { from } from 'rxjs';


const routes: Routes = [
  { path: '', component: WelcomePageComponent},
  { path: 'home', component: FirstComponentComponent},
  { path: 'my-team', component: SecondComponentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
