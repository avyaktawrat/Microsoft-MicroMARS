import {utils } from './utils';
import { GridCoords } from './GridCoords';
import {hGrid, vGrid, totalGrid} from './constants'

let Utils: utils = new utils();


export class BiAstar{
  public steps :number = 0;
  public length1 :number= 0;
  public time :string = "0";

  public search(gridCord: GridCoords[] ,start:number, end:number,allowDiag:boolean):void {
  	var startOpenList : number[] = new Array();
  	var endOpenList : number[] = new Array();
  	// var startClosedList : number[] = new Array();
  	// var endClosedList : number[] = new Array();
  	var closedList : number[] = new Array();
 
    var openBy : number[] = new Array();
    const byStart : number = 1;
		const byEnd : number = 2;

    for (var i = 0; i < totalGrid; ++i) {
    	openBy[i] = 0;
    }

  	startOpenList.push(start);
  	gridCord[start].h = this.distance(start , end); 
    gridCord[start].g = 0;
    gridCord[start].f = gridCord[start].h;

  	endOpenList.push(end);
  	gridCord[end].h = this.distance(start , end); 
    gridCord[end].g = 0;
    gridCord[end].f = gridCord[end].h;
  
  	let currentNode :number;

  	while(startOpenList.length != 0 && endOpenList.length!=0) {
    	var lowInd : number = 0;
    	function removeElement(array, elem) {
          var index = array.indexOf(elem);
          if (index > -1) {
              array.splice(index, 1);
          }
      }
      if(startOpenList.length != 0){
	      for(var i=0; i<startOpenList.length; i++) {
	        if(gridCord[startOpenList[i]].f <= gridCord[startOpenList[lowInd]].f) {
	           lowInd = i;
	        }
	      }
	      currentNode = startOpenList[lowInd];
	      gridCord[currentNode].visited = true;
	      console.log(currentNode);
	      if(closedList.includes(currentNode)){
	        continue;
	      }
	      
	      removeElement(startOpenList, currentNode);
	      closedList.push(currentNode);

	      if(currentNode == end || openBy[currentNode]===byEnd){
		      	let node:number;
	          node = gridCord[currentNode].parent;
	          while(node!=start){
	          	console.log(1);
	            gridCord[node].isPath = true;
	            node = gridCord[node].parent;
	          }
	          node = currentNode
	          while(node!=end){
	          	console.log(2);
	            gridCord[node].isPath = true;
	            node = gridCord[node].parent;
	          }
	      	break;
	      }

	      var neighbors = Utils.direction8_vector(currentNode,gridCord,allowDiag);
	      for(let Coord of neighbors){
	      	// let ng = (((Math.round(currentNode/hGrid)-Math.round(Coord/hGrid) === 0 )|| ((currentNode%hGrid)-(Coord%hGrid) )===0 )? 1 : 1.4);
	      	let ng = 1;
	        if(closedList.includes(Coord) ){//already visited
	          continue;
	        }

	        if(startOpenList.includes(Coord)){
	            let a = startOpenList.indexOf(Coord);
	            if(gridCord[currentNode].g + ng  < gridCord[startOpenList[a]].g){
	              gridCord[Coord].g = gridCord[currentNode].g + ng;
	              gridCord[Coord].h = this.distance(Coord,end);
	              gridCord[Coord].f = gridCord[Coord].h + gridCord[Coord].g;
	              gridCord[Coord].parent = currentNode;
	              openBy[Coord] = byStart;
	            }
	          }

	          else{ //seeing the node for first time
	            gridCord[Coord].g = gridCord[currentNode].g + ng;
	            gridCord[Coord].h = this.distance(Coord,end);
	            gridCord[Coord].f = gridCord[Coord].h + gridCord[Coord].g;
	            gridCord[Coord].parent = currentNode;    
	            gridCord[Coord].open = true;
	            startOpenList.push(Coord);
	            openBy[Coord] = byStart;
	          }
	      }
			}

			if(endOpenList.length != 0){
	      for(var i=1; i<endOpenList.length; i++) {
	        if(gridCord[endOpenList[i]].f <= gridCord[endOpenList[lowInd]].f) {
	           lowInd = i;
	        }
	      }
	      currentNode = endOpenList[lowInd];
	      gridCord[currentNode].visited = true;
	      console.log(currentNode);
	      if(closedList.includes(currentNode)){
	        continue;
	      }
	      
	      removeElement(endOpenList, currentNode);
	      closedList.push(currentNode);

	      if(currentNode == start || openBy[currentNode]===byStart){
		      	let node:number;
	          node = gridCord[currentNode].parent;
	          while(node!=start){
	          	console.log(1);
	            gridCord[node].isPath = true;
	            node = gridCord[node].parent;
	          }
	          node = currentNode
	          while(node!=end){
	          	console.log(2);
	            gridCord[node].isPath = true;
	            node = gridCord[node].parent;
	          }
	      	break;
	      }

	      var neighbors = Utils.direction8_vector(currentNode,gridCord,allowDiag);
	      for(let Coord of neighbors){
	      	// let ng = (((Math.round(currentNode/hGrid)-Math.round(Coord/hGrid) === 0 )|| ((currentNode%hGrid)-(Coord%hGrid) )===0 )? 1 : 1.4);
	      	let ng = 1;
	        if(closedList.includes(Coord) ){//already visited
	          continue;
	        }

	        if(endOpenList.includes(Coord)){
	            let a = endOpenList.indexOf(Coord);
	            if(gridCord[currentNode].g + ng  < gridCord[endOpenList[a]].g){
	              gridCord[Coord].g = gridCord[currentNode].g + ng;
	              gridCord[Coord].h = this.distance(Coord,end);
	              gridCord[Coord].f = gridCord[Coord].h + gridCord[Coord].g;
	              gridCord[Coord].parent = currentNode;
	              openBy[Coord] = byEnd;
	            }
	          }

	          else{ //seeing the node for first time
	            gridCord[Coord].g = gridCord[currentNode].g + ng;
	            gridCord[Coord].h = this.distance(Coord,end);
	            gridCord[Coord].f = gridCord[Coord].h + gridCord[Coord].g;
	            gridCord[Coord].parent = currentNode;    
	            gridCord[Coord].open = true;
	            endOpenList.push(Coord);
	            openBy[Coord] = byEnd;
	          }
	      }
			}
			
      
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
}