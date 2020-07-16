import { Component, OnInit } from '@angular/core';
import { GridCoords } from './GridCoords';
import { MatSliderChange } from '@angular/material/slider';

import { DPair, get_adjacency_list } from './Finders/adj';
import { Dijkstra } from './Finders/dijkstra';
import { BiDjk } from './Finders/BiDijkstra';

import { FloydWarshall } from './Finders/floydWarshall';
import { TravSalesMan } from './Finders/travSalesMan';

import { Astar } from './Finders/Astar' ;
import { BiAstar } from './Finders/BiAstar' ;

import {BFS} from './Finders/BFS';
import {BiBFS} from './Finders/BiBFS';

import { BestFirst } from './Finders/BestFirst'

import {utils } from './utils';
import {hGrid, vGrid, totalGrid} from './constants';

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

const Utils: utils = new utils();

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

interface DropDownSelect {
  value: string;
  viewValue: string;
}

interface lineCord {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit {

  constructor() { }
  height = screen.availHeight;
  width = screen.availWidth;

  gridCord: GridCoords[] = new Array(totalGrid);
  adjList: Array<Array<DPair>>;
  mouseDown = false;
  color = 2; // 0 red 1 green 2 other
  i = 0;
  start = null;
  end = null;
  steps = 0;
  time = '0';
  length = 0;
  lengthS = "0";

  path: number[] = new Array();
  pathCord: lineCord[] = new Array();

  terrain: boolean = true;
  showPath: boolean = true;
  // Slider for Obstacle
  max = 100;
  min = 0;
  step = 1;
  // thumbLabel = false;
  choose = 100;
  vertical = false;
  tickInterval = 1;  //check
  allowDiag = false;
  bidirection = false;
  bidirecNodeS:number = -1;  // variable to store node location where forward bidirec ends
  bidirecNodeE:number = -1;  // node where backward bidrec ends // used in tracing path
  notCrossCorner = false;

  selectedValue: string = 'bfs';
  selectedPS: string = 'PS_1';
  selectedMaze: string;
  selectedHeuristic: string = 'l1';
  selectedDest: number = 2;

  minDest =1;
  maxDest = 5;

  isGaussian: boolean = false;
  cov_x: number = 2;
  cov_y: number = 2;

  isTerrain = false;
  isPref: boolean = false;
  Dest : number[] = new Array();


  Algorithms: DropDownSelect[] = [
    {value: 'bfs', viewValue: 'Breadth First Search'},
    {value: 'Astar', viewValue: 'A*'},
    {value: 'Dijkstra', viewValue: 'Dijkstra'},
    {value: 'BestFirst', viewValue: 'Best First Search'}
  ];
  Problem_statement: DropDownSelect[] = [
    {value: 'PS_1', viewValue: 'One way trip'},
    {value: 'TSP', viewValue: 'Intermediate Stops'}
  ];
  maze : DropDownSelect[] = [
    {value: 'hori', viewValue: 'Horizontal '},
    {value: 'vert', viewValue: 'Vertical'},
    {value: 'rand', viewValue: 'Random'},
    {value: 'stair', viewValue:'Stair Case'},
    {value: 'mountE', viewValue: 'Mountain on End'},
    {value: 'mountS', viewValue: 'Mountain on Start'},
    {value: 'mountB', viewValue: 'Mountain between start and end'}
  ];
  Heuristic: DropDownSelect[] = [
    {value: 'l1', viewValue: 'Manhattan'},
    {value: 'l2', viewValue: 'Euclidean'},
    {value: 'octile', viewValue: 'Octile'},
    {value: 'cheby', viewValue: 'Chebyshev'}
  ];

  ngOnInit(): void {
  	for (let i = 0; i < vGrid; i++) {
      for (let j = 0; j < hGrid; j++) {
        this.gridCord[hGrid * i + j] = {x: i * 30,  y: j * 30,  isPath: false,  isTerrain: false,  f: null, g: null, h: null,  parent: null,  value : 0,  isEndPoint : false,  visited: false,  open : false,  debug : false};
      }
    }
  }

