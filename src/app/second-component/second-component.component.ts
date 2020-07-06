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

      {text: 'Anjali', cols: 2, rows: 2, color: 'linear-gradient( #ffd48f,#fa9600)', 
     content: `I'm Anjali Yadav, second-year undergrad, Electrical Engineering, IIT Bombay.
      I find game theory and related fields really fascinating. I'm into fine-arts and designing and enjoy watching sitcoms.
      Reading (especially psychological stuff) is something I have started liking recently.`,
      photoId: 'https://drive.google.com/thumbnail?id=1mcHXapKVgjpvWn_zfq7I6Da-bgATSh5r',
      email:'',git:''},

      {text: 'Avyakta', cols: 2, rows: 2, color: 'linear-gradient( #f19f84,#eb7f52)', 
      content: `Hey There! I am Avyakta from Electrical Engineering Department of IIT-Bombay.`,
      photoId:'https://drive.google.com/thumbnail?id=1WUdk_GejPk76rPJSU_mEbZp38CDUxYxF',
      email:"mailto:avyaktawrat@gmail.com",git:"https://www.github.com/avyaktawrat"},

      {text: 'Ipsit', cols: 2, rows: 2, color: 'linear-gradient( #84bcf1,#5299eb)', 
      content: 'Howdy! I am Ipsit from Electrical Engineering Department of IIT Bombay. Nice that you are seeing our project :P',photoId:'https://lh3.googleusercontent.com/NND5r4lbj99m2X-_qwvwFteUsV3cNCcLAchYyC9Z_kVP_AFWNIIAGJKBYPqCMq8RUisUR2IKJVowIsUYr_dUmsaJjFzU0NRf2xtaOjsvTthI9d0TDNgSFDvlR7V5a2PDSsnaHP3lVcmKGJ4VPOo4vEuSYAKDw72q9Yqbe1jzI41qbo-MTEyJdDpUmAh6Ois-7Evc1y9RV5n-XbMtN_QrzdTjL4zdLCXWrpqGJCm-y8wUbCyqhP3xMYJDuffMb_UOAyyPm1CGfd1A1vxw_qPdwAAoYHlR7mYXv7KYwweau2cffQ-z_XyPbiTk6wMksywqqOf7yZFSkrOHuOSX8uYsgLQNSC3efZidAXrVTvKuFa3Gn_lp1zVnOMQBsBhcLl1gAvHgTzV2yhixuqJ2XEFo4SaEtyoRobAuOiUYc3oQcQWwRd4nrWUZCiZsSLb391vrSu4KfWNvxFEaXPRd6RNiXfL90t330ZwD9IpBQs5_SmwUiWTUCeJ9790TPgBBu_63iTXqQNGJpsqrx74sWi3gaQ0IxEN_sKfMOothXTvijXHh0Q52GrxYhOACLEkZMmNkuGPoqp9Z_r4akJqnp4Z_xJL95v7yQI33l9H06uwwrZHyLbkLfushiu9hICH8vDQq4kE6ud_cCgKiSULzdq5zsf-DD-pKsMcGGL3JSw2PuIJtd4T0ZkKchT3D6Paq=w258-h229-no?authuser=0',email:'mmkipsit@gmail.com',git:'https://github.com/Ipsit1234'},

     {text: 'Nayan', cols: 2, rows: 2, color: 'linear-gradient( #84c9f1,#52abeb)', 
     content: 'Hey There! I am Nayan from Electrical Engineering Department of IIT-Bombay.',
      photoId:'https://drive.google.com/thumbnail?id=1-D26ZbQlj8eYTEHLCEEU_Ng5dTy4yLeV',
      email:"mailto:nbarhate151@gmail.com",git:"https://www.github.com/nayan0037"},
  ];
}
