import { GridCoords } from './GridCoords';
import { Astar } from './Astar' ;
import { BiAstar } from './BiAstar' ;

const astar: Astar = new Astar();
const biastar: BiAstar = new BiAstar();

export class BestFirst{
  public steps :number = 0;
  public length1 :number= 0;
  public time :number = 0;
  bidirecNodeS:number = -1;  // variable to store node location where forward bidirec ends
  bidirecNodeE:number = -1;  // node where backward bidrec ends // used in tracing
 	public search(start:number, end:number,gridCoords: GridCoords[] ,allowDiag:boolean,notCrossCorner:boolean/*,req_step:number*/,heuristic? ):void {

 		function HeurBestFirst(a:number, b:number){
 			return heuristic(a,b)*1000000;
 		}

 		astar.search( start,end,gridCoords,allowDiag,notCrossCorner/*,this.req_step*/,HeurBestFirst);
    this.steps = astar.steps;
    // this.length1 = astar.length1;
    this.time = astar.time;

	}

	public biSearch(start:number, end:number,gridCoords: GridCoords[] ,allowDiag:boolean,notCrossCorner:boolean/*,req_step:number*/,heuristic? ): void{

 		function HeurBestFirst(a:number, b:number){
 			return heuristic(a,b)*1000000;
 		}
 		// console.log("bi best");
 		biastar.search( start,end,gridCoords,allowDiag,notCrossCorner/*,this.req_step*/,HeurBestFirst);
    this.steps = biastar.steps;
    // this.length1 = biastar.length1;
    this.time = biastar.time;
    this.bidirecNodeS = biastar.bidirecNodeS;
    this.bidirecNodeE = biastar.bidirecNodeE;


	}

}
