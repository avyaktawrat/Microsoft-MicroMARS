import { FirstComponent } from './first.component';
import {utils } from './utils';
import { GridCoords } from './GridCoords';
import {hGrid, vGrid, totalGrid} from './constants'

let Utils: utils = new utils();

export class BiBFS{

  public steps: number = 0;
  public length: number = 0;
  public time: string = '0';
  bidirecNodeS:number = -1;  // variable to store node location where forward bidirec ends
  bidirecNodeE:number = -1;  // node where backward bidrec ends // used in tracing path

  public search(start:number, end:number,gridCord: GridCoords[] ,allowDiag:boolean,notCrossCorner:boolean):void {
  	let milli = performance.now();
    let distance: number[] = new Array();
    let stop :boolean = false;
    var quS = new Array();
    var quE = new Array();

    var openBy : number[] = new Array();
    const byStart : number = 1;
	const byEnd : number = 2;


    for (var i = 0; i < totalGrid; ++i) {
    	openBy[i] = 0;
    }

    quS.push(start);
    quE.push(end);

    while(quS.length!= 0 && quS.length!= 0){

			if(quS.length!=0){    
				// console.log(quS);
				var currentNodeS  = quS.shift();
				gridCord[currentNodeS].visited = true;
				// visitedS[currentNodeS] = true;
				var arrS = Utils.direction8_vector(currentNodeS,gridCord,allowDiag,notCrossCorner);
			  // console.log(arrS);
			  for(let u of arrS){
					if(!(openBy[u]===byStart)){
					
						if((u == end || openBy[u]===byEnd)){	
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
							this.bidirecNodeE=u;
						  	this.bidirecNodeS=currentNodeS;
							console.log(currentNodeS, gridCord[currentNodeS].parent, quE.shift());
							break;
						}
						openBy[u] = byStart;
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
	    	var arrE = Utils.direction8_vector(currentNodeE,gridCord,allowDiag,notCrossCorner);
	      for(let u of arrE){
  				if(!(openBy[u] === byEnd)){
  					gridCord[u].open = true;
  					if(u == start || openBy[u]===byStart){
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
						  this.bidirecNodeS=u;
						  this.bidirecNodeE=currentNodeE;
						  // console.log(currentNodeS,currentNodeE, gridCord[currentNodeE].parent, "loop 2");
  						break;
  						
  					}
  					openBy[u] = byEnd;
					gridCord[u].parent = currentNodeE;
  					quE.push(u);
  				}
  			}
    	}
    	
    	if(stop){
			//this.bidirecNodeS=currentNodeS;
			//this.bidirecNodeE=currentNodeE;
    		break;
    	}
    }
	}
}