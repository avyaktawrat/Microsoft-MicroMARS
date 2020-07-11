import { Component, OnInit} from '@angular/core';
import { GridCoords } from './GridCoords';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
// import * as $ from "jQuery";
import {FormControl, Validators} from '@angular/forms';
import { MatSliderChange } from '@angular/material/slider';
import { newArray } from '@angular/compiler/src/util';

import { Pair, get_adjacency_list } from './adj';
import { Dijkstra } from './dijkstra';


import { Astar } from './Astar' ;
import {BFS} from './BFS';
import {BiBFS} from './BiBFS';

import {utils } from './utils';
import {hGrid, vGrid, totalGrid} from './constants';

const Utils: utils = new utils();
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
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.css']
})

export class FirstComponent implements OnInit {
  constructor() {
  }
  height = screen.availHeight;
  width = screen.availWidth;

  // height = window.innerHeight;
  // width = screen.width;

  gridCord: GridCoords[] = new Array(totalGrid);
  adjList: Array<Array<Pair>>;
  mouseDown = false;
  toFill = true;
  color = 2; // 0 red 1 green 2 other
  i = 0;
  start = null;
  end = null;
  steps = 0;
  time = '0';
  length = 0;

  terrain : boolean = true;
  cov_x :number = 2;
  cov_y : number = 2;
  showPath: boolean = false;
  // Slider for Obstacle
  max = 100;
  min = 0;
  step = 1;
  thumbLabel = false;
  choose = 100;
  vertical = false;
  tickInterval = 1;
  allowDiag = false;

  selectedValue: string = 'bfs';
  selectedPS: string = 'PS_1';

  Algorithms: DropDownSelect[] = [
    {value: 'bfs', viewValue: 'Breadth First Search'},
    {value: 'Astar', viewValue: 'A*'},
    {value: 'Dijkstra', viewValue: 'Dijkstra'}
  ];

  Problem_statement: DropDownSelect[] = [
    {value: 'PS_1', viewValue: 'One way trip'},
    {value: 'PS_2', viewValue: 'Intermediate Stops'},
    {value: 'PS_3', viewValue: 'Multiple Destinations'}
  ];

  // Gaussian Distribution in terrain

  isGaussian: boolean = false;
  isTerrain = false;
  isPref: boolean = false;
  selectedDest: number = 2;

  ngOnInit() {
    for (let i = 0; i < vGrid; i++) {
      for (let j = 0; j < hGrid; j++) {
        this.gridCord[hGrid * i + j] = {x: i * 30,
                                        y: j * 30,
                                        isPath: false,
                                        isTerrain: false,
                                        f: null, g: null, h: null,
                                        parent: null,
                                        value : 0,
                                        isEndPoint : false,
                                        visited: false,
                                        open : false
                                        /*debug : false*/};

      }
    }
  }

  fillGrey(a: number, b: number): void {
    let coord :number = Math.floor(a/30)*hGrid+Math.floor(b/30);
    if(coord != this.start && coord != this.end && this.mouseDown == true){
      let height = this.choose;
      if(!this.isGaussian){
        this.gridCord[coord].isTerrain = true;
        this.gridCord[coord].value = height;
        this.updateUI();
      }else{
        this.gaussianFill(coord);
        this.updateUI();
      }
    }
  }

  gaussianFill (coord : number):void{
    let height = this.choose;
    // console.log(this.gridCord);
      for (let i = -this.cov_x-3; i <= this.cov_x+3; i++) {
        for (let j = -this.cov_y-3; j <= this.cov_y+3; j++) {
          if(coord+i*hGrid+j >= 0 && coord+i*hGrid+j<totalGrid  &&i <= hGrid && j <= vGrid){
            this.gridCord[coord+i*hGrid+j].value += height * Math.exp(-1 * ((i*i*25)/(2*this.cov_x*this.cov_x) + (j*j*25)/(2*this.cov_y*this.cov_y) ) );
            this.gridCord[coord+i*hGrid+j].isTerrain = true;
            if(this.gridCord[coord+i*hGrid+j].value > 100){
              this.gridCord[coord+i*hGrid+j].value = 100;
            }
          }
        }
      }
  }

  fillColor (a :number , b:number): void{
    let coord :number = Math.floor(a/30)*hGrid+Math.floor(b/30);
    let rect :GridCoords = this.gridCord[coord];
    // console.log("hello");
    if (coord === this.start){
      this.start = null;
      rect.isEndPoint = false;
    }else if (coord === this.end){
      this.end = null;
      rect.isEndPoint = false;
    }else if (rect.isTerrain){
      if(!this.isTerrain){
        rect.isTerrain = false;
        rect.value = 0;
      }else{ 
        if(this.start == null){
          this.start = coord;
          rect.isEndPoint = true;
        }else if(this.end == null){
          this.end = coord;
          rect.isEndPoint = true;
        }
        else if(!this.isGaussian){  
          rect.isTerrain = true;
          rect.value = this.choose;
        }else{
          this.gaussianFill(coord);
        }
      }

    }else{//clicking on non (red green grey ) square
      if (this.start == null){
        this.start = coord;
        rect.isEndPoint = true;
      }else if (this.end == null){
        this.end = coord;
        rect.isEndPoint = true;
      }else if (!rect.isTerrain ){
        rect.isTerrain = true;
        if(!this.isGaussian){  
          rect.isTerrain = true;
          rect.value = this.choose;
        }else{
          this.gaussianFill(coord);
        }
    
      }
    }
    this.updateUI();    // console.log(rect);

  }

