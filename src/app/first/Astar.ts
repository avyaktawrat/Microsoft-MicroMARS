import {utils } from './utils';
import { GridCoords } from './GridCoords';
import {hGrid, vGrid, totalGrid} from './constants';
import { DPair } from './adj';

let Utils: utils = new utils();

interface Pair {
  coord: number;
  weight: number;
}

export class Astar{

  public steps :number = 0;
  public length1 :number= 0;
  public time :string = "0";
  public path = new Array();

  public Wsearch(start: number, end: number, gridCoords?: GridCoords[], allowDiag?: boolean,notCrossCorner?:boolean, adj?: Array<Array<DPair>>):void {
    let milli = performance.now();
    var openList = new Array();
    var closedList = new Array();
    

    openList.push(start);
    gridCoords[start].h = Utils.distance(start , end);
    gridCoords[start].g = 0;
    gridCoords[start].f = gridCoords[start].h;

    let currentNode: number;

    while(openList.length != 0) {
      this.steps ++;

      //select least f 
      var leastF : number = openList[0];
      for (let node of openList){
        if(gridCoords[node].f < gridCoords[leastF].f ){
          leastF = node;
        }
      }
      // currentNode = openList[lowInd];
      currentNode = leastF;
      gridCoords[currentNode].visited = true;

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
          let milli2 = performance.now();
          let node:number;
          this.path.push(currentNode);
          node = gridCoords[currentNode].parent;
          while(node!=start){
            gridCoords[node].isPath = true;
            this.path.push(node);
            node = gridCoords[node].parent;            
          }
          this.path.push(start);
          this.path = this.path.reverse();
          this.time =  (milli2-milli).toFixed(3);
          break;
      }

      //find neighbors

      let neighbors = new Array<Pair>() ;
      neighbors = this.direction8_vector(currentNode,gridCoords,allowDiag);
      // console.log(neighbors);
      for (var i = 0; i < neighbors.length; ++i) {
        let Coord  = neighbors[i].coord;

        let ng = (((Math.round(currentNode/hGrid)-Math.round(Coord/hGrid) === 0 )|| ((currentNode%hGrid)-(Coord%hGrid) )===0 )? 1 : 1.4);
        // let ng :number= 0;
        if(closedList.includes(Coord) ){//already visited
          continue;
        }

          if(openList.includes(Coord)){
            if(gridCoords[currentNode].g + ng+neighbors[i].weight  < gridCoords[Coord].g){
              gridCoords[Coord].g = gridCoords[currentNode].g + ng +neighbors[i].weight;
              gridCoords[Coord].h = Utils.distance(Coord,end);
              gridCoords[Coord].f = gridCoords[Coord].h + gridCoords[Coord].g;
              gridCoords[Coord].parent = currentNode;
            }
          }

          else{ //seeing the node for first time
            gridCoords[Coord].g = gridCoords[currentNode].g + ng +neighbors[i].weight;
            gridCoords[Coord].h = Utils.distance(Coord,end);
            gridCoords[Coord].f = gridCoords[Coord].h + gridCoords[Coord].g;
            gridCoords[Coord].parent = currentNode;    
            gridCoords[Coord].open = true;
            openList.push(Coord);
          }
        }
    // if(this.steps == req_step){
    //   break;
    // }

    }
  }

  public search(start:number, end:number,gridCoords: GridCoords[] ,allowDiag:boolean,notCrossCorner:boolean/*,req_step:number*/):void {
    let milli = performance.now();
    var openList = new Array();
    var closedList = new Array();
    

    openList.push(start);

    gridCoords[start].h = Utils.distance(start , end); 
    gridCoords[start].g = 0;
    gridCoords[start].f = gridCoords[start].h;
    
    let currentNode :number;

    while(openList.length != 0) {
      this.steps ++;

      //select least f 
      var leastF : number = openList[0];
      for (let node of openList){
        if(gridCoords[node].f < gridCoords[leastF].f ){ // "=" for a reason
          leastF = node;
        }
      }
      // currentNode = openList[lowInd];
      currentNode = leastF ;
      gridCoords[currentNode].visited = true;

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
          let milli2 = performance.now();
          let node:number;
          this.path.push(currentNode);
          node = gridCoords[currentNode].parent;
          while(node!=start){
            gridCoords[node].isPath = true;
            this.path.push(node);
            node = gridCoords[node].parent;
            
           }
          this.path.push(start);
          this.path = this.path.reverse();
          this.time =  (milli2-milli).toFixed(3);
          break;
      }

      //find neighbors

      // let neighbors = new Array<Pair>() ;
      let neighbors = Utils.direction8_vector(currentNode,gridCoords,allowDiag,notCrossCorner);
      // console.log(neighbors);
      for (var Coord of neighbors) {

        let ng = (((Math.round(currentNode/hGrid)-Math.round(Coord/hGrid) === 0 )|| ((currentNode%hGrid)-(Coord%hGrid) )===0 )? 1 : 1.4);
        // let ng :number= 1;
        if(closedList.includes(Coord) ){//already visited
          continue;
        }

          if(openList.includes(Coord)){
            if(gridCoords[currentNode].g + ng  < gridCoords[Coord].g){
              gridCoords[Coord].g = gridCoords[currentNode].g + ng;
              gridCoords[Coord].h = Utils.distance(Coord,end);
              gridCoords[Coord].f = gridCoords[Coord].h + gridCoords[Coord].g;
              gridCoords[Coord].parent = currentNode;
            }
          }

          else{ //seeing the node for first time
            gridCoords[Coord].g = gridCoords[currentNode].g + ng;
            gridCoords[Coord].h = Utils.distance(Coord,end);
            gridCoords[Coord].f = gridCoords[Coord].h + gridCoords[Coord].g;
            gridCoords[Coord].parent = currentNode;    
            gridCoords[Coord].open = true;
            openList.push(Coord);
          }
        }
    // if(this.steps == req_step){
    //   break;
    // }

    }
  }



