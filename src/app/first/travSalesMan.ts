import { Astar } from './Astar';
import { BFS } from './BFS';
import { Dijkstra } from './dijkstra';
import { GridCoords } from './GridCoords';
import { DPair } from './adj';
import { FloydWarshall } from './floydWarshall';

export class TravSalesMan {
  start: number;
  destinations: number[];
  newNodes: number[] = [this.start, ...this.destinations]; // nodes for the new graph made from start and end points only
  newGraph: number[][] = new Array<Array<number>>(this.destinations.length + 1); // adjacency matrix storing edge weights of this new graph

  prepareNewGraph(gridCoords: GridCoords[], allowDiag: boolean) {   // function to make a new graph
    const bfs = new BFS(); // Using BFS as it always gives shortest path between two nodes in a graph
    for (let i = 0; i < this.newNodes.length; i++) {
      this.newGraph[i] = new Array<number>(this.destinations.length);
      for (let j = 0; j < this.newNodes.length; j++) {
        bfs.search(this.newNodes[i], this.newNodes[j], gridCoords, allowDiag);
        this.newGraph[i][j] = bfs.length1;
      }
    }
  }

  search(algo: BFS | Dijkstra | Astar | FloydWarshall, userPref: boolean, gridCoords?: GridCoords[], allowDiag?: boolean, adj?: Array<Array<DPair>>) {
    if (userPref) {
        if (algo instanceof FloydWarshall) {
          algo.search(adj);
          for (let dest of this.destinations) {
            algo.getPath(this.start, dest, gridCoords);
            this.start = dest;
          }
        }
        else {
          for (let dest of this.destinations) {
            algo.search(this.start, dest, gridCoords, allowDiag, adj);
            this.start = dest;
          }
        }
    }
    else { // if there is no user preference
      this.prepareNewGraph(gridCoords, allowDiag); // prepare a new graph
      /* now apply the new algorithms and get the optimal traversal order */

      // if (!(algo instanceof FloydWarshall)) {
      //   let lengths: DPair[];
      //   for (let dest of this.destinations) {
      //     algo.search(this.start, dest, gridCoords, allowDiag, adj);
      //     lengths.push({first: dest, second: algo.length1});
      //   }
      //   lengths.sort((a: DPair, b: DPair) =>  {
      //     if (a.second < b.second) {
      //       return a.first;
      //     }
      //     else {
      //       return b.first;
      //     }
      //   });
      //   for (let length of lengths) {
      //     algo.search(this.start, length.first, gridCoords, allowDiag, adj);
      //     this.start = length.first;
      //   }
      // }
      // else {
      //   algo.search(adj);
      //   let min: number = 0;
      //   while (this.destinations.length !== 0) {
      //     for (let i = 0; i < algo.d[this.start].length; i++) {
      //       if (algo.d[this.start][i] < algo.d[this.start][min] && this.destinations.includes(algo.d[this.start][i])) {
      //         min = i;
      //       }
      //     }
      //     algo.getPath(this.start, min, gridCoords);
      //     this.start = min;
      //     this.destinations = this.destinations.filter((x: number)=>{if (x !== min){return x;}});
      //   }
      // }
    }
  }

}
