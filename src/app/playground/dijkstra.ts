import { DPair } from './adj';
import {GridCoords} from './GridCoords';
import {utils } from './utils';
import {hGrid} from './constants'

let Utils: utils = new utils();

export class Dijkstra {      // dijkstra's algorithm
  public steps = 0;    // stores the number of iterations
  public length1: number = 0;    // stores the path length
  public time: number = 0;   // stores the total run-time of the algorithm
  public paths: number[] = new Array<number>();   // stores the indices of the grid which are part of the shortest, useful for Floyd-Warshall Algorithm



  Wsearch(start: number, end: number, gridCoords?: GridCoords[], allowDiag?: boolean, adj?: Array<Array<DPair>>) {    // function to search in case of terrains
    const then = performance.now();
    const INF = 1000000000;
    let n: number = adj.length;
    let d = new Array<number>();   // stores the shortest distances
    let p = new Array<number>();   // stores the predecessors of each node in the shortest distance
    let u: boolean[] = new Array<boolean>();   // stores whether a node is visited or not
    u.length = n;
    d.length = n;
    p.length = n;
    for (let i = 0; i < n; i++) {    /*  initializing the above matrices  */
      u[i] = false;
      d[i] = INF;
      p[i] = -1;
    }
    d[start] = 0;
    /*  The main algorithm  */
    for (let i = 0; i < n; i++) {
      let v = -1;
      this.steps += 1;
      for (let j = 0; j < n; j++) {
        if (!u[j] && (v === -1 || d[j] < d[v])) {
          v = j;
        }
      }
      u[v] = true;
      gridCoords[v].visited = true;
      for (let edge of adj[v]){
        if (edge.first !== null && edge.second !== null) {
          let to: number = edge.first;
          let len: number = edge.second;
          if (d[v] + len < d[to]) {
            d[to] = d[v] + len;
            p[to] = v;
          }
        }
      }
      if (d[v] === INF || v === end) {
        break;
      }
    }
   /*   Main Alog Ends   */

    /*  Getting the shortest path from the predecessor matrix  */
    let path: number[] = new Array();
    for (let v = end; v !== start; v = p[v]) {
      if (v !== end){
        gridCoords[v].isPath = true;
        this.paths.push(v);
      }
      gridCoords[v].parent = p[v];
    }
    path.push(start);
    this.length1 = path.length - 1;
    this.time = (performance.now() - then);
  }


  public search(start:number, end:number,gridCord: GridCoords[] ,allowDiag:boolean,notCrossCorner:boolean): void {      // function to use in non-terrain case
    let milli = performance.now();
    let openList = new Array();
    let closedList = new Array();

    /*  The Dijkstra's Algorithm in this function is implemented as a special case of the A* Algorithm  */
    openList.push(start);

    gridCord[start].g = 0;

    let currentNode :number;

    while(openList.length != 0) {
      this.steps ++;

      //select least f
      let leastG : number = openList[0];
      for (let node of openList){
        if(gridCord[node].g < gridCord[leastG].g ){
          leastG = node;
        }
      }
      currentNode = leastG ;
      gridCord[currentNode].visited = true;
      this.length1 += 1;

      if(closedList.includes(currentNode)){
        continue;
      }

      //remove currentNode from openList
      function removeElement(array, elem) {
          let index = array.indexOf(elem);
          if (index > -1) {
              array.splice(index, 1);
          }
      }
      removeElement(openList, currentNode);

      //add currentNode to openList
      closedList.push(currentNode);

      if(currentNode == end){   //end found
          let milli2 = performance.now();
          let node:number;
          this.paths.push(currentNode);
          node = gridCord[currentNode].parent;
          while(node!=start){
            gridCord[node].isPath = true;
            this.paths.push(node);
            node = gridCord[node].parent;

           }
          this.paths.push(start);
          this.paths = this.paths.reverse();
          this.time =  (milli2-milli);
          this.length1 = this.paths.length;
          break;
      }

      //find neighbors

      let neighbors = Utils.direction8_vector(currentNode,gridCord,allowDiag,notCrossCorner);
      for (let Coord of neighbors) {

        let ng = (((Math.round(currentNode/hGrid)-Math.round(Coord/hGrid) === 0 )|| ((currentNode%hGrid)-(Coord%hGrid) )===0 )? 1 : 1.4);
        if(closedList.includes(Coord) ){      //already visited
          continue;
        }
          if(openList.includes(Coord)){
            if(gridCord[currentNode].g + ng  < gridCord[Coord].g){
              gridCord[Coord].g = gridCord[currentNode].g + ng;
              gridCord[Coord].parent = currentNode;
            }
          }

          else{ //seeing the node for playground time
            gridCord[Coord].g = gridCord[currentNode].g + ng;
            gridCord[Coord].parent = currentNode;
            gridCord[Coord].open = true;
            openList.push(Coord);
          }
        }
    }
  }

}
