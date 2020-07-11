import {utils } from './utils';
import { GridCoords } from './GridCoords';
import {hGrid, vGrid, totalGrid} from './constants'

let Utils: utils = new utils();

export class BiBFS{

  public steps: number = 0;
  public length: number = 0;
  public time: string = '0';

  public search(gridCord: GridCoords[] ,start:number, end:number,allowDiag:boolean):void {
  	let milli = performance.now();
    let distance: number[] = new Array();
    let stop :boolean = false;
    var quS = new Array();
    var quE = new Array();

    var visitedS : boolean[] = new Array();
    var visitedE : boolean[] = new Array();

    for (var i = 0; i < totalGrid; ++i) {
    	visitedE[i] = false;
    	visitedS[i] = false;
    }

    quS.push(start);
    quE.push(end);

    while(quS.length!= 0 && quS.length!= 0){

			if(quS.length!=0){    
				// console.log(quS);
				var currentNodeS  = quS.shift();
				gridCord[currentNodeS].visited = true;
				// visitedS[currentNodeS] = true;
				var arrS = Utils.direction8_vector(currentNodeS,gridCord,allowDiag);
			  // console.log(arrS);
			  for(let u of arrS){
					if((u == end || visitedE[u])){	
						console.log(gridCord[u]);
						let node:number;					
						node = u;
						while(node!=end){
              gridCord[node].isPath = true;
              node = gridCord[node].parent;
          	}
          	node=currentNodeS;
          	while(node!=start){
              gridCord[node].isPath = true;
              node = gridCord[node].parent;
          	}
          	
						stop= true;
						break;
					}
					if(!visitedS[u]){
						visitedS[u] = true;
						gridCord[u].open = true;
						gridCord[u].parent = currentNodeS;
						quS.push(u);
					}
				}
			}

	    if(quE.length!=0  ){    
	    	var currentNodeE  = quE.shift();
	    	gridCord[currentNodeE].visited = true;
	    	// visitedE[currentNodeE] = true;
	    	var arrE = Utils.direction8_vector(currentNodeE,gridCord,allowDiag);
	      for(let u of arrE){
  				if(!visitedE[u]){
  					visitedE[u] = true;
  					gridCord[u].open = true;
  					if(u == start || visitedS[u]){
  						let node:number;					
							node = u;
							while(node!=start){
	              gridCord[node].isPath = true;
	              node = gridCord[node].parent;
	          	}
	          	node=currentNodeE;
	          	while(node!=end){
	              gridCord[node].isPath = true;
	              node = gridCord[node].parent;
	          	}
  						stop= true;
  						break;
  						
  					}
						gridCord[u].parent = currentNodeE;
  					quE.push(u);
  				}
  			}
    	}
    	if(stop){
    		break;
    	}
    }
	}
}