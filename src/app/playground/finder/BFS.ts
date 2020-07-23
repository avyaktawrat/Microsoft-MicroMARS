import {utils } from '../include/utils';
import { GridCoords } from '../include/GridCoords';
import {DPair} from '../include/adj';

let Utils: utils = new utils();

export class BFS{

  public steps: number = 0;
  public time: number = 0;

  public search(start: number, end: number, gridCoords?: GridCoords[], allowDiag?: boolean,notCrossCorner?:boolean,adj?: Array<Array<DPair>>): void {

    let milli = performance.now();
    let distance: number[] = new Array();
    let stop :boolean = false;
    let qu = new Array();
    gridCoords[start].visited = true;
    distance[start] = 0;
    qu.push(start);
    while(qu.length != 0){
      this.steps ++;
      let s =   qu[0];
      qu.shift();
      gridCoords[s].visited= true;
      let arr = Utils.direction8_vector(s,gridCoords,allowDiag, notCrossCorner);
      for(let u of arr){
        if (!gridCoords[u].open  && ! stop){

          gridCoords[u].open= true;
          distance[u]=distance[s]+1;
          gridCoords[u].parent = s;

          if (u == end){
            let node:number;
            node = s;
            while(node!=start){
              gridCoords[node].isPath = true;
              node = gridCoords[node].parent;
            }
            this.time = (performance.now()-milli);
            stop = true;
            break;
          }
          qu.push(u);

        }
      }
      if(stop){
        break;
      }
    }
	}
}


