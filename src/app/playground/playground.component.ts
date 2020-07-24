import { Component, OnInit} from '@angular/core';
import { GridCoords } from './include/GridCoords';
import { MatSliderChange } from '@angular/material/slider';

import { DPair, get_adjacency_list } from './include/adj';
import { Dijkstra } from './finder/dijkstra';
import { BiDjk } from './finder/BiDijkstra';

import { FloydWarshall } from './finder/floydWarshall';
import { TravSalesMan } from './finder/travSalesMan';
import { lineCord} from './include/lineCoord'
import { Astar } from './finder/Astar' ;
import { BiAstar } from './finder/BiAstar' ;

import {BFS} from './finder/BFS';
import {BiBFS} from './finder/BiBFS';

import { BestFirst } from './finder/BestFirst'

import {utils } from './include/utils';
import {hGrid, vGrid, totalGrid, height} from './include/constants';

import {maze} from './include/maze'

const Utils: utils = new utils();

interface DropDownSelect {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-first-component',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})

export class PlaygroundComponent implements OnInit {
  constructor() {
    let menu = document.getElementsByClassName("button-cover")
  }
  // height = window.innerHeight;
  width = window.innerWidth;

  height_svg = 30*hGrid + 30;
  height_menu = this.height_svg - 110;


  gridCord: GridCoords[] = new Array(totalGrid);
  adjList: Array<Array<DPair>>;
  mouseDown = false;
  color = -1; //0 is clicked on grey 1 is one white 

  start = null;
  end = null;

  //results tab
  steps = 0;
  time = '0';
  lengthS = "0";
  length = 0;  //internal calculation

  path: number[] = new Array();
  pathCord: lineCord[] = new Array();

  terrain: boolean = true;
  cov_x: number = 10;
  cov_y: number = 10;

  
  // Slider for Obstacle
  max = 100;
  min = 0;
  step = 1;

  isGaussian: boolean = false;
  isTerrain = false;
  terrainValue = 100;
  
  allowDiag:boolean = false;
  bidirection:boolean = false;
  showPath: boolean = true;
  notCrossCorner:boolean = false;
  show_infoResult: boolean = false;

  bidirecNodeS:number = -1;  // variable to store node location where forward bidirec ends
  bidirecNodeE:number = -1;  // node where backward bidrec ends // used in tracing path

  isPref: boolean = false;

  minDest =1;
  maxDest = 5;
  selectedDest: number = 2;
  Dest : number[] = new Array();
  destMissing : number=0;

  selectedAlgo: string = 'bfs';
  selectedPS: string = 'PS_1';
  PS_index: number = 0;
  selectedMaze: string;
  selectedHeuristic: string = 'l1';

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
    {value: 'sidewinder', viewValue: 'Sidewinder Algorithm'},
    {value: 'dfsMaze', viewValue: 'DFS'},
    {value: "Prim's", viewValue: "Prim's Maze"},
    {value: 'binaryTree', viewValue: 'Binary Tree'},
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

  ngOnInit() {
    for (let i = 0; i < vGrid; i++) {
      for (let j = 0; j < hGrid; j++) {
        this.gridCord[hGrid * i + j] = {x: i * 30, y: j * 30, isPath: false, isTerrain: false, f: null, g: null, h: null, parent: null, value : 0, isEndPoint : null, visited: false, open : false,/* debug : false,*/ destOrder:null};

      }
    }
  }

  fillGrey(a: number, b: number): void {
    let coord: number = Math.floor(a / 30)* hGrid + Math.floor(b / 30);
    if (coord !== this.start && coord !== this.end && this.mouseDown === true){
      let height = this.terrainValue;
      if(this.selectedPS == "PS_1"){
        if (!this.isGaussian ){
          if(this.color === 1){
            this.gridCord[coord].isTerrain = true;
            this.gridCord[coord].value = height;
          }else{
            this.gridCord[coord].isTerrain = false;
            this.gridCord[coord].value = 0;
          }
        }else if(this.isGaussian && this.isTerrain){
          this.gaussianFill(this.cov_x,this.cov_y,coord);
        }
      }else{
        if(this.color === 1){
            this.gridCord[coord].isTerrain = true;
            this.gridCord[coord].value = 100  ;
        }else{
          this.gridCord[coord].isTerrain = false;
          this.gridCord[coord].value = 0;
        }

      }
    }
    this.updateUI();
  }

  gaussianFill (cov_x:number,cov_y:number,coord : number):void{
    let height = this.terrainValue;
      for (let i = -cov_x-3; i <= cov_x+3; i++) {
        for (let j = -cov_y-3; j <= cov_y+3; j++) {
          if(coord+i*hGrid+j >= 0 && coord+i*hGrid+j<totalGrid  &&i <= hGrid && j <= vGrid){
            this.gridCord[coord+i*hGrid+j].value += height * Math.exp(-1 * ((i*i*25)/(2*cov_x*cov_x) + (j*j*25)/(2*cov_y*cov_y) ) );
            this.gridCord[coord+i*hGrid+j].isTerrain = true;
            if(this.gridCord[coord+i*hGrid+j].value > 100){
              this.gridCord[coord+i*hGrid+j].value = 100;
            }
          }
        }
      }
  }

  fillColor (a :number , b:number): void{
    let coord :number = Math.floor(a / 30) * hGrid + Math.floor(b / 30);
    let rect :GridCoords = this.gridCord[coord];
    console.log(this.selectedPS);
    if(this.selectedPS == "PS_1"){
      if (coord === this.start){
        this.start = null;
        rect.isEndPoint = null;
      }else if (coord === this.end){
        this.end = null;
        rect.isEndPoint = null;
      }else if (rect.isTerrain){
        if(!this.isTerrain){
          rect.isTerrain = false;
          rect.value = 0;
        }else{
          if(this.start === null){
            this.start = coord;
            rect.isEndPoint = 0;
          }else if(this.end === null){
            this.end = coord;
            rect.isEndPoint = 1;
          }
          else if(!this.isGaussian){
            rect.isTerrain = true;
            rect.value = this.terrainValue;
          }else{
            this.gaussianFill(this.cov_x,this.cov_y,coord);
          }
        }

      }else{ // clicking on non (red green grey ) square
        if (this.start === null){
          this.start = coord;
          rect.isEndPoint = 0;
        }else if (this.end === null){
            this.end = coord;
            rect.isEndPoint = 1;
        }else if (!rect.isTerrain ){
          rect.isTerrain = true;
          if(!this.isGaussian){
            rect.isTerrain = true;
            rect.value = this.terrainValue;
          }else{
            this.gaussianFill(this.cov_x,this.cov_y,coord);
          }

        }
      }
    }else if(this.selectedPS == "TSP"){
      if(coord === this.start){
        this.start = null;
        rect.isEndPoint = null;
      }else if(this.Dest.includes(coord)){
        let a = this.Dest.indexOf(coord);
        this.Dest[a] = null;
        rect.isEndPoint = null;
        this.destMissing ++;
      }else if(rect.isTerrain){
        rect.isTerrain = false;
      }else{
        if(this.start === null){
          this.start = coord;
          rect.isEndPoint = 0;
        }else if(this.Dest.length < this.selectedDest){
          this.Dest.push(coord);
          rect.isEndPoint = this.Dest.length;
        }else if(this.Dest.includes(null)){
          let a = this.Dest.indexOf(null);
          this.Dest[a] = coord;
          rect.isEndPoint = a+1;
          this.destMissing --;
        }else if (!rect.isTerrain ){
          rect.isTerrain = true;
          rect.value = 100;
        }
      }

    }
    this.updateUI();

  }