direction8_vector(a: number, gridCoords: GridCoords[], allowDiag: boolean): Array<Pair>{
    var arr = new Array<Pair>();

    if((a)%hGrid !=0 && a-1>=0){ //up
      let vector = {coord : 0, weight:0};
      vector.coord = a-1;
      vector.weight = this.calWeight(gridCoords,vector.coord,a);
      arr.push(vector);
    }
    if ( a+hGrid < totalGrid){  //right
      let vector = {coord : 0, weight:0};
      vector.coord = a+hGrid;
      vector.weight = this.calWeight(gridCoords,vector.coord,a);
      arr.push(vector);
    }

    if((a+1)%hGrid !=0 && a+1 < totalGrid){ //down
      let vector = {coord : 0, weight:0};
      vector.coord = a+1;
      vector.weight = this.calWeight(gridCoords,vector.coord,a);
      arr.push(vector);
    }

    if(a-hGrid >= 0 ){ //left
      let vector = {coord : 0, weight:0};
      vector.coord = a-hGrid;
      vector.weight = this.calWeight(gridCoords,vector.coord,a);
      arr.push(vector);
    }


    if((a)%hGrid !=0 && a-1>=0 && a+hGrid < totalGrid && allowDiag){ //right up
      let vector = {coord : 0, weight:0};
      vector.coord = a-1+hGrid;
      vector.weight = this.calWeight(gridCoords,vector.coord,a);
      arr.push(vector);
    }

    if ( a+hGrid < totalGrid && (a+1)%hGrid !=0 && a+1 < totalGrid  && allowDiag){  //right down
      let vector = {coord : 0, weight:0};
      vector.coord = a+1+hGrid;
      vector.weight = this.calWeight(gridCoords,vector.coord,a);
      arr.push(vector);
    }

    if((a+1)%  hGrid !=0 && a-hGrid >= 0 && a+1 < totalGrid && allowDiag){ //down left
      let vector = {coord : 0, weight:0};
      vector.coord = a+1-hGrid;
      vector.weight = this.calWeight(gridCoords,vector.coord,a);
      arr.push(vector);
    }

    if(a-hGrid >= 0 && (a)%hGrid !=0 && a-1>=0 && allowDiag){ //left up
      let vector = {coord : 0, weight:0};
      vector.coord = a-1-hGrid;
      vector.weight = this.calWeight(gridCoords,vector.coord,a);
      arr.push(vector);
    }

    return arr;
  }
  calWeight(gridCoords: GridCoords[],a:number , b:number) : number{
    // console.log(a);
    let weight = 0.1*Math.abs(gridCoords[a].value - gridCoords[b].value) ;
    return  weight;
  }


}
