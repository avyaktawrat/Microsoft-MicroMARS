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

  hGrid: number = Math.floor((this.height - 200) / 30);
  vGrid: number = Math.floor((this.width - 300) / 30);
  totalGrid: number = this.hGrid * this.vGrid;
  gridCord: GridCoords[] = new Array(this.totalGrid);
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

  // Slider for Obstacle
  max = 100;
  min = 0;
  step = 1;
  thumbLabel = false;
  choose = 100;
  vertical = false;
  tickInterval = 1;
  allowDiag = false;

  selectedValue: string;
  selectedCar: string;

  Algorithms: DropDownSelect[] = [
    {value: 'bfs', viewValue: 'Breadth First Search'},
    {value: 'palanadhinka', viewValue: 'xyz'},
    {value: 'Astar', viewValue: 'A*'},
    {value: 'Dijkstra', viewValue: 'Dijkstra'}
  ];

  cars: Car[] = [
    {value: 'volvo', viewValue: 'Volvo'},
    {value: 'saab', viewValue: 'Saab'},
    {value: 'mercedes', viewValue: 'Mercedes'}
  ];

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
                                        isEndPoint : false};

      }
    }
  }

  fillGrey(a: number, b: number): void {
    const coord: number = Math.floor(a / 30) * hGrid + Math.floor(b / 30);
    if (coord !== this.start && coord !== this.end && this.mouseDown === true){
      const height = this.choose;
      this.gridCord[coord].isTerrain = true;
      this.gridCord[coord].value = height;
      this.updateUI();
    }
  }

  fillColor(a: number , b: number): void{
    const coord: number = Math.floor(a / 30) * hGrid + Math.floor(b / 30);
    const rect: GridCoords = this.gridCord[coord];

    if (coord === this.start){
      this.start = null;
      rect.isEndPoint = false;
    }else if (coord === this.end){
      this.end = null;
      rect.isEndPoint = false;
    }else if (rect.isTerrain){
      rect.isTerrain = false;
      rect.value = 0;
    }else{
      if (this.start == null){
        this.start = coord;
        rect.isEndPoint = true;
      }else if (this.end == null){
        this.end = coord;
        rect.isEndPoint = true;
      }else if (!rect.isTerrain ){
        rect.isTerrain = true;
        rect.value = this.choose;
      }
    }
    this.updateUI();
  }

  mouseUp(a: number , b: number): void{
   this.mouseDown = false;
  }
  mouseDownE(a: number , b: number): void{
    this.mouseDown = true;
  }

  reset(): void{
    for (let i = 0; i < vGrid; i++) {
      for (let j = 0; j < hGrid; j++) {
        this.gridCord[hGrid * i + j] = {x: i * 30,
                                        y: j * 30,
                                        isPath: false,
                                        isTerrain: false,
                                        f: null, g: null, h: null,
                                        parent: null,
                                        value : 0,
                                        isEndPoint : false};

      }
    }

    this.start = null;
    this.end = null;
    this.updateUI();
     // this.req_step = 0;
  }

  clearPath(): void{
    for (let u = this.totalGrid - 1; u >= 0; u--) {
      this.gridCord[u].isPath = false;
    }
    this.updateUI();
  }

  clearWall(): void{
   for (let u = this.totalGrid - 1; u >= 0; u--) {
     this.gridCord[u].isTerrain = false;
    }
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
    for (let u = this.totalGrid - 1; u >= 0; u--) {
      const rect: GridCoords = this.gridCord[u];
      const element = document.getElementsByTagName('rect')[u];
      if (rect.isPath && !rect.isTerrain){
        element.style.fill = 'orange';
        element.style.fillOpacity = '1';
      }
      else if (rect.isPath && rect.isTerrain){
        element.style.fill = 'red';
        element.style.fillOpacity = (rect.value / 125 + 0.2).toString();
      }
      else if (rect.isTerrain){
        element.style.fill = 'grey';
        element.style.fillOpacity = (rect.value / 125 + 0.2).toString();
      }
      else if (u === this.start && rect.isEndPoint){
        element.style.fill = 'green';
        element.style.fillOpacity = '1';
      }
      else if (u === this.end && rect.isEndPoint){
        element.style.fill = 'red';
        element.style.fillOpacity = '1';
      }
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
    const bfs: BFS = new BFS();
    const dij: Dijkstra = new Dijkstra();

    if ( this.start == null || this.end == null){
      alert('Insert start and end');
    }
    switch (this.selectedValue) {
      case 'bfs':
        bfs.search(this.gridCord, this.start, this.end, this.allowDiag);
        this.steps = bfs.steps;
        this.length = bfs.length1;
        this.time = bfs.time;
        break;
      case 'Astar':
        // astar.search(this.gridCord, this.start,this.end,this.allowDiag,this.req_step);
        astar.search(this.gridCord, this.start, this.end, this.allowDiag);

        this.steps = astar.steps;
        this.length = astar.length1;
        this.time = astar.time;
        break;
      case 'Dijkstra':
        this.adjList = get_adjacency_list(this.vGrid, this.hGrid, this.allowDiag);
        dij.search(this.start, this.end, this.adjList, this.gridCord);
        this.time = dij.time;
        this.steps = dij.steps;
        this.length = dij.length;
        break;
      default:
        alert('Select Algorithms');
        break;
    }
  }
}
