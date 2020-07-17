import { slideInAnimation } from './animations';
import { Component } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { RouterOutlet } from '@angular/router';

interface links{
  view: string;
  router: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    slideInAnimation
    // animation triggers go here
  ]
})
export class AppComponent {
  title = 'MicroMARS';
  links:links [] = [{view:'First',router:'/'}, 
  {view:'PlayGround',router:'/home'},{view:'Our Team',router:'/my-team'}];
  activeLink = this.links[0];
  background: ThemePalette;
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

}
