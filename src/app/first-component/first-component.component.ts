import { Component, OnInit} from '@angular/core';
import { GridCoords } from './GridCoords';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
// import * as $ from "jQuery";
import {FormControl, Validators} from '@angular/forms';
import { MatSliderChange } from '@angular/material/slider';
import { newArray } from '@angular/compiler/src/util';
import { Astar } from './Astar' ;
import {BFS} from './BFS';
import {utils } from './utils';
import {hGrid, vGrid, totalGrid} from './constants'
interface DropDownSelect {
  value: string;
  viewValue: string;
}

interface Car {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-first-component',
  templateUrl: './first-component.component.html',
  styleUrls: ['./first-component.component.css']
})

export class FirstComponentComponent implements OnInit {
  constructor() {
  } 
  height = screen.availHeight;
  width =screen.availWidth;
  gridCord: GridCoords[] = new Array(totalGrid);
  mouseDown : boolean = false;
  toFill:boolean = true;
  color :number = 2; //0 red 1 green 2 other
  i :number = 0;
  start :number = 0;
  end :number = 0;
  steps :number = 0;
  time :string = "0";
  length : number = 0;

  ngOnInit() {
    for (let i = 0; i < vGrid; i++) {
      for (let j = 0; j < hGrid; j++) {
        this.gridCord[hGrid * i + j] = {x: i * 30, y: j * 30, obstacle: 0};
      }
    }
  }

  fillGrey(a: number, b: number,r: number): void {
    //console.log(a,b,r);  
    let element = document.getElementsByTagName('rect')[Math.floor(a/30)*hGrid+Math.floor(b/30)];
    if(this.mouseDown == true && !(element.style.fill == "green" || element.style.fill == "red" )){
      element.style.fill = "grey";
      this.gridCord[Math.floor(a/30)*hGrid+Math.floor(b/30)].obstacle = 1;
      var shade = (this.choose/100).toString();
      element.style.fillOpacity = shade;
      //console.log(this.gridCord[Math.floor(a/6)+Math.floor(b/30)].x);
    }
  }

  fillColor (a :number , b:number, r: number): void{
    //console.log('toggle');    
    let element = document.getElementsByTagName('rect')[Math.floor(a/30)*hGrid+Math.floor(b/30)];

    if(element.style.fill == "green"){  //clicked color is green
      //console.log('green');
      element.style.fill = "white";
      this.toFill = true;
      this.color = 0;
    }else if (element.style.fill == "red") {//clicked color is red
      //console.log('red');
      element.style.fill = "white";
      this.toFill = true;
      this.color = 1;
    }else{      //clicked color is white or grey
      //console.log ('white or grey');

        if(this.i == 0){      // prev click color red
          this.gridCord[Math.floor(a/30)*hGrid+Math.floor(b/30)].obstacle = 0;
          element.style.fill = "green";
          this.start = Math.floor(a/30)*hGrid+Math.floor(b/30);
          this.i++;
        }else if (this.i == 1) {// prev click color green
          element.style.fill = "red";
          this.end = Math.floor(a/30)*hGrid+Math.floor(b/30);
          this.i++;          
        }else{    // fill red green or grey
          if(this.color == 0){  
            element.style.fill = "green";
            this.start = Math.floor(a/30)*hGrid+Math.floor(b/30);
            this.gridCord[Math.floor(a/30)*hGrid+Math.floor(b/30)].obstacle = 0;
            this.color = 2;
          }else if(this.color == 1){
            element.style.fill = "red";
            this.end = Math.floor(a/30)*hGrid+Math.floor(b/30);
            this.color  = 2;            
          }else{    // toggle grey
            if(element.style.fill == "grey"){
              this.gridCord[Math.floor(a/30)*hGrid+Math.floor(b/30)].obstacle = 0;
              element.style.fill = "white";
            }else{
            element.style.fill = "grey";
            var shade = (this.choose/100).toString();
            element.style.fillOpacity = shade;
            //console.log(element.style.fillOpacity);
            this.gridCord[Math.floor(a/30)*hGrid+Math.floor(b/30)].obstacle = 1;
            //console.log(this.gridCord[Math.floor(a/6)+Math.floor(b/30)].obstacle);
          }
        }
      }
      
    }
  }


  mouseUp (a :number , b:number, r: number): void{
   this.mouseDown = false;
  }
  mouseDownE (a :number , b:number, r: number): void{
    this.mouseDown = true;
  }

  //start q-learning search
  rl_reset(): void{
    for (let i = 0; i < vGrid; i++) {
      for (let j = 0; j < hGrid; j++) {
        this.gridCord[hGrid * i + j].obstacle = 0;
        // this.gridCord[hGrid * i + j].h = null;
        // this.gridCord[hGrid * i + j].f = null;
        // this.gridCord[hGrid * i + j].g = null;
        
        let element = document.getElementsByTagName('rect')[hGrid * i + j];
        element.style.fill = "white";
      }
    }
    this.i=0;
    this.color=2;
     this.start = null;
     this.end = null;
     // this.req_step = 0;
  }


  // Slider for Obstacle
  max = 100;
  min = 0;
  step = 1;
  thumbLabel = false;
  choose = 100;
  vertical = false;
  tickInterval = 1;
  allowDiag:boolean = false;
  onChange(event: MatSliderChange){
      console.log("This is emitted as the thumb slides");
      console.log(event.value);
      this.choose = event.value;
    }
  onSearchChange(searchValue: number): void {  
    console.log(searchValue);
    this.choose = searchValue;
  }

  selectedValue: string;
  selectedCar: string;

  Algorithms: DropDownSelect[] = [
    {value: 'bfs', viewValue: 'Breadth First Search'},
    {value: 'palanadhinka', viewValue: 'xyz'},
    {value: 'Astar', viewValue: 'A*'}
  ];

  cars: Car[] = [
    {value: 'volvo', viewValue: 'Volvo'},
    {value: 'saab', viewValue: 'Saab'},
    {value: 'mercedes', viewValue: 'Mercedes'}
  ];

  clearWall() : void{
   for (var u = totalGrid - 1; u >= 0; u--) {
      this.gridCord[u].obstacle =0
      let element = document.getElementsByTagName('rect')[u];
      if (element.style.fill != "red" && element.style.fill != "green"){
        element.style.fill = "white";
      } 
    }
    // this.req_step = 0;
  }
  // req_step :number = 0;
  // inc_step(){
  //   this.req_step ++;
  //   this.Search();
  //   // let element = document.getElementsByTagName('rect')[u];
  // }
  Search(){
    let astar:Astar = new Astar();
    let bfs :BFS = new BFS();

    switch (this.selectedValue) {
      case "bfs":
        bfs.search(this.gridCord,this.start,this.end,this.allowDiag);
        this.steps = bfs.steps;
        this.length = bfs.length1;
        this.time = bfs.time;
        break;
      case "Astar":
        // astar.search(this.gridCord, this.start,this.end,this.allowDiag,this.req_step);
        astar.search(this.gridCord, this.start,this.end,this.allowDiag);

        this.steps = astar.steps;
        this.length = astar.length1;
        this.time = astar.time;
        break;
      default:
        alert("Select Algorithms");
        break;
    }
  }
}
