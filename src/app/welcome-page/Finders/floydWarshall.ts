import { DPair } from './adj';
import { GridCoords } from '../GridCoords';

export class FloydWarshall {
  steps: number = 0; // total number of recursive steps
  length1: number; // total path length
  d: number[][] = new Array<Array<number>>(); // all pairs shortest distance matrix
  p: number[][] = new Array<Array<number>>(); // predecessors matrix, p[i][j] denotes the prefecessor of j in the shortest path from i to j
  search(adjM: Array<Array<number>>) {
    this.d = adjM;
    let n = adjM.length;
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
          this.steps += 1;
          if (this.d[i][k] + this.d[k][j] < this.d[i][j]) {
            this.d[i][j] = this.d[i][k] + this.d[k][j];
            this.p[i][j] = this.p[k][j];
          }
        }
      }
    }
  }

  getPath(start: number, dests: number[], gridCoords: GridCoords[], path: number[][][]) {
    for (let i of gridCoords) {
      i.isPath = false;
    }
    this.length1 = 0;
    for (let v of dests) {
      for (let idx of path[start][v]) {
        this.length1 += 1;
        gridCoords[idx].isPath = true;
      }
      start = v;
    }
    this.length1 += 2;
  }
}
