import {utils } from './utils';
import { GridCoords } from './GridCoords';
import {hGrid, vGrid, totalGrid} from './constants'

let Utils :utils = new utils();  

export class Astar{

  public steps :number = 0;
  public length1 :number= 0;
  public time :string = "0";

  public search(gridCord: GridCoords[] ,start:number, end:number,allowDiag:boolean):void {
    
    Utils.reset_color(gridCord,start,end);
    let milli = performance.now();
    var openList = new Array();
    var closedList = new Array();
    var f = new Array();
    var g = new Array();
    var h = new Array();
    let parent: object;
    parent = {};

    openList.push(start);
    h[start] = this.distance(start , end);
    g[start] = 0;
    f[start] = g[start] + h[start];
    let currentNode :number;

    while(openList.length != 0) {
      this.steps ++;
      //select least f if same f then find least h
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

      if(currentNode == end){   //end found
          let node:number;
          node = parent[currentNode];//parent[u]
          while(node!=start){
            let element = document.getElementsByTagName('rect')[node];
            element.style.fill = "orange";
            node = parent[node];
            this.length1 ++;
          }
          this.length1++;
          let milli2 = performance.now();
          this.time =  (milli2-milli).toFixed(3);
          break;
      }

      //find neighbors
      var neighbors = Utils.direction8_vector(currentNode,gridCord,allowDiag);

      for (let u of neighbors){

        if(closedList.includes(u)){//already visited
          continue;
        }

        g[u] = g[currentNode] + this.distance(currentNode,u);
        h[u] = this.distance(u,end);
        f[u] = g[u] + h[u];

        if(openList.includes(u)){
          let a = openList.indexOf(u);
          if(g[u] > g[openList[a]]){
            continue;
          }
          
        }
        else{
          if(u != end){
            let element = document.getElementsByTagName('rect')[u];
            element.style.fill = "yellow";

          }
          parent[u] = currentNode;
          openList.push(u);
        }
      }
    }
  }  

  distance(a: number, b:number ): number {
    // console.log(a,b);
    // let init : FirstComponentComponent = new FirstComponentComponent();
   
    var x1 = (a/hGrid);
    var y1 = a%hGrid;
    var x2 = (b/hGrid);
    var y2 = b%hGrid;
    // console.log("h v "+ this.hGrid + " "+ this.vGrid);
    // console.log("x1 x2 =" + x1 + " "+x2 + " y1 y2 " + y1 +" " + y2);
    let dist = Math.abs(x1-x2) + Math.abs(y1-y2);
    return dist;
  }


 // update_FGH( f:Array<number> , g:Array<number> ,h:Array<number> ) :void{
 //     for (let i = 0; i < this.vGrid; i++) {
 //      for (let j = 0; j < this.hGrid; j++) {
 //        this.gridCord[i*this.hGrid+j].f = f[i*this.hGrid+j];
 //        this.gridCord[i*this.hGrid+j].g = g[i*this.hGrid+j];
 //        this.gridCord[i*this.hGrid+j].h = h[i*this.hGrid+j]; 
 //      }
 //    } 
 //  }



}