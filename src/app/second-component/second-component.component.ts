import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';// import Jquery here

export interface Tile {
    color: string;
    cols: number;
    rows: number;
    text: string;
    content: string;
  }

@Component({
  selector: 'app-second-component',
  templateUrl: './second-component.component.html',
  styleUrls: ['./second-component.component.css']
})/*
export class SecondComponentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

}*/
export class SecondComponentComponent {
  title = 'Meet our Team!';
  tiles: Tile[] = [
      {text: 'Anjali', cols: 2, rows: 2, color: 'lightblue', content: 'SCAM'},
      {text: 'Avyakta', cols: 2, rows: 2, color: 'lightgreen', content: 'SCAM'},
      {text: 'Ipsit', cols: 2, rows: 2, color: 'lightpink', content: 'SCAM'},
      {text: 'Nayan', cols: 2, rows: 2, color: '#DDBDF1', content: 'SCAM'},
  ];
}