  mouseUp(): void{
   this.mouseDown = false;
  }
  mouseDownE(isT:boolean): void{
    this.mouseDown = true;
    if(isT){
       this.color = 0;
    }else{
      this.color = 1;
    }
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
      this.gridCord[u].isEndPoint = null;
      this.gridCord[u].destOrder = null;
    }
    let element = document.getElementsByTagName("line");
    let length = element.length
    for (var i = 0; i < length; ++i) {

       element[0].parentNode.removeChild(element[0]);
       element = document.getElementsByTagName("line");

    }
    this.lengthS = "0";
    this.steps = 0;
    this.time = '0';
    this.Dest = [];
    this.start = null;
    this.end = null;
    this.length = 0;
    this.steps = 0;
    this.time = '0';
    this.updateAlgoList();
    this.updateUI();
  }

  clearPath(): void{
    for (let u = totalGrid - 1; u >= 0; u--) {
      this.gridCord[u].isPath = false;
      this.gridCord[u].visited = false;
      this.gridCord[u].open = false;
      // this.gridCord[u].debug = false;
      this.gridCord[u].f = null;
      this.gridCord[u].g = null;
      this.gridCord[u].h = null;
      this.gridCord[u].destOrder = null;
      this.lengthS = "0";
      this.steps = 0;
      this.time = '0';
      this.show_infoResult = false;
    }

    let element = document.getElementsByTagName("line");
    let length = element.length
    for (var i = 0; i < length; ++i) {

       element[0].parentNode.removeChild(element[0]);
       element = document.getElementsByTagName("line");

    }
    this.updateUI();
  }

  clearWall(): void{
   for (let u = totalGrid - 1; u >= 0; u--) {
    this.gridCord[u].isTerrain = false;
     this.gridCord[u].value = 0;
    }
   this.updateUI();
   this.show_infoResult = false;
  }

  resetGridParams():void{
     for (let u = totalGrid - 1; u >= 0; u--) {
      this.gridCord[u].f = null;
      this.gridCord[u].g = null;
      this.gridCord[u].h = null;
      this.gridCord[u].parent = null;
      this.gridCord[u].visited = false;
      this.gridCord[u].open = false;
     }
  }

  checkValue(event: any){
    this.updateUI();
  }

  onChange(event: MatSliderChange){
    this.terrainValue = event.value;
  }

  onChangeDest(event: MatSliderChange){
    this.selectedDest = event.value;
  }

  onSearchChange(searchValue: any): void {
    this.terrainValue = searchValue.target.value;
  }

  prefToggle(isPref : boolean){
    if(isPref){
      this.Algorithms = [
      {value: 'bfs', viewValue: 'Breadth First Search'},
      {value: 'Astar', viewValue: 'A*'},
      {value: 'Dijkstra', viewValue: 'Dijkstra'}];
      this.selectedAlgo = 'bfs';
    }else{
      this.Algorithms = [{value: 'Floyd–Warshall', viewValue: 'Floyd–Warshall'}];
      this.selectedAlgo = 'Floyd–Warshall';
    }
  }

  updateAlgoList(){
    if(this.selectedPS==="PS_1"){
      if(this.isTerrain){
        this.Algorithms = [
        {value: 'Astar', viewValue: 'A*'},
        {value: 'Dijkstra', viewValue: 'Dijkstra'}];
        this.selectedAlgo = 'Astar';
      }else{
        this.Algorithms = [
        {value: 'bfs', viewValue: 'Breadth First Search'},
        {value: 'Astar', viewValue: 'A*'},
        {value: 'Dijkstra', viewValue: 'Dijkstra'},
        {value: 'BestFirst', viewValue: 'Best First Search'}];
        this.selectedAlgo = 'bfs';
      }
    }else{
      this.prefToggle(this.isPref);
    }
  }

  terrainToggle(isT: boolean){
    this.bidirection = false;
    this.notCrossCorner = false;
    this.isGaussian = false;
    this.updateAlgoList();
    this.clearWall();
  }

