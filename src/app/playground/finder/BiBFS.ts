import {utils } from '../include/utils';
import { GridCoords } from '../include/GridCoords';
import {totalGrid} from '../include/constants'

let Utils: utils = new utils();

export class BiBFS{

  public steps: number = 0;
  public time: number = 0;
  bidirecNodeS:number = -1;  // letiable to store node location where forward bidirec ends
  bidirecNodeE:number = -1;  // node where backward bidrec ends // used in tracing path

  public search(start:number, end:number,gridCord: GridCoords[] ,allowDiag:boolean,notCrossCorner:boolean):void {
  	let milli = performance.now();
    let stop :boolean = false;
    let quS = new Array();
    let quE = new Array();

    let openBy : number[] = new Array();
    const byStart : number = 1;
	const byEnd : number = 2;


    for (let i = 0; i < totalGrid; ++i) {
    	openBy[i] = 0;
    }

    quS.push(start);
    quE.push(end);

    while(quS.length!= 0 && quS.length!= 0){
    	this.steps++;
			if(quS.length!=0){
				let currentNodeS  = quS.shift();
				gridCord[currentNodeS].visited = true;
				let arrS = Utils.direction8_vector(currentNodeS,gridCord,allowDiag,notCrossCorner);
			  for(let u of arrS){
					if(!(openBy[u]===byStart)){

						if((u == end || openBy[u]===byEnd)){
							this.time = performance.now()-milli;
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
	    	let currentNodeE  = quE.shift();
	    	gridCord[currentNodeE].visited = true;
	    	let arrE = Utils.direction8_vector(currentNodeE,gridCord,allowDiag,notCrossCorner);
	      for(let u of arrE){
  				if(!(openBy[u] === byEnd)){
  					gridCord[u].open = true;
  					if(u == start || openBy[u]===byStart){
							this.time = performance.now()-milli;
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
  						break;

  					}
  					openBy[u] = byEnd;
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