  fillGrey(a: number, b: number): void {
    let coord: number = Math.floor(a / 30)* hGrid + Math.floor(b / 30);
    if (coord !== this.start && coord !== this.end && this.mouseDown === true){
      let height = this.choose;
      if (!this.isGaussian ){
        this.gridCord[coord].isTerrain = true;
        this.gridCord[coord].value = height;
        this.updateUI();
      }else if(this.isGaussian && this.isTerrain){
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
    if(this.selectedPS === "PS_1"){
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

      }else{ // clicking on non (red green grey ) square
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
    }else if(this.selectedPS === "TSP"){
      if(coord == this.start){
        this.start = null;
        rect.isEndPoint = false;
      }else if(this.Dest.includes(coord)){
        let a = this.Dest.indexOf(coord);
        this.Dest[a] = null;
        rect.isEndPoint = false;
      }else if(rect.isTerrain){
        rect.isTerrain = false;
      }else{
        if(this.start == null){
          this.start = coord;
          rect.isEndPoint = true;
        }else if(this.Dest.length < this.selectedDest){
          this.Dest.push(coord);
          rect.isEndPoint = true;
        }else if(this.Dest.includes(null)){
          let a = this.Dest.indexOf(null);
          this.Dest[a] = coord;
          rect.isEndPoint = true;
        }else if (!rect.isTerrain ){
          rect.isTerrain = true;
          rect.value = 100;
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
      this.length = 0;
      this.steps = 0;
      this.time = '0';
    }
    let element = document.getElementsByTagName("line")
    let length = element.length
    for (var i = 0; i < length; ++i) {

       element[0].parentNode.removeChild(element[0]);
       element = document.getElementsByTagName("line")

    }
    this.Dest = [];
    this.start = null;
    this.end = null;
    this.length = 0;
    this.steps = 0;
    this.time = '0';
    this.isPref = true;
    this.prefToggle(this.isPref);
    this.updateUI();
     this.req_step = 0;
  }

  clearPath(): void{
    for (let u = totalGrid - 1; u >= 0; u--) {
      this.gridCord[u].isPath = false;
      this.gridCord[u].visited = false;
      this.gridCord[u].open = false;
      this.gridCord[u].debug = false;
      this.gridCord[u].f = null;
      this.gridCord[u].g = null;
      this.gridCord[u].h = null;
      this.length = 0;
      this.steps = 0;
      this.time = '0';

    }

    let element = document.getElementsByTagName("line")
    let length = element.length
    for (var i = 0; i < length; ++i) {

       element[0].parentNode.removeChild(element[0]);
       element = document.getElementsByTagName("line")

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
      this.choose = event.value;
    }

  onChangeDest(event: MatSliderChange){
      this.selectedDest = event.value;
    }

  onSearchChange(searchValue: any): void {
    this.choose = searchValue.target.value;
  }

  prefToggle(isPref : boolean){
    if(isPref){
      this.Algorithms = [
      {value: 'bfs', viewValue: 'Breadth First Search'},
      {value: 'Astar', viewValue: 'A*'},
      {value: 'Dijkstra', viewValue: 'Dijkstra'}];
      this.selectedValue = 'bfs';
    }else{
      this.Algorithms = [{value: 'Floyd–Warshall', viewValue: 'Floyd–Warshall'}];
      this.selectedValue = 'Floyd–Warshall';
    }
    console.log(this.Algorithms);
  }

  updateAlgoList(){
    if(this.isTerrain){
      this.Algorithms = [
      {value: 'Astar', viewValue: 'A*'},
      {value: 'Dijkstra', viewValue: 'Dijkstra'}];
      this.selectedValue = 'Astar';
    }else{
      this.Algorithms = [
      {value: 'bfs', viewValue: 'Breadth First Search'},
      {value: 'Astar', viewValue: 'A*'},
      {value: 'Dijkstra', viewValue: 'Dijkstra'},
      {value: 'BestFirst', viewValue: 'Best First Search'}];
    }
  }

  terrainToggle(isT: boolean){
    //console.log('This is emitted as the thumb slides');
    //console.log(event.value);
      this.bidirection = false;
      this.notCrossCorner = false;
      this.isGaussian = false;
  }
  changeMaze(){
    this.clearWall();
    this.selectedValue = 'bfs';
    this.isTerrain = false;
    this.isGaussian = false;
    this.updateAlgoList();
    switch (this.selectedMaze) {
      case "hori":
          for (var i = 0; i < hGrid; i+=2) {
            for (var j = 0; j < vGrid; ++j) {
              if(Math.random()>0.3){
                this.gridCord[j*hGrid+i].isTerrain = true;
                this.gridCord[j*hGrid+i].value = 100;
              }
            }
          }
          for (var i = 0; i < totalGrid; ++i) {
            if(this.gridCord[i].isTerrain){
              continue;
            }
            if(Math.random()>0.9){
              this.gridCord[i].isTerrain = true;
              this.gridCord[i].value = 100;
            }else{
              this.gridCord[i].isTerrain = false;
              this.gridCord[i].value = 0;
            }
          }
        break;
      case "vert":
          for (var i = 0; i < hGrid; i++) {
            for (var j = 0; j < vGrid; j+=2) {
              if(Math.random()>0.3){
                this.gridCord[j*hGrid+i].isTerrain = true;
                this.gridCord[j*hGrid+i].value = 100;
              }
            }
          }
          for (var i = 0; i < totalGrid; ++i) {
            if(this.gridCord[i].isTerrain){
              continue;
            }
            if(Math.random()>0.9){
              this.gridCord[i].isTerrain = true;
              this.gridCord[i].value = 100;
            }else{
              this.gridCord[i].isTerrain = false;
              this.gridCord[i].value = 0;
            }
          }
        break;
      case "rand":
        for (var i = 0; i < totalGrid; ++i) {
          if(Math.random()>0.7){
            this.gridCord[i].isTerrain = true;
            this.gridCord[i].value = 100;
          }else{
            this.gridCord[i].isTerrain = false;
            this.gridCord[i].value = 0;
          }
        }
        break;
      case "stair":
        var  i = 0;
        for ( i = 0; i <= 22*(hGrid+1); i=i+hGrid+1) {
          this.gridCord[i].isTerrain = true;
          this.gridCord[i].value = 100;
        }
        for ( i = 22*(hGrid+1); i%hGrid !=0 ; i=i+hGrid-1) {
          this.gridCord[i].isTerrain = true;
          this.gridCord[i].value = 100;         // code...
        }
          this.gridCord[i].isTerrain = false;
          this.gridCord[i].value = 0;
          i+=2;
        for(var j=0; j<5;j++){
          this.gridCord[i+j*(hGrid+1)].isTerrain = true;
          this.gridCord[i+j*(hGrid+1)].value = 100;         // code...
        }
        break;
      case "mountE":
        this.selectedPS = 'PS_1';
        this.selectedValue = 'Astar';
        this.isTerrain = true;
        this.isGaussian = true;
        this.updateAlgoList();
        if(this.end ==null){
          alert("Click on end grid cell");
          return;
        }
        this.cov_x = 25;
        this.cov_y = 18;
        this.gaussianFill(this.end);
      break;
      case "mountS":
        this.selectedPS = 'PS_1';
        this.selectedValue = 'Astar';
        this.isTerrain = true;
        this.isGaussian = true;
        this.updateAlgoList();
        if(this.start ==null){
          alert("Click on start grid cell");
          return;
        }
        this.cov_x = 25;
        this.cov_y = 18;
        this.gaussianFill(this.start);
      break;
      case "mountB":
        this.selectedPS = 'PS_1';
        this.selectedValue = 'Astar';
        this.isTerrain = true;
        this.isGaussian = true;
        this.updateAlgoList();
        if(this.start ==null || this.end ==null){
          alert("Click on start/end grid cell");
          return;
        }
        var x1 = Math.round(this.start/hGrid);
        var y1 = this.start%hGrid;
        var x2 = Math.round(this.end/hGrid);
        var y2 = this.end%hGrid;
        this.cov_x = Math.abs(x1-x2-5);
        this.cov_y = Math.max(Math.abs(y1-y2-5),18);
        let midx = Math.round((x1+x2)/2);
        let midy = Math.round((y1+y2)/2);

        this.gaussianFill(midx*hGrid + midy);
      break;
      default:
        // code...
        break;
    }
    this.updateUI();
  }
  updateUI(): void{
    // console.log(this.Dest);
    for (let u = totalGrid - 1; u >= 0; u--) {
      (async () => {
        // Do something before delay
        //console.log('before delay')

      let rect :GridCoords = this.gridCord[u];
      let element = document.getElementsByTagName('rect')[u];

     if (u == this.start && rect.isEndPoint){
        element.style.fill = "green";
        element.style.fillOpacity = "1";
      }
      else if ((u == this.end  || this.Dest.includes(u))&& rect.isEndPoint){
        element.style.fill = "red";
        element.style.fillOpacity = "1";
      }else if(rect.isPath && this.showPath){
        element.style.fill = "orange";
        element.style.fillOpacity = "1";
      }
      else if (rect.debug){
        element.style.fill = "pink";
      }
      else if (rect.isTerrain){
        element.style.fill = "grey";
        element.style.fillOpacity = (rect.value / 100).toString();
      }
      else if (rect.visited && !this.isTerrain && this.selectedPS == 'PS_1'){
        //await delay(10000);
        element.style.fill = "lightblue";
        element.style.fillOpacity = "1";
      }
      else if (rect.open && !this.isTerrain && this.selectedPS == 'PS_1'){
        element.style.fill = "lightgreen";
        element.style.fillOpacity = "1";
      }
      else{
        element.style.fill = 'white';
        element.style.fillOpacity = '1';

      }
          //console.log('after delay')
      })();
    }

  }
  pathLine(): void{
    // else if(this.selectedValue == 'Dijkstra'){
    //   for(let p=0;p< this.path.length-1;p++){
    //     let loc = this.path[p];
    //     let loc_next = this.path[p+1];
    //     console.log(loc, Math.floor(loc/hGrid)+15, (loc%hGrid)+15);
    //     this.pathCord.push({x1: Math.floor(loc/hGrid)*30+15,y1: (loc%hGrid)*30+15,
    //                       x2: Math.floor(loc_next/hGrid)*30+15,y2: (loc_next%hGrid)*30+15 })

    //   }
    // }
    let node = this.end;
    // console.log(this.bidirecNodeE, this.bidirecNodeS)
    if(this.bidirection && (this.bidirecNodeE!=-1 || this.bidirecNodeS!=-1)){
      let node1 = this.bidirecNodeS; let node2 = this.bidirecNodeE;
      this.length = 0;

      let x1 = Math.floor(node1/hGrid)*30+15;
      let x2 = Math.floor(node2/hGrid)*30+15;
      let y1 = (node1%hGrid)*30+15;
      let y2 = (node2%hGrid)*30+15;
      this.pathCord.push({ x1: x1, y1: y1, x2: x2, y2: y2 })
      this.length = this.length + Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2))/30;

      while(node1!=this.start){
        let node_next = this.gridCord[node1].parent;
        let x1 = Math.floor(node1/hGrid)*30+15;
        let x2 = Math.floor(node_next/hGrid)*30+15;
        let y1 = (node1%hGrid)*30+15;
        let y2 = (node_next%hGrid)*30+15;
        this.pathCord.push({ x1: x1, y1: y1, x2: x2, y2: y2 })
        node1 = node_next;
        this.length = this.length + Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2))/30;
      }
      while(node2!=this.end){
        let node_next = this.gridCord[node2].parent;
        let x1 = Math.floor(node2/hGrid)*30+15;
        let x2 = Math.floor(node_next/hGrid)*30+15;
        let y1 = (node2%hGrid)*30+15;
        let y2 = (node_next%hGrid)*30+15;
        this.pathCord.push({ x1: x1, y1: y1, x2: x2, y2: y2 })
        node2 = node_next;
        this.length = this.length + Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2))/30;
      }
      this.lengthS = this.length.toFixed(2);
    }
    else if(!this.bidirection && this.gridCord[node].parent!=null){
      //console.log(this.gridCord[node].parent);
      this.length = 0;
      while(node!=this.start){
        let node_next = this.gridCord[node].parent;
        let x1 = Math.floor(node/hGrid)*30+15;
        let x2 = Math.floor(node_next/hGrid)*30+15;
        let y1 = (node%hGrid)*30+15;
        let y2 = (node_next%hGrid)*30+15;
        this.pathCord.push({ x1: x1, y1: y1, x2: x2, y2: y2 })
        node = node_next;
        this.length = this.length + Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2))/30;
      }
      this.lengthS = this.length.toFixed(2);
    }

    else if (this.selectedValue!='bfs' && this.selectedPS=='PS_1' && !this.isTerrain){
      window.alert("Sorry, no Path Exists :(, Try giving a finite terrain value");
    }
    else{
      window.alert("Sorry, no Path Exists :(");
    }

  }

  req_step :number = 0;
  // inc_step(){
  //   this.req_step ++;
  //   console.log(this.req_step);
  //   this.Search();
  //   // let element = document.getElementsByTagName('rect')[u];
  // }

  Search(){
    const astar: Astar = new Astar();
    const biastar: BiAstar = new BiAstar();

    const bfs: BFS = new BFS();
    const bibfs: BiBFS = new BiBFS();

    const best : BestFirst = new BestFirst();

    const dij: Dijkstra = new Dijkstra();
    const bidjk: BiDjk = new BiDjk();
    const flyw: FloydWarshall = new FloydWarshall();

    let heur;
    switch (this.selectedHeuristic) {
      case "l1":
        heur = Utils.Manhattan;
        break;
      case "l2":
        heur = Utils.Euclidean;
        break;
      case "octile":
        heur = Utils.Octile;
        break;
      case "cheby":
        heur = Utils.Chebyshev;
        break;
      default:
        heur = Utils.Manhattan;
        break;
    }

    this.clearPath();
    this.resetGridParams();

    this.adjList = get_adjacency_list(vGrid, hGrid, this.allowDiag);
    if ( this.start == null || (this.end == null && this.Dest.length < this.selectedDest) ){
        alert('Insert start and end');
        return;
    }
    console.log(this.selectedValue);
    if(this.selectedPS === "PS_1"){
      switch (this.selectedValue) {
        case 'bfs':
          if(this.bidirection){
            bibfs.search( this.start, this.end,this.gridCord, this.allowDiag,this.notCrossCorner);
          }else{
            bfs.search( this.start, this.end, this.gridCord,this.allowDiag,this.notCrossCorner);
          }
          this.steps = bfs.steps;
          this.time = bfs.time;
          this.bidirecNodeS = bibfs.bidirecNodeS;
          this.bidirecNodeE = bibfs.bidirecNodeE;
          break;
        case 'Astar':
          if(this.isTerrain){
            astar.Wsearch( this.start,this.end,this.gridCord,this.allowDiag,false,this.adjList,heur/*,this.req_step*/);
            this.steps = astar.steps;
            this.time = astar.time;
          }else if (this.bidirection){
            biastar.search( this.start, this.end,this.gridCord, this.allowDiag,this.notCrossCorner/*,this.req_step*/,heur);
            this.steps = biastar.steps;
            this.length = biastar.length1;
            this.time = biastar.time;
            this.bidirecNodeS = biastar.bidirecNodeS;
            this.bidirecNodeE = biastar.bidirecNodeE;
            // console.log(this.bidirecNodeE,this.bidirecNodeS);

          }else{
            astar.search( this.start,this.end,this.gridCord,this.allowDiag,this.notCrossCorner/*,this.req_step*/,heur);
            this.steps = astar.steps;
            this.length = astar.length1;
            this.time = astar.time;
          }
          break;
        case 'Dijkstra':
          if(this.isTerrain){
            this.adjList = get_adjacency_list(vGrid, hGrid, this.allowDiag);
            dij.Wsearch(this.start, this.end, this.gridCord ,this.allowDiag,this.adjList);
            this.time = dij.time;
            this.steps = dij.steps;
            this.length = dij.length1;

          }else if (this.bidirection){
            bidjk.search( this.start, this.end,this.gridCord, this.allowDiag,this.notCrossCorner/*,this.req_step*/);
            this.time = bidjk.time;
            this.steps = bidjk.steps;
            this.length = bidjk.length1;
            this.bidirecNodeS = bidjk.bidirecNodeS;
            this.bidirecNodeE = bidjk.bidirecNodeE;

          }else{
            dij.search( this.start, this.end,this.gridCord, this.allowDiag,this.notCrossCorner/*,this.req_step*/);
            this.time = dij.time;
            this.steps = dij.steps;
            this.length = dij.length1;

          }
          break;
         case 'BestFirst':
          console.log(this.bidirection);
          if(this.bidirection){
            best.biSearch( this.start,this.end,this.gridCord,this.allowDiag,this.notCrossCorner/*,this.req_step*/,heur);
            this.time = best.time;
            this.steps = best.steps;
            this.length = best.length1;
          }else{
            best.search( this.start,this.end,this.gridCord,this.allowDiag,this.notCrossCorner/*,this.req_step*/,heur);
            this.time = best.time;
            this.steps = best.steps;
            this.length = best.length1;
          }
          break;
        default:
          alert('Select Algorithms');
        break;
      }
    }else{
      switch (this.selectedValue) {
        case 'bfs':
          if(this.selectedPS == "TSP"){
            const tsp = new TravSalesMan();
            tsp.start = this.start;
            tsp.destinations = this.Dest;
            tsp.search(bfs, this.isPref, this.gridCord, this.allowDiag, this.adjList);
            this.length = tsp.length;
            this.steps = tsp.steps;
            this.time = tsp.time;
          }
          break;
        case 'Astar':
          if(this.selectedPS == "TSP"){
            const tsp = new TravSalesMan();
            tsp.start = this.start;
            tsp.destinations = this.Dest;
            tsp.search(astar, this.isPref, this.gridCord, this.allowDiag, this.adjList);
            this.length = tsp.length;
            this.steps = tsp.steps;
            this.time = tsp.time;
          }
          break;
        case 'Dijkstra':
          if(this.selectedPS == "TSP"){
            const tsp = new TravSalesMan();
            tsp.start = this.start;
            tsp.destinations = this.Dest;
            tsp.search(dij, this.isPref, this.gridCord, this.allowDiag, this.adjList);
            this.length = tsp.length;
            this.steps = tsp.steps;
            this.time = tsp.time;
          }
          break;
        case 'Floyd–Warshall':
          if(this.selectedPS == "TSP"){
            const tsp = new TravSalesMan();
            tsp.start = this.start;
            tsp.destinations = this.Dest;
            tsp.prepareNewGraph(this.gridCord, this.allowDiag, this.adjList);
            tsp.search(flyw, this.isPref, this.gridCord, this.allowDiag, this.adjList);
            console.log('Flyod Warshall');
            this.time = tsp.time;
            this.steps = tsp.steps;
            this.length = tsp.length;
          }
          break;
        default:
          alert('Select Algorithms');
          break;
      }
    }
    this.updateUI();
      // this.pathLine(); //for tracing the line
      // console.log(this.gridCord)
  }
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