  mouseUp(a: number , b: number): void{
   this.mouseDown = false;
  }
  mouseDownE(a: number , b: number): void{
    this.mouseDown = true;
  }

  reset(): void{
    for (let u = totalGrid - 1; u >= 0; u--) {
      this.gridCord[u].f = null;
      this.gridCord[u].g = null;
      this.gridCord[u].h = null;
      this.gridCord[u].parent = null;
      this.gridCord[u].visited = false;
      this.gridCord[u].open = false;
      this.gridCord[u].isPath = false;
      this.gridCord[u].isTerrain = false; 
      this.gridCord[u].value = 0;          
    }

    this.start = null;
    this.end = null;
    this.updateUI();
     // this.req_step = 0;
  }

  clearPath(): void{
    for (let u = totalGrid - 1; u >= 0; u--) {
      this.gridCord[u].isPath = false;
      this.gridCord[u].visited = false;
      this.gridCord[u].open = false;
      this.gridCord[u].f = null;
      this.gridCord[u].g = null;
      this.gridCord[u].h = null;

    }
    this.updateUI();
  }

  clearWall(): void{
   for (let u = totalGrid - 1; u >= 0; u--) {
    this.gridCord[u].isTerrain = false; 
     this.gridCord[u].value = 0;
    }
   this.updateUI();
  }

  resetGridParams():void{
     for (let u = totalGrid - 1; u >= 0; u--) {
      this.gridCord[u].f = null;
      this.gridCord[u].g = null;
      this.gridCord[u].h = null;
      this.gridCord[u].parent = null;
      this.gridCord[u].visited = false;
      this.gridCord[u].open = false;

      // this.gridCord[u].debug = false;
     }
  }

  checkValue(event: any){
     this.updateUI();
  }

  onChange(event: MatSliderChange){
      console.log('This is emitted as the thumb slides');
      console.log(event.value);
      this.choose = event.value;
    }

  onSearchChange(searchValue: number): void {
    console.log(searchValue);
    this.choose = searchValue;
  }

  updateUI(): void{
    for (let u = totalGrid - 1; u >= 0; u--) {
      let rect :GridCoords = this.gridCord[u];
      let element = document.getElementsByTagName('rect')[u];
      if(rect.isPath && this.showPath){
        element.style.fill = "orange";
        element.style.fillOpacity = "1";
      }
     
      else if (u == this.start && rect.isEndPoint){
        element.style.fill = "green";
        element.style.fillOpacity = "1";
      }
      else if (u == this.end && rect.isEndPoint){
        element.style.fill = "red";
        element.style.fillOpacity = "1";
      }
      else if (rect.isTerrain){
        element.style.fill = "grey";
        element.style.fillOpacity = (rect.value/100).toString();
      }

      else if (rect.visited && !this.isTerrain){
        element.style.fill = "lightblue";
        element.style.fillOpacity = "1";
      }
      else if (rect.open && !this.isTerrain){
        element.style.fill = "lightgreen";
        element.style.fillOpacity = "1";
      }

      // else if (rect.debug){
      //   element.style.fill = "pink";
      // }
      
      else{
        element.style.fill = 'white';
        element.style.fillOpacity = '1';

      }
    }
  }

  // req_step :number = 0;
  // inc_step(){
  //   this.req_step ++;
  //   this.Search();
  //   // let element = document.getElementsByTagName('rect')[u];
  // }

  // dijk() {
  //   Utils.reset_color(this.gridCord, this.start, this.end);
  //   const p1 = performance.now();
  //   const adj = get_adjacency_list(this.vGrid, this.hGrid, this.allowDiag);
  //   console.log(adj);
  //   [this.steps, this.length] = dijkstra(this.start, this.end, adj);
  //   const p2 = performance.now();
  //   this.time = (p2 - p1).toFixed(3);
  // }



  Search(){
    const astar: Astar = new Astar();
    // const bfs: BFS = new BFS();
    const bibfs: BiBFS = new BiBFS();

    const dij: Dijkstra = new Dijkstra();
      this.clearPath();
      this.resetGridParams();
      if ( this.start == null || this.end == null){
        alert('Insert start and end');
      }
    switch (this.selectedValue) {
      case 'bfs':
        bibfs.search(this.gridCord, this.start, this.end, this.allowDiag);
        // this.steps = bfs.steps;
        // this.length = bfs.length1;
        // this.time = bfs.time;
        this.updateUI();
        break;
      case 'Astar':
        // astar.search(this.gridCord, this.start,this.end,this.allowDiag,this.req_step);
        astar.search(this.gridCord, this.start, this.end, this.allowDiag);

        this.steps = astar.steps;
        this.length = astar.length1;
        this.time = astar.time;
        this.updateUI();
        break;
      case 'Dijkstra':
        this.adjList = get_adjacency_list(vGrid, hGrid, this.allowDiag);
        dij.search(this.start, this.end, this.adjList, this.gridCord);
        this.time = dij.time;
        this.steps = dij.steps;
        this.length = dij.length;
        this.updateUI(); //uncomment this later
        break;
      default:
        alert('Select Algorithms');
        break;
    }
  }
}

