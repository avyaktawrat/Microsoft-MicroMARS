import { GridCoords } from '../include/GridCoords';
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

 		astar.search( start,end,gridCoords,allowDiag,notCrossCorner,HeurBestFirst);
    this.steps = astar.steps;
    this.time = astar.time;

	}

	public biSearch(start:number, end:number,gridCoords: GridCoords[] ,allowDiag:boolean,notCrossCorner:boolean/*,req_step:number*/,heuristic? ): void{

 		function HeurBestFirst(a:number, b:number){
 			return heuristic(a,b)*1000000;
 		}
 		biastar.search( start,end,gridCoords,allowDiag,notCrossCorner,HeurBestFirst);
    this.steps = biastar.steps;
    this.time = biastar.time;
    this.bidirecNodeS = biastar.bidirecNodeS;
    this.bidirecNodeE = biastar.bidirecNodeE;
	}
}
