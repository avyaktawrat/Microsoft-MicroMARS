import { Component, OnInit} from '@angular/core';
import { GridCoords } from './GridCoords';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { newArray } from '@angular/compiler/src/util';

@Component({
  selector: 'app-first-component',
  templateUrl: './first-component.component.html',
  styleUrls: ['./first-component.component.css']
})
export class FirstComponentComponent implements OnInit {
  constructor() {
  } 
  height = window.innerHeight;
  width = screen.width;

  hGrid :number = Math.floor((this.height-100)/30);
  vGrid :number = Math.floor((this.width-120)/30);
  totalGrid : number =this.hGrid * this.vGrid;
  gridCord: GridCoords[] = new Array(this.totalGrid);
  mouseDown : boolean = false;
  toFill:boolean = true;
  color :number = 2; //0 red 1 green 2 other
  i :number = 0;
  start :number = 0;
  end :number = 0;


  ngOnInit() {
    for (let i = 0; i < this.vGrid; i++) {
      for (let j = 0; j < this.hGrid; j++) {
        this.gridCord[this.hGrid * i + j] = {x: i * 30, y: j * 30, obstacle: 0};

      }
    }
    console.log(this.height,this.width);
  }

  fillGrey(a: number, b: number,r: number): void {
    //console.log(a,b,r);  
    let element = document.getElementsByTagName('rect')[Math.floor(a/30)*this.hGrid+Math.floor(b/30)];
    if(this.mouseDown == true && !(element.style.fill == "green" || element.style.fill == "red" )){
      element.style.fill = "grey";
      this.gridCord[Math.floor(a/30)*this.hGrid+Math.floor(b/30)].obstacle = 1;
      //console.log(this.gridCord[Math.floor(a/6)+Math.floor(b/30)].x);
    }
  }

