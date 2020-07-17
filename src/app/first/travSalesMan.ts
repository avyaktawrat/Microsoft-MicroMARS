import { Astar } from './Astar';
import { BFS } from './BFS';
import { Dijkstra } from './dijkstra';
import { GridCoords } from './GridCoords';
import { DPair } from './adj';
import { FloydWarshall } from './floydWarshall';
import {hGrid, vGrid, totalGrid} from './constants';
import { lineCord} from './lineCoord'
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

  search(algo: BFS | Dijkstra | Astar | FloydWarshall, userPref: boolean, gridCoords?: GridCoords[], allowDiag?: boolean, adj?: Array<Array<DPair>>) {
    if (userPref) {
        if (!(algo instanceof FloydWarshall)) {
          for (let dest of this.destinations) {
            this.resetGrid(gridCoords);
            algo.search(this.start, dest, gridCoords, allowDiag, false);
            this.linePath(this.start,dest,gridCoords);
            this.start = dest;
            this.length += algo.length1;
            this.time += algo.time;
            this.steps += algo.steps;
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
        // for (let dest of this.destinations) {
        //   console.log(this.start, dest);
        //   this.linePath(this.start, dest, gridCoords);
        //   this.start = dest;
        // }
        this.time = (performance.now() - then);
        this.length = algo.length1;
        this.steps += algo.steps;
      }
    }
  }
  resetGrid(gridCoords:GridCoords[]) {
    for (var i = 0; i < totalGrid; ++i) {
      gridCoords[i].visited = false;
      gridCoords[i].open = false;
      gridCoords[i].debug = false;
      gridCoords[i].f = null;
      gridCoords[i].g = null;
      gridCoords[i].h = null;
    }
  }

  linePath(start:number,end :number,gridCord:GridCoords[]){
    let node :number = end;
    while(node!=start){
          let node_next = gridCord[node].parent;
          let x1 = Math.floor(node/hGrid)*30+15;
          let x2 = Math.floor(node_next/hGrid)*30+15;
          let y1 = (node%hGrid)*30+15;
          let y2 = (node_next%hGrid)*30+15;
          this.pathCord.push({ x1: x1, y1: y1, x2: x2, y2: y2 })
          node = node_next;
        }

  }
}
