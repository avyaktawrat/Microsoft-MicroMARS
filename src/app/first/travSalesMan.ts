import { Astar } from './Astar';
import { BFS } from './BFS';
import { Dijkstra } from './dijkstra';
import { GridCoords } from './GridCoords';
import { DPair } from './adj';
import { FloydWarshall } from './floydWarshall';

export class TravSalesMan {
  start: number;
  destinations: number[];
  newNodes: number[]; // nodes for the new graph made from start and end points only
  newGraph: number[][] = new Array<Array<number>>(); // adjacency matrix storing edge weights of this new graph
  length: number = 0;
  time: string = '';
  steps: number = 0;
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
          let dij = new Dijkstra(); // Using BFS as it always gives shortest path between two nodes in a graph
          dij.Wsearch(this.newNodes[i], this.newNodes[j], gridCoords, allowDiag, adj);
          this.newGraph[i][j] = dij.length1;
          this.path[i].push(dij.path);
        }
        else {
          this.newGraph[i][j] = 500;
          this.path[i].push([]);
        }
      }
    }
  }

  search(algo: BFS | Dijkstra | Astar | FloydWarshall, userPref: boolean, gridCoords?: GridCoords[], allowDiag?: boolean, notCrossCorner?:boolean, adj?: Array<Array<DPair>>) {
    if (userPref) {
        if (!(algo instanceof FloydWarshall)) {
          for (let dest of this.destinations) {
            algo.search(gridCoords,this.start, dest, allowDiag, notCrossCorner, adj);
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
        this.time = (performance.now() - then).toFixed(3);
        this.length = algo.length1;
        this.steps += algo.steps;
      }
    }
  }

}
