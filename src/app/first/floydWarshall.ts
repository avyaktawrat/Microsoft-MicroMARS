import { DPair } from './adj';
import { GridCoords } from './GridCoords';

export class FloydWarshall {
  time: string;  // total time taken
  steps: number; // total number of recursive steps
  length1: number; // total path length
  d: number[][] = new Array<Array<number>>(); // all pairs shortest distance matrix
  p: number[][] = new Array<Array<number>>(); // predecessors matrix, p[i][j] denotes the prefecessor of j in the shortest path from i to j
  search(adjM: Array<Array<number>>) {
    this.d = adjM;
    let n = adjM.length;
    console.log(adjM);
    this.p.length = n;
    for (let i = 0; i < this.p.length; i++) {
      this.p[i] = new Array(n);
      for (let j = 0; j < n; j++) {
        this.p[i][j] = i;
      }
    }

    for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (this.d[i][k] + this.d[k][j] < this.d[i][j]) {
            this.d[i][j] = this.d[i][k] + this.d[k][j];
            this.p[i][j] = this.p[k][j];
          }
        }
      }
    }
  }

  getPath(start: number, dests: number[], gridCoords: GridCoords[], path: number[][][]) {
    console.log(path);
    for (let v of dests) {
      for (let i of path[start][v]){
        console.log(start, v);
        gridCoords[i].isPath = true;
      }
      start = v;
    }
  }
}
