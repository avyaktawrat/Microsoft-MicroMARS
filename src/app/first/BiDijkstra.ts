import {utils } from './utils';
import { GridCoords } from './GridCoords';
import {hGrid, vGrid, totalGrid} from './constants'

let Utils: utils = new utils();


export class BiDjk{
  public steps :number = 0;
  public length1 :number= 0;
  public time :number = 0;
  bidirecNodeS:number = -1;  // variable to store node location where forward bidirec ends
  bidirecNodeE:number = -1;  // node where backward bidrec ends // used in tracing path

  public search(start:number, end:number,gridCord: GridCoords[] ,allowDiag:boolean,notCrossCorner:boolean/*, req_step:number*/):void {
  	var startOpenList : number[] = new Array();
  	var endOpenList : number[] = new Array();
  	// var startClosedList : number[] = new Array();
  	// var endClosedList : number[] = new Array();
  	var closedList : number[] = new Array();
 		let stop : boolean = false;
    var openBy : number[] = new Array();
    const byStart : number = 1;
		const byEnd : number = 2;
		let milli = performance.now();

    for (var i = 0; i < totalGrid; ++i) {
    	openBy[i] = 0;
    }

  	startOpenList.push(start);
  	gridCord[start].g = 0;
    

  	endOpenList.push(end);
  	gridCord[end].g = 0;
    
  	let currentNode :number;
  	console.log(startOpenList);
  	console.log(gridCord);
  	while(startOpenList.length != 0 && endOpenList.length!=0) {
  		
  	// 	if(this.steps == req_step){
			// 	// break;
			// }
			if(stop){
				break;
			}
    	var lowInd : number = 0;
    	function removeElement(array, elem) {
          var index = array.indexOf(elem);
          if (index > -1) {
              array.splice(index, 1);
          }
      }
      if(startOpenList.length != 0 && !stop) {
	      this.steps ++;
      	var lowInd : number = 0;
	      for(var i=0; i<startOpenList.length; i++) {
	        if(gridCord[startOpenList[i]].g < gridCord[startOpenList[lowInd]].g) {
	           lowInd = i;
	        }
	      }
	      currentNode = startOpenList[lowInd];
	      removeElement(startOpenList,currentNode);
	      gridCord[currentNode].visited = true;
	      // console.log(currentNode);
	      
	      closedList.push(currentNode);

	      var neighbors = Utils.direction8_vector(currentNode,gridCord,allowDiag,notCrossCorner);
	      for(let Coord of neighbors){
	      	if(closedList.includes(Coord) ){//already visited
	          continue;
	        }
	      	if(/*Coord == end || */openBy[Coord]===byEnd){
	      		let milli2 = performance.now();
		      	let node:number;
		      	// console.log(Coord);
	          node = currentNode;
	          while(node!=start && node!= end){
	          	// console.log(1);
	          	// console.log(node);
	            gridCord[node].isPath = true;
	            node = gridCord[node].parent;
	          }
	          node = Coord
	          while(node!=end && node!=start){
	          	// console.log(2);
	          	// console.log(node);
	            gridCord[node].isPath = true;
	            node = gridCord[node].parent;
	          }
			  stop = true;
			  this.bidirecNodeE=Coord;
			  this.bidirecNodeS=currentNode;
	          this.time =  (milli2-milli);
	      		break;
	      	}
	      	let ng = (((Math.round(currentNode/hGrid)-Math.round(Coord/hGrid) === 0 )|| ((currentNode%hGrid)-(Coord%hGrid) )===0 )? 1 : 1.4);
	      	// let ng = 1;
	        

	        if(openBy[Coord]==byStart  ){
	            // let a = startOpenList.indexOf(Coord);
	            if(gridCord[currentNode].g + ng  < gridCord[Coord].g){
	              gridCord[Coord].g = gridCord[currentNode].g + ng;
	              
	              gridCord[Coord].parent = currentNode;
	              openBy[Coord] = byStart;
	            }
	          }

	          else{ //seeing the node for first time
	            gridCord[Coord].g = gridCord[currentNode].g + ng;
	            
	          	gridCord[Coord].parent = currentNode;    
	            gridCord[Coord].open = true;
	            startOpenList.push(Coord);
	            openBy[Coord] = byStart;
	          }
	      }
			}

			if(endOpenList.length != 0 && !stop){
	      // currentNode = endOpenList.pop();
	      gridCord[currentNode].visited = true;
	      var lowInd : number = 0;
	      for(var i=0; i<endOpenList.length; i++) {
	        if(gridCord[endOpenList[i]].g < gridCord[endOpenList[lowInd]].g) {
	           lowInd = i;
	        }
	      }
	      currentNode = endOpenList[lowInd];
	      gridCord[currentNode].visited= true;
	      removeElement(endOpenList, currentNode);
	      closedList.push(currentNode);

	      
	      var neighbors = Utils.direction8_vector(currentNode,gridCord,allowDiag,notCrossCorner);
	      for(let Coord of neighbors){
	      	let ng = (((Math.round(currentNode/hGrid)-Math.round(Coord/hGrid) === 0 )|| ((currentNode%hGrid)-(Coord%hGrid) )===0 )? 1 : 1.4);
	      	// let ng = 1;
	        if(closedList.includes(Coord) ){//already visited
	          continue;
	        }

	        if(/*currentNode == start || */openBy[Coord]===byStart){
	        	let milli2 = performance.now();
		      	// console.log(Coord);
		      	let node:number;
	          node = currentNode;
	          while(node!=end && node!= start){
	          	// console.log(3);
	          	// console.log(node);
	            gridCord[node].isPath = true;
	            node = gridCord[node].parent;
	          }
	          node = Coord
	          while(node!=start&& node!= end ){
	          	// console.log(4);
	          	// console.log(node);
	            gridCord[node].isPath = true;
	            node = gridCord[node].parent;
	          }
			stop = true;
			this.bidirecNodeS=Coord;
			this.bidirecNodeE=currentNode;
	        this.time =  (milli2-milli);
	      	break;
	      }


	        if(openBy[Coord]==byEnd){
	            // let a = endOpenList.indexOf(Coord);
	            if(gridCord[currentNode].g + ng  < gridCord[Coord].g){
	              gridCord[Coord].g = gridCord[currentNode].g + ng;
	              gridCord[Coord].parent = currentNode;
	              openBy[Coord] = byEnd;
	            }
	          }

	          else{ //seeing the node for first time
	            gridCord[Coord].g = gridCord[currentNode].g + ng;
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