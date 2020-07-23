import { Astar } from './Astar';
import { BFS } from './BFS';
import { Dijkstra } from './dijkstra';
import { GridCoords } from '../include/GridCoords';
import { DPair } from '../include/adj';
import { FloydWarshall } from './floydWarshall';
import {hGrid, totalGrid} from '../include/constants';
import { lineCord} from '../include/lineCoord'

export class TravSalesMan {
  start: number;
  destinations: number[];
  newNodes: number[]; // nodes for the new graph made from start and end points only
  newGraph: number[][] = new Array<Array<number>>(); // adjacency matrix storing edge weights of this new graph
  length: number = 0;
  time: number = 0;
  steps: number = 0;
  pathCord: lineCord[] = new Array();
  path: number[][][] = new Array<Array<Array<number>>>(); // for floyd-warshall only
  alert_once: boolean = false; // non-floydwarshall algos
  prepareNewGraph(gridCoords: GridCoords[], allowDiag: boolean, adj: Array<Array<DPair>>) {   // function to make a new graph
    this.newNodes = [this.start, ...this.destinations];
    this.newGraph.length = this.newNodes.length;
    this.path.length = this.newNodes.length;
    for (let i = 0; i < this.newNodes.length; i++) {
      this.newGraph[i] = new Array<number>(this.newNodes.length);
      this.path[i] = new Array<Array<number>>();
      for (let j = 0; j < this.newNodes.length; j++) {
        this.steps += 1;
        if (i !== j) {
          let dij = new Dijkstra(); // Using Dijkstra to get shortest path between two nodes in a graph
          dij.search(this.newNodes[i], this.newNodes[j], gridCoords, allowDiag,false);
          this.newGraph[i][j] = dij.length1;
          this.path[i].push(dij.paths.reverse());
        }
        else {
          this.newGraph[i][j] = 0;
          this.path[i].push([]);
        }
      }
    }
  }

  search(algo: BFS | Dijkstra | Astar | FloydWarshall, userPref: boolean, gridCoords?: GridCoords[], allowDiag?: boolean, adj?: Array<Array<DPair>>) {   // common search function for all algos
    if (userPref) {   // if user has a preference of destinations
        if (!(algo instanceof FloydWarshall)) {   // we only use non-floyd-warshall algorithms
          for (let dest of this.destinations) {   // find the path iteratively by shifting start and destination points
            this.resetGrid(gridCoords);
            algo.search(this.start, dest, gridCoords, allowDiag, false);
            if(gridCoords[dest].parent!=null){
              this.linePath(this.start,dest,gridCoords);
            }
            else{
              this.alert_once = true;
              break;
            }
            this.start = dest;
            this.time += algo.time;
            this.steps += algo.steps;
          }
          if(this.alert_once){
            window.alert("No Path Exists");
            this.alert_once = false;
          }
        }
    }
    else { // if there is no user preference
      // prepare a new graph
      /* now apply the new algorithms and get the optimal traversal order */
      if (algo instanceof FloydWarshall) {
        let then = performance.now();
        algo.search(this.newGraph);
        algo.getPath(0, Array.from(this.destinations, (_,i)=>i+1), gridCoords, this.path);
        this.pathCord = algo.pathCord;
        let i =1;
        for(let u of algo.destOrder){    // label the destinations in the order that they have been covered
          gridCoords[this.destinations[u]].destOrder = i;
          i++;
        }
        this.time = (performance.now() - then);
        this.length = algo.length1;
        this.steps += algo.steps;
      }
    }
  }
  resetGrid(gridCoords:GridCoords[]) {   // reset the entire grid
    for (let i = 0; i < totalGrid; ++i) {
      gridCoords[i].visited = false;
      gridCoords[i].open = false;
      gridCoords[i].f = null;
      gridCoords[i].g = null;
      gridCoords[i].h = null;
    }
  }

  linePath(start:number,end :number,gridCord:GridCoords[]){   // function to display line on the grid for the shortest-path found
    let node: number = end;
    let i =0;

    while(node !== start){
          i++
          let node_next = gridCord[node].parent;
          let x1 = Math.floor(node/hGrid)*30+15;
          let x2 = Math.floor(node_next/hGrid)*30+15;
          let y1 = (node%hGrid)*30+15;
          let y2 = (node_next%hGrid)*30+15;
          this.pathCord.push({ x1: x1, y1: y1, x2: x2, y2: y2 })
          node = node_next;
          this.length = this.length + Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2))/30;
          if(i === 1000){
            break;
          }
        }
  }
}
