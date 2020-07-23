import {utils } from '../include/utils';
import { GridCoords } from '../include/GridCoords';
import {hGrid, totalGrid} from '../include/constants';
import { DPair } from '../include/adj';

let Utils: utils = new utils();

interface Pair {
  coord: number;
  weight: number;
}

export class Astar{

  public steps :number = 0;
  public time :number = 0;

  public Wsearch(start: number, end: number, gridCoords?: GridCoords[], allowDiag?: boolean,notCrossCorner?:boolean, adj?: Array<Array<DPair>>,heuristic?):void {

    let milli = performance.now();
    let openList = new Array();
    let closedList = new Array();
    
    function removeElement(array, elem) {
        let index = array.indexOf(elem);
        if (index > -1) {
            array.splice(index, 1);
        }
    }

    if(heuristic == null){  //default heuristic 
      heuristic = Utils.Manhattan;
    }

    openList.push(start);

    gridCoords[start].h = heuristic(start , end);
    gridCoords[start].g = 0;
    gridCoords[start].f = gridCoords[start].h;

    let currentNode: number;

    while(openList.length != 0) {
      this.steps ++;

      //select least f
      let leastF : number = openList[0];
      for (let node of openList){
        if(gridCoords[node].f < gridCoords[leastF].f ){
          leastF = node;
        }
      }
      currentNode = leastF;
      gridCoords[currentNode].visited = true;

      if(closedList.includes(currentNode)){
        continue;
      }

      //remove currentNode from openList
      removeElement(openList, currentNode);

      closedList.push(currentNode);

      if(currentNode == end){   //end found
          let milli2 = performance.now();
          let node:number;

          node = gridCoords[currentNode].parent;
          while(node!=start){
            gridCoords[node].isPath = true;
            node = gridCoords[node].parent;
          }
          this.time =  (milli2-milli);
          break;
      }

      //find neighbors

      let neighbors = new Array<Pair>() ;
      neighbors = this.direction8_vector(currentNode,gridCoords,allowDiag);
      for (let i = 0; i < neighbors.length; ++i) {
        let Coord  = neighbors[i].coord;

        let ng = (((Math.round(currentNode/hGrid)-Math.round(Coord/hGrid) === 0 )|| ((currentNode%hGrid)-(Coord%hGrid) )===0 )? 1 : 1.4);
        if(closedList.includes(Coord) ){//already visited
          continue;
        }

        if(openList.includes(Coord)){
          if(gridCoords[currentNode].g + ng+neighbors[i].weight  < gridCoords[Coord].g){
            gridCoords[Coord].g = gridCoords[currentNode].g + ng +neighbors[i].weight;
            gridCoords[Coord].h = heuristic(Coord,end);
            gridCoords[Coord].f = gridCoords[Coord].h + gridCoords[Coord].g;
            gridCoords[Coord].parent = currentNode;
          }
        }

        else{ //seeing the node for first time
          gridCoords[Coord].g = gridCoords[currentNode].g + ng +neighbors[i].weight;
          gridCoords[Coord].h = heuristic(Coord,end);
          gridCoords[Coord].f = gridCoords[Coord].h + gridCoords[Coord].g;
          gridCoords[Coord].parent = currentNode;
          gridCoords[Coord].open = true;
          openList.push(Coord);
        }
      }
    }
  }

  public search(start:number, end:number,gridCoords: GridCoords[] ,allowDiag:boolean,notCrossCorner:boolean/*,req_step:number*/,heuristic? ):void {
    let milli = performance.now();
    let openList = new Array();
    let closedList = new Array();

    function removeElement(array, elem) {
          let index = array.indexOf(elem);
          if (index > -1) {
              array.splice(index, 1);
          }
    }
    if(heuristic == null){
      heuristic = Utils.Manhattan;
    }
    openList.push(start);

    gridCoords[start].h = heuristic(start , end);
    gridCoords[start].g = 0;
    gridCoords[start].f = gridCoords[start].h;

    let currentNode :number;

    while(openList.length != 0) {
      this.steps ++;

      //select least f
      let leastF : number = openList[0];
      for (let node of openList){
        if(gridCoords[node].f < gridCoords[leastF].f ){ // "=" and see magic 
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
      
      removeElement(openList, currentNode);

      //add currentNode to openList
      closedList.push(currentNode);

      if(currentNode == end){   //end found
          let milli2 = performance.now();
          let node:number;
          node = gridCoords[currentNode].parent;
          while(node!=start){
            gridCoords[node].isPath = true;
            node = gridCoords[node].parent;

           }
          this.time =  (milli2-milli);
          break;
      }

      //find neighbors
      let neighbors = Utils.direction8_vector(currentNode,gridCoords,allowDiag,notCrossCorner);
      for (let Coord of neighbors) {

        let ng = (((Math.round(currentNode/hGrid)-Math.round(Coord/hGrid) === 0 )|| ((currentNode%hGrid)-(Coord%hGrid) )===0 )? 1 : 1.4);

        if(closedList.includes(Coord) ){//already visited
          continue;
        }

        if(openList.includes(Coord)){
          if(gridCoords[currentNode].g + ng  < gridCoords[Coord].g){
            gridCoords[Coord].g = gridCoords[currentNode].g + ng;
            gridCoords[Coord].h = heuristic(Coord,end);
            gridCoords[Coord].f = gridCoords[Coord].h + gridCoords[Coord].g;
            gridCoords[Coord].parent = currentNode;
          }
        }

        else{ //seeing the node for first time
          gridCoords[Coord].g = gridCoords[currentNode].g + ng;
          gridCoords[Coord].h = heuristic(Coord,end);
          gridCoords[Coord].f = gridCoords[Coord].h + gridCoords[Coord].g;
          gridCoords[Coord].parent = currentNode;
          gridCoords[Coord].open = true;
          openList.push(Coord);
        }
      }
    }
  }

  direction8_vector(a: number, gridCoords: GridCoords[], allowDiag: boolean): Array<Pair>{
    let arr = new Array<Pair>();

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
    let weight = 0.05*Math.abs(gridCoords[a].value - gridCoords[b].value*0) ;
    return  weight;
  }
}