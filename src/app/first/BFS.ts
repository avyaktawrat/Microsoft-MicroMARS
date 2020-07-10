import {utils } from './utils';
import { GridCoords } from './GridCoords';
import {hGrid, vGrid, totalGrid} from './constants'

let Utils: utils = new utils();

export class BFS{

  public steps: number = 0;
  public length1: number = 0;
  public time: string = '0';

  public search(gridCord: GridCoords[] ,start:number, end:number,allowDiag:boolean):void {

    let milli = performance.now();
    let distance: number[] = new Array();
    let stop :boolean = false;
    var qu = new Array();
    gridCord[start].visited = true;
    distance[start] = 0;
    qu.push(start);
    while(qu.length != 0){
      this.steps ++;
      var s =   qu[0];
      qu.shift();
      gridCord[s].visited= true;
      var arr = Utils.direction8_vector(s,gridCord,allowDiag);
      for(let u of arr){
        

        if (!gridCord[u].open  && ! stop){

          gridCord[u].open= true;
          distance[u]=distance[s]+1;
          if (u == end){
            let node:number;
            node = s;//parent[u]
            while(node!=start){
              gridCord[node].isPath = true;
              node = gridCord[node].parent;
              this.length1 ++;
            }
            let milli2 = performance.now();
            this.time = (milli2-milli).toFixed(3);
            this.length1 ++;
            stop = true;
            break;
          }

          gridCord[u].parent = s;
          qu.push(u);

        }
      }
      if(stop){
        break;
      }
    }

	}


  // shortest_path(a: number): number{
  //   if(a==this.end){
  //     console.log('reached');
  //     return 0;
  //   }
  //   var arr = this.direction_vector(a);
  //   for(let j in arr){
  //     if(this.gridCord[arr[j]].obstacle==0){
  //       let element = document.getElementsByTagName('rect')[arr[j]];
  //       element.style.fill = "yellow";
  //       //this.gridCord[arr[j]].obstacle = 1;
  //     }
  //   }
  //   //return 0;
  // }

}
