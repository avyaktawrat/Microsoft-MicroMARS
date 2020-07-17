import { Component, OnInit } from '@angular/core';


export interface Tile {
    color: string;
    cols: number;
    rows: number;
    text: string;
    content: string;
    photoId: string;
    email: string;
    git: string;
  }


@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  
  }
}