import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';// import Jquery here

import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

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
      {text: 'Anjali', cols: 2, rows: 2, color: ' linear-gradient( #ffd48f,#fa9600)', 
      content: 'Fill in your Description!', photoId: '',email:'',git:''},

      {text: 'Avyakta', cols: 2, rows: 2, color: 'linear-gradient( #e8ab8c,#fa4f00)', 
      content: `Hey There! I am Avyakta from Electrical Engineering Department of IIT-Bombay.`, 
      photoId:'https://drive.google.com/thumbnail?id=1WUdk_GejPk76rPJSU_mEbZp38CDUxYxF',
      email:"mailto:avyaktawrat@gmail.com",git:"https://www.github.com/avyaktawrat"},

      {text: 'Ipsit', cols: 2, rows: 2, color: 'linear-gradient( #84bcf1,#5299eb)', 
      content: 'Fill in your Description!',photoId:'m',email:'',git:''},

      {text: 'Nayan', cols: 2, rows: 2, color: 'linear-gradient( #8fadff,#0047fa)', 
      content: 'Hey There! I am Nayan from Electrical Engineering Department of IIT-Bombay.',
      photoId:'https://drive.google.com/thumbnail?id=1-D26ZbQlj8eYTEHLCEEU_Ng5dTy4yLeV',
      email:"mailto:nbarhate151@gmail.com",git:"https://www.github.com/nayan0037"},
  ];
}