  changeAlgo(){
    if(this.selectedAlgo === 'bfs' || this.selectedAlgo==='BestFirst'){
      this.isTerrain = false;
      this.isGaussian = false;
    }else if(this.selectedAlgo === 'Floyd–Warshall'){
      this.isTerrain = false;
      this.isGaussian = false;
      this.bidirection = false;
      this.notCrossCorner = false;
    }
    else{
      this.bidirection = false;
      this.notCrossCorner = false;
    }
  }

  changeMaze(){
    this.clearWall();
    this.isTerrain = false;
    this.isGaussian = false;
    this.bidirection = false;
    this.notCrossCorner = false;
    this.updateAlgoList();

    let Maze:maze = new maze();
    switch (this.selectedMaze) {
      case "sidewinder":
        this.start=null;
        this.end = null;
        this.Dest = [];
        Maze.sidewinder(this.gridCord);
        break;
      case "rand":
        this.start=null;
        this.end = null;
        this.Dest = [];
        Maze.rand(this.gridCord);
        break;
      case "stair":
        this.start=null;
        this.end = null;
        this.Dest = [];
        Maze.stair(this.gridCord)
        break;
      case "binaryTree":
        this.start=null;
        this.end = null;
        this.Dest = [];
        Maze.binary(this.gridCord);
      break;
      case "dfsMaze":
        this.start=null;
        this.end = null;
        this.Dest = [];
        Maze.dfsMaze(this.gridCord);
        break;
      case "Prim's":
        this.start=null;
        this.end = null;
        this.Dest = [];
        Maze.primMaze(this.gridCord);
        break;
      case "mountE":
        this.selectedPS = 'PS_1';
        this.selectedAlgo = 'Astar';
        this.isTerrain = true;
        this.isGaussian = true;
        this.updateAlgoList();
        if(this.end ===null){
          alert("Click on end grid cell");
          this.selectedMaze = null;
          return;
        }
        this.gaussianFill(25,18,this.end);
      break;
      case "mountS":
        this.selectedPS = 'PS_1';
        this.selectedAlgo = 'Astar';
        this.isTerrain = true;
        this.isGaussian = true;
        this.updateAlgoList();
        if(this.start ===null){
          alert("Click on start grid cell");
          this.selectedMaze = null;
          return;
        }
        this.gaussianFill(25,18,this.start);
      break;
      case "mountB":
        this.selectedPS = 'PS_1';
        this.selectedAlgo = 'Astar';
        this.isTerrain = true;
        this.isGaussian = true;
        this.updateAlgoList();
        if(this.start ===null || this.end ===null){
          alert("Click on start/end grid cell");
          this.selectedMaze = null;
          return;
        }
        let x1 = Math.round(this.start/hGrid);
        let y1 = this.start%hGrid;
        let x2 = Math.round(this.end/hGrid);
        let y2 = this.end%hGrid;
        let cov_x = Math.abs(x1-x2-5);
        let cov_y = Math.max(Math.abs(y1-y2-5),18);
        let midx = Math.round((x1+x2)/2);
        let midy = Math.round((y1+y2)/2);

        this.gaussianFill(cov_x,cov_y,midx*hGrid + midy);

      break;

      default:
        // code...
        break;
    }
    this.selectedMaze = null;
    this.updateUI();
  }

  updateUI(): void{
    for (let u = totalGrid - 1; u >= 0; u--) {
      let rect :GridCoords = this.gridCord[u];
      let element = document.getElementsByTagName('rect')[u];

     if (u === this.start && rect.isEndPoint===0){
        element.style.fill = "green";
        element.style.fillOpacity = "1";
      }
      else if ((u === this.end  || this.Dest.includes(u))&& rect.isEndPoint>0){
        element.style.fill = "red";
        element.style.fillOpacity = "1";
      }else if(rect.isPath && this.showPath){
        element.style.fill = "orange";
        element.style.fillOpacity = "1";
      }
      // else if (rect.debug){
      //   element.style.fill = "pink";
      // }
      else if (rect.isTerrain){
        if(this.isTerrain){
          let a = (Math.floor(256-(rect.value*128 / 100))).toString();
          element.style.fill = "rgb("+a+","+a+","+a+")";
          element.style.fillOpacity = "1";
        }else{
          element.style.fill = "#4f4f4f";
        }

      }
      else if (rect.visited && !this.isTerrain && this.selectedPS  ===  'PS_1'){
        element.style.fill = "lightblue";
        element.style.fillOpacity = "1";
      }
      else if (rect.open && !this.isTerrain && this.selectedPS  ===  'PS_1'){
        element.style.fill = "lightgreen";
        element.style.fillOpacity = "1";
      }
      else{
        element.style.fill = 'white';
        element.style.fillOpacity = '1';

      }
    }

  }
  pathLine(start:number, end:number): void{

    let node = end;
      if(this.bidirection && (this.bidirecNodeE !== -1 || this.bidirecNodeS !== -1)){
        let node1 = this.bidirecNodeS; let node2 = this.bidirecNodeE;
        this.length = 0;

        let x1 = Math.floor(node1/hGrid)*30+15;
        let x2 = Math.floor(node2/hGrid)*30+15;
        let y1 = (node1%hGrid)*30+15;
        let y2 = (node2%hGrid)*30+15;
        this.pathCord.push({ x1: x1, y1: y1, x2: x2, y2: y2 })
        this.length = this.length + Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2))/30;