  fillColor (a :number , b:number, r: number): void{
    //console.log('toggle');    
    let element = document.getElementsByTagName('rect')[Math.floor(a/30)*this.hGrid+Math.floor(b/30)];
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
          this.gridCord[Math.floor(a/30)*this.hGrid+Math.floor(b/30)].obstacle = 0;
          element.style.fill = "green";
          this.start = Math.floor(a/30)*this.hGrid+Math.floor(b/30);
          this.i++;
        }else if (this.i == 1) {// prev click color green
          element.style.fill = "red";
          this.end = Math.floor(a/30)*this.hGrid+Math.floor(b/30);
          this.i++;          
        }else{    // fill red green or grey
          if(this.color == 0){  
            element.style.fill = "green";
            this.start = Math.floor(a/30)*this.hGrid+Math.floor(b/30);
            this.gridCord[Math.floor(a/30)*this.hGrid+Math.floor(b/30)].obstacle = 0;
            this.color = 2;
          }else if(this.color == 1){
            element.style.fill = "red";
            this.end = Math.floor(a/30)*this.hGrid+Math.floor(b/30);
            this.color  = 2;            
          }else{    // toggle grey
            if(element.style.fill == "grey"){
              this.gridCord[Math.floor(a/30)*this.hGrid+Math.floor(b/30)].obstacle = 0;
              element.style.fill = "white";
            }else{
            element.style.fill = "grey";
            this.gridCord[Math.floor(a/30)*this.hGrid+Math.floor(b/30)].obstacle = 1;
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
    for (let i = 0; i < this.vGrid; i++) {
      for (let j = 0; j < this.hGrid; j++) {
        this.gridCord[this.hGrid * i + j].obstacle = 0;
        let element = document.getElementsByTagName('rect')[this.hGrid * i + j];
        element.style.fill = "white";
      }
    }
    this.i=0;
    this.color=2;
  }

  rl_search(): void{
    //console.log(this.start);
    //console.log(this.end);
    // defining direction vectors
    //var next = this.start;
   //while(this.gridCord[])
    //var arr = this.direction_vector(this.start);
    //console.log(next);
    //console.log(arr);
    this.reset_color();
    let visited: boolean[] = new Array();
    let distance: number[] = new Array();
    let parent: object;
    parent = {};
    for(let j=0;j<this.totalGrid;j++){
      visited[j]=false;
    }
    var qu = new Array();
    visited[this.start]= true;
    distance[this.start] = 0;
    qu.push(this.start);  
    while(qu.length != 0){
      var s =   qu[0];
      qu.shift();
      var arr = this.direction_vector(s);
      for(let u of arr){
        if (!visited[u]){
          visited[u]= true;
          distance[u]=distance[s]+1;
          if (u == this.end){
            let node:number;
            node = s;//parent[u]
            while(node!=this.start){
              let element = document.getElementsByTagName('rect')[node];
              element.style.fill = "orange";
              node = parent[node];
            }
            break;
          }
          if(visited[u]){
          let element = document.getElementsByTagName('rect')[u];
          // element.innerHTML. : ;
          element.style.fill = "yellow";
          }
          parent[u] = s;
          qu.push(u);
        
        }  
      }
    }

  }

  shortest_path(a: number): number{
    if(a==this.end){
      console.log('reached');
      return 0;
    }
    var arr = this.direction_vector(a);
    for(let j in arr){
      if(this.gridCord[arr[j]].obstacle==0){
        let element = document.getElementsByTagName('rect')[arr[j]];
        element.style.fill = "yellow";
        //this.gridCord[arr[j]].obstacle = 1;
      }
    }
    //return 0;
  }

  direction_vector(a: number): number[]{
    var arr = new Array();
    
    if((a+1)%this.hGrid !=0 && a+1 < this.totalGrid && this.gridCord[a+1].obstacle!=1){
      arr.push(a+1);
    }
    if(a+this.hGrid < this.totalGrid && this.gridCord[a+this.hGrid].obstacle!=1){
      arr.push(a+this.hGrid);
    }
    if(a-this.hGrid >= 0 && this.gridCord[a-this.hGrid].obstacle!=1){
      arr.push(a-this.hGrid);
    }
    if((a)%this.hGrid !=0 && a-1>=0 && this.gridCord[a-1].obstacle!=1){
      arr.push(a-1);
    }
    return arr;
  }

  search_A():void {
    console.log(this.distance(this.end,this.end-1));
    console.log("start = "+this.start,this.end);
    this.reset_color();
    var openList = new Array();
    var closedList = new Array();
    var f = new Array();
    var g = new Array();
    var h = new Array();
    let parent: object;
    parent = {};

    openList.push(this.start);
    h[this.start] = this.distance(this.start , this.end);
    g[this.start] = 0;
    f[this.start] = g[this.start] + h[this.start];
    let currentNode :number;
    let steps :number = 0;
    while(openList.length != 0) {
      steps ++;

      //select least f
      var lowInd : number = 0;
      for(var i=0; i<openList.length; i++) {
        if(f[openList[i]] <= f[openList[lowInd]]) {
           lowInd = i;
        }
      }
      var lowIndH : number = lowInd;
      for(var i=0; i<openList.length; i++) {
        if(f[openList[i]] == f[openList[lowInd]]){
          if(h[openList[i]] < h[openList[lowIndH]]){
            lowIndH = i;
          }
        }
      }   
      currentNode = openList[lowIndH];

      //remove currentNode from openList
      function removeElement(array, elem) {
          var index = array.indexOf(elem);
          if (index > -1) {
              array.splice(index, 1);
          }
      }
      removeElement(openList, currentNode);

      //add currentNode to openList
      closedList.push(currentNode);

      if(currentNode == this.end){   //end found
          let node:number;
          node = parent[currentNode];//parent[u]
          while(node!=this.start){
            let element = document.getElementsByTagName('rect')[node];
            element.style.fill = "orange";
            node = parent[node];
          }
          break;
      }

      var neighbors = this.direction_vector(currentNode);

      for (let u of neighbors){

        if(closedList.includes(u)){
          continue;
        }

        g[u] = g[currentNode] + 1;
        h[u] = this.distance(u,this.end);
        f[u] = g[u] + h[u];

        if(openList.includes(u)){
          // let maxG = 0;
          // for (var i = openList.length - 1; i >= 0; i--) {
          //   if(g[openList[i]] > maxG){ maxG = g[openList[i]] }
          // }
          let a = openList.indexOf(u);
          if(g[u] > g[openList[a]]){
          // if(g[u] > maxG){
            continue;
          }
          
        }
        else{
          if(u != this.end){
            let element = document.getElementsByTagName('rect')[u];
            element.style.fill = "yellow";

          }
          parent[u] = currentNode;
          openList.push(u);
        }



      }
    } 


  }  
 update_FGH( f:Array<number> , g:Array<number> ,h:Array<number> ) :void{
     for (let i = 0; i < this.vGrid; i++) {
      for (let j = 0; j < this.hGrid; j++) {
        this.gridCord[i*this.hGrid+j].f = f[i*this.hGrid+j];
        this.gridCord[i*this.hGrid+j].g = g[i*this.hGrid+j];
        this.gridCord[i*this.hGrid+j].h = h[i*this.hGrid+j]; 
      }
    } 
  }
  distance(a: number, b:number ): number {
    console.log(a,b);
    var x1 = Math.floor(a/this.hGrid);
    var y1 = a%this.hGrid;
    var x2 = Math.floor(b/this.hGrid);
    var y2 = b%this.hGrid;
    console.log("h v "+ this.hGrid + " "+ this.vGrid);
    console.log("x1 x2 =" + x1 + " "+x2 + " y1 y2 " + y1 +" " + y2);
    let dist = Math.abs(x1-x2) + Math.abs(y1-y2);
    return dist;
  }

  

  reset_color() :void{
   for (var u = this.totalGrid - 1; u >= 0; u--) {
      if(u != this.start && u!= this.end && this.gridCord[u].obstacle !=1){
        let element = document.getElementsByTagName('rect')[u];
        element.style.fill = "white";

      }
    }

  }

}
