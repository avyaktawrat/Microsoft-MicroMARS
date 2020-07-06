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
  distance: number[] = new Array();   
  gridCord: GridCoords[] = new Array(25);
  mouseDown : boolean = false;
  toFill:boolean = true;
  color :number = 2; //0 red 1 green 2 other
  i :number = 0;
  start :number = 0;
  end :number = 0;


  ngOnInit() {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        this.gridCord[5 * i + j] = {x: i * 30, y: j * 30, obstacle: 0};

      }
    }
  }

  fillGrey(a: number, b: number,r: number): void {
    //console.log(a,b,r);  
    let element = document.getElementsByTagName('rect')[Math.floor(a/6)+Math.floor(b/30)];
    if(this.mouseDown == true && !(element.style.fill == "green" || element.style.fill == "red" )){
      element.style.fill = "grey";
      this.gridCord[Math.floor(a/6)+Math.floor(b/30)].obstacle = 1;
      //console.log(this.gridCord[Math.floor(a/6)+Math.floor(b/30)].x);
    }
  }

  fillColor (a :number , b:number, r: number): void{
    //console.log('toggle');    
    let element = document.getElementsByTagName('rect')[Math.floor(a/6)+Math.floor(b/30)];
    if(element.style.fill == "green"){  //clicked color is green
      //console.log('green');
      element.style.fill = "white";
      this.toFill = true;
      this.color = 1;
    }else if (element.style.fill == "red") {//clicked color is red
      //console.log('red');
      element.style.fill = "white";
      this.toFill = true;
      this.color = 0;
    }else{      //clicked color is white or grey
      //console.log ('white or grey');

        if(this.i == 0){      // prev click color red
          element.style.fill = "red";
          this.start = Math.floor(a/6)+Math.floor(b/30);
          this.i++;
        }else if (this.i == 1) {// prev click color green
          this.gridCord[Math.floor(a/6)+Math.floor(b/30)].obstacle = 0;
          element.style.fill = "green";
          this.end = Math.floor(a/6)+Math.floor(b/30);
          this.i++;
        }else{    // fill red green or grey
          if(this.color == 0){
            element.style.fill = "red";
            this.start = Math.floor(a/6)+Math.floor(b/30);
            this.color  = 2;
          }else if(this.color == 1){
            element.style.fill = "green";
            this.end = Math.floor(a/6)+Math.floor(b/30);
            this.gridCord[Math.floor(a/6)+Math.floor(b/30)].obstacle = 0;
            this.color = 2;
          }else{    // toggle grey
            if(element.style.fill == "grey"){
              this.gridCord[Math.floor(a/6)+Math.floor(b/30)].obstacle = 0;
              element.style.fill = "white";
            }else{
            element.style.fill = "grey";
            this.gridCord[Math.floor(a/6)+Math.floor(b/30)].obstacle = 1;
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


  //choose obstacle
  chooseColor(a: number, b: number, r: number): void {
    //console.log(a,b,r);
    //console.log('hello');
    let element = document.getElementsByTagName('rect')[Math.floor(a/6)+Math.floor(b/30)];
    //window.alert("Hello There");
    //let value:number = window.prompt("Please enter obstacle %");
    //console.log(value);
    //element.style.fill = "rgb(256, 0, 0,value/100)";
  }
  //start q-learning search
  rl_reset(): void{
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        this.gridCord[5 * i + j] = {x: i * 30, y: j * 30, obstacle: 0};

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
    let visited: boolean[] = new Array();
    let parent: object;
    parent = {};
    for(let j=0;j<25;j++){
      visited[j]=(false);
    }
    var qu = new Array();
    visited[this.start]= true;
    this.distance[this.start] = 0;
    qu.push(this.start);
    while(qu.length != 0){
      var s =   qu[0];
      qu.shift();
      var arr = this.direction_vector(s);
      for(let u of arr){
        if (!visited[u]){
          visited[u]= true;
          this.distance[u]=this.distance[s]+1;
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
        
          let element = document.getElementsByTagName('rect')[u];
          // element.innerHTML. : ;
          element.style.fill = "yellow";
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
    if(a+5 < 25 && this.gridCord[a+5].obstacle!=1){
      arr.push(a+5);
    }
    if(a-5 >= 0 && this.gridCord[a-5].obstacle!=1){
      arr.push(a-5);
    }
    if((a+1)%5 !=0 && a+1 < 25 && this.gridCord[a+1].obstacle!=1){
      arr.push(a+1);
    }
    if((a)%5 !=0 && a-1>=0 && this.gridCord[a-1].obstacle!=1){
      arr.push(a-1);
    }
    return arr;
  }  

}