        while(node1 !== start){
          let node_next = this.gridCord[node1].parent;
          let x1 = Math.floor(node1/hGrid)*30+15;
          let x2 = Math.floor(node_next/hGrid)*30+15;
          let y1 = (node1%hGrid)*30+15;
          let y2 = (node_next%hGrid)*30+15;
          this.pathCord.push({ x1: x1, y1: y1, x2: x2, y2: y2 })
          node1 = node_next;
          this.length = this.length + Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2))/30;
        }
        while(node2 !== this.end){
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
      else if(!this.bidirection && this.gridCord[node].parent !== null){
        this.length = 0;
        while(node !== start){
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

      else if (this.selectedAlgo !== 'bfs' && this.selectedPS === 'PS_1' && !this.isTerrain){
        window.alert("Sorry, no Path Exists :(, Try giving a finite terrain value");
      }
      else{
        window.alert("Sorry, no Path Exists :(");
      }

  }

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
    
    if(this.selectedPS === "PS_1"){
      if(this.start == null || this.end == null){
        alert('Insert start or end');
        return;
      }
      switch (this.selectedAlgo) {
        case 'bfs':
          if(this.bidirection){
            bibfs.search( this.start, this.end,this.gridCord, this.allowDiag,this.notCrossCorner);
            this.bidirecNodeS = bibfs.bidirecNodeS;
            this.bidirecNodeE = bibfs.bidirecNodeE;
            this.steps = bibfs.steps;
            this.time = bibfs.time.toFixed(3);

          }else{
            bfs.search( this.start, this.end, this.gridCord,this.allowDiag,this.notCrossCorner);
            this.steps = bfs.steps;
            this.time = bfs.time.toFixed(3);
          }

          break;
        case 'Astar':
          if(this.isTerrain){
            astar.Wsearch( this.start,this.end,this.gridCord,this.allowDiag,false,this.adjList,heur);
            this.steps = astar.steps;
            this.time = astar.time.toFixed(3);
          }else if (this.bidirection){
            biastar.search( this.start, this.end,this.gridCord, this.allowDiag,this.notCrossCorner,heur);
            this.steps = biastar.steps;
            this.time = biastar.time.toFixed(3);
            this.bidirecNodeS = biastar.bidirecNodeS;
            this.bidirecNodeE = biastar.bidirecNodeE;

          }else{
            astar.search( this.start,this.end,this.gridCord,this.allowDiag,this.notCrossCorner,heur);
            this.steps = astar.steps;
            this.time = astar.time.toFixed(3);
          }
          break;
        case 'Dijkstra':
          if(this.isTerrain){
            this.adjList = get_adjacency_list(vGrid, hGrid, this.allowDiag);
            dij.Wsearch(this.start, this.end, this.gridCord ,this.allowDiag,this.adjList);
            this.time = dij.time.toFixed(3);
            this.steps = dij.steps;

          }else if (this.bidirection){
            bidjk.search( this.start, this.end,this.gridCord, this.allowDiag,this.notCrossCorner);
            this.time = bidjk.time.toFixed(3);
            this.steps = bidjk.steps;
            this.bidirecNodeS = bidjk.bidirecNodeS;
            this.bidirecNodeE = bidjk.bidirecNodeE;

          }else{
            dij.search( this.start, this.end,this.gridCord, this.allowDiag,this.notCrossCorner);
            this.time = dij.time.toFixed(3);
            this.steps = dij.steps;
          }
          break;
         case 'BestFirst':
          if(this.bidirection){
            best.biSearch( this.start,this.end,this.gridCord,this.allowDiag,this.notCrossCorner,heur);
            this.time = best.time.toFixed(3);
            this.steps = best.steps;
            this.bidirecNodeS = best.bidirecNodeS;
            this.bidirecNodeE = best.bidirecNodeE;

          }else{
            best.search(this.start, this.end, this.gridCord, this.allowDiag, this.notCrossCorner, heur);
            this.time = best.time.toFixed(3);
            this.steps = best.steps;
          }
          break;
        default:
          alert('Select Algorithms');
        break;
      }
    this.pathLine(this.start,this.end);
    }else{ //ps == TSP
      if(this.start == null || this.Dest.length < this.selectedDest || this.destMissing !=0){
        alert('Insert start or end');
        return;
      }
      switch (this.selectedAlgo) {
        case 'bfs':
          if(this.selectedPS  ===  "TSP"){
            const tsp = new TravSalesMan();
            tsp.start = this.start;
            tsp.destinations = this.Dest;
            tsp.search(bfs, this.isPref, this.gridCord, this.allowDiag, this.adjList);
            this.lengthS = tsp.length.toFixed(2);
            this.steps = tsp.steps;
            this.time = tsp.time.toFixed(3);
            this.pathCord = tsp.pathCord;
          }
          break;
        case 'Astar':
          if(this.selectedPS  ===  "TSP"){
            const tsp = new TravSalesMan();
            tsp.start = this.start;
            tsp.destinations = this.Dest;
            tsp.search(astar, this.isPref, this.gridCord, this.allowDiag, this.adjList);
            this.lengthS = tsp.length.toFixed(2);
            this.steps = tsp.steps;
            this.time = tsp.time.toFixed(3);
            this.pathCord = tsp.pathCord;
          }
          break;
        case 'Dijkstra':
          if(this.selectedPS  ===  "TSP"){
            const tsp = new TravSalesMan();
            tsp.start = this.start;
            tsp.destinations = this.Dest;
            tsp.search(dij, this.isPref, this.gridCord, this.allowDiag, this.adjList);
            this.lengthS = tsp.length.toFixed(2);
            this.steps = tsp.steps;
            this.time = tsp.time.toFixed(3);
            this.pathCord = tsp.pathCord;

          }
          break;
        case 'Floyd–Warshall':
          if(this.selectedPS  ===  "TSP"){
            const tsp = new TravSalesMan();
            tsp.start = this.start;
            tsp.destinations = this.Dest;
            tsp.prepareNewGraph(this.gridCord, this.allowDiag, this.adjList);
            tsp.search(flyw, this.isPref, this.gridCord, this.allowDiag, this.adjList);
            this.time = tsp.time.toFixed(3);
            this.steps = tsp.steps;
            this.lengthS = tsp.length.toFixed(2);
            this.pathCord = tsp.pathCord;
          }
          break;
        default:
          alert('Select Algorithm');
          break;
      }
    }
    this.updateUI();
    this.show_infoResult=true;
  }
}

