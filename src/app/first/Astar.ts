import {utils } from './utils';
import { GridCoords } from './GridCoords';
import {hGrid, vGrid, totalGrid} from './constants'

let Utils: utils = new utils();

interface Pair {
  coord: number;
  weight: number;
}

export class Astar{

  public steps :number = 0;
  public length1 :number= 0;
  public time :string = "0";

  

  public search(gridCord: GridCoords[] ,start:number, end:number,allowDiag:boolean):void {
    let milli = performance.now();
    var openList = new Array();
    var closedList = new Array();

    openList.push(start);

    gridCord[start].h = this.distance(start , end); 
    gridCord[start].g = 0;
    gridCord[start].f = gridCord[start].h;
    
    let currentNode :number;

    while(openList.length != 0) {
      this.steps ++;

      //select least f if same f then find least h
      var lowInd : number = 0;
      for(var i=0; i<openList.length; i++) {
        if(gridCord[openList[i]].f <= gridCord[openList[lowInd]].f) {
           lowInd = i;
        }
      }
      var lowIndH : number = lowInd;
      for(var i=0; i<openList.length; i++) {
        if(gridCord[openList[i]].f <= gridCord[openList[lowInd]].f){
          if(gridCord[openList[i]].h <= gridCord[openList[lowIndH]].h){
            lowIndH = i;
          }
        }
      }
      currentNode = openList[lowIndH];
      gridCord[currentNode].visited = true;

      if(closedList.includes(currentNode)){
        continue;
      }

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
          node = gridCord[currentNode].parent;
          while(node!=start){
            gridCord[node].isPath = true;

            node = gridCord[node].parent;
            this.length1 ++;
           }
          this.length1++;
          let milli2 = performance.now();
          this.time =  (milli2-milli).toFixed(3);
          break;
      }

      //find neighbors

      let neighbors = new Array<Pair>() ;
      neighbors = this.direction8_vector(currentNode,gridCord,allowDiag);
      // console.log(neighbors);
      for (var i = 0; i < neighbors.length; ++i) {
        let Coord  = neighbors[i].coord;

        let ng = (((Math.round(currentNode/hGrid)-Math.round(Coord/hGrid) === 0 )|| ((currentNode%hGrid)-(Coord%hGrid) )===0 )? 1 : 1.4);
        // let ng :number= 0;
        if(closedList.includes(Coord) ){//already visited
          continue;
        }

          if(openList.includes(Coord)){
            let a = openList.indexOf(Coord);
            if(gridCord[currentNode].g + ng+neighbors[i].weight  < gridCord[openList[a]].g){
              gridCord[Coord].g = gridCord[currentNode].g + ng+ neighbors[i].weight;
              gridCord[Coord].h = this.distance(Coord,end);
              gridCord[Coord].f = gridCord[Coord].h + gridCord[Coord].g;
              gridCord[Coord].parent = currentNode;
            }
          }

          else{ //seeing the node for first time
            gridCord[Coord].g = gridCord[currentNode].g + ng +neighbors[i].weight;
            gridCord[Coord].h = this.distance(Coord,end);
            gridCord[Coord].f = gridCord[Coord].h + gridCord[Coord].g;
            gridCord[Coord].parent = currentNode;    
            gridCord[Coord].open = true;
            openList.push(Coord);
          }
      
        }
    // if(this.steps == reqstep){
    //   // this.update_FGH(gridCord,f,g,h);
    //   // console.log(parent);
    //   break;
    // }

    }
  }
 
  
  distance(a: number, b:number ): number {
    var x1 = Math.round(a/hGrid);
    var y1 = a%hGrid;
    var x2 = Math.round(b/hGrid);
    var y2 = b%hGrid;
    let dist = Math.abs(x1-x2) + Math.abs(y1-y2);
    return dist;
  }


 // update_FGH(gridCord: GridCoords[], f:Array<number> , g:Array<number> ,h:Array<number> ) :void{
 //     for (let i = 0; i < vGrid; i++) {
 //      for (let j = 0; j < hGrid; j++) {
 //        gridCord[i*hGrid+j].f = f[i*hGrid+j];
 //        gridCord[i*hGrid+j].g = g[i*hGrid+j];
 //        gridCord[i*hGrid+j].h = h[i*hGrid+j];
 //      }
 //    }
 //  }

direction8_vector(a: number, gridCord: GridCoords[], allowDiag: boolean): Array<Pair>{
    var arr = new Array<Pair>();
    
    if((a)%hGrid !=0 && a-1>=0){ //up
      let vector = {coord : 0, weight:0};
      vector.coord = a-1;
      vector.weight = this.calWeight(gridCord,vector.coord,a);
      arr.push(vector);
    }
    if ( a+hGrid < totalGrid){  //right
      let vector = {coord : 0, weight:0};
      vector.coord = a+hGrid;
      vector.weight = this.calWeight(gridCord,vector.coord,a);
      arr.push(vector);
    }

    if((a+1)%hGrid !=0 && a+1 < totalGrid){ //down
      let vector = {coord : 0, weight:0};
      vector.coord = a+1;
      vector.weight = this.calWeight(gridCord,vector.coord,a);
      arr.push(vector);
    }

    if(a-hGrid >= 0 ){ //left
      let vector = {coord : 0, weight:0};
      vector.coord = a-hGrid;
      vector.weight = this.calWeight(gridCord,vector.coord,a);
      arr.push(vector);
    }


    if((a)%hGrid !=0 && a-1>=0 && a+hGrid < totalGrid && allowDiag){ //right up
      let vector = {coord : 0, weight:0};
      vector.coord = a-1+hGrid;
      vector.weight = this.calWeight(gridCord,vector.coord,a);
      arr.push(vector);
    }

    if ( a+hGrid < totalGrid && (a+1)%hGrid !=0 && a+1 < totalGrid  && allowDiag){  //right down
      let vector = {coord : 0, weight:0};
      vector.coord = a+1+hGrid;
      vector.weight = this.calWeight(gridCord,vector.coord,a);
      arr.push(vector);
    }

    if((a+1)%  hGrid !=0 && a-hGrid >= 0 && a+1 < totalGrid && allowDiag){ //down left
      let vector = {coord : 0, weight:0};
      vector.coord = a+1-hGrid;
      vector.weight = this.calWeight(gridCord,vector.coord,a);
      arr.push(vector);
    }

    if(a-hGrid >= 0 && (a)%hGrid !=0 && a-1>=0 && allowDiag){ //left up
      let vector = {coord : 0, weight:0};
      vector.coord = a-1-hGrid;
      vector.weight = this.calWeight(gridCord,vector.coord,a);
      arr.push(vector);
    }

    return arr;
  }
  calWeight(gridCord: GridCoords[],a:number , b:number) : number{
    // console.log(a);
    let weight = 0.1*Math.abs(gridCord[a].value - gridCord[b].value) ;
    return  weight;
  }


}
