import { DPair } from './adj';
import { GridCoords } from './GridCoords';
import { hGrid } from './constants';
import { lineCord } from './lineCoord';

export class FloydWarshall {
  steps: number = 0; // total number of recursive steps
  length1: number = 0; // total path length
  destOrder: number[] = new Array();
  d: number[][] = new Array<Array<number>>(); // all pairs shortest distance matrix
  // p: number[][] = new Array<Array<number>>(); // predecessors matrix, p[i][j] denotes the prefecessor of j in the shortest path from i to j
  pathCord: lineCord[] = new Array();
  static pathCord: lineCord[];
  search(adjM: Array<Array<number>>) {
    this.d = adjM;
    let n = adjM.length;
    // this.p.length = n;
    // for (let i = 0; i < this.p.length; i++) {
    //   this.p[i] = new Array(n);
    //   for (let j = 0; j < n; j++) {
    //     this.p[i][j] = i;
    //   }
    // }

    for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          this.steps += 1;
          if (this.d[i][k] + this.d[k][j] < this.d[i][j]) {
            this.d[i][j] = this.d[i][k] + this.d[k][j];
            // this.p[i][j] = this.p[i][k];
          }
        }
      }
    }
  }

  getPath(start: number, dests: number[], gridCoords: GridCoords[], path: number[][][]) {
    for (let i of gridCoords) {
      i.isPath = false;
    }
    let i = 0;
    let min_idx = -1;
    let seen = [];
    // console.log(this.p);
    let alert_once = true;
    while (i < dests.length) {
      let min = 1000000000;
      for (let j = 0; j < this.d[start].length; j++) {
        if (this.d[start][j] < min && j !== start && !seen.includes(j)) {
          min_idx = j;
          min = this.d[start][j];
        }
      }
      // console.log()
      
      if(gridCoords[path[start][min_idx][0]]!=null){
        gridCoords[path[start][min_idx][0]].isPath = true;
      }
      else if(alert_once){
        window.alert("All Destinations cannot be reached!")
        alert_once = false;
      }
      // gridCoords[path[start][min_idx][0]].parent = path[start][min_idx][0];
      for (let idx = 1; idx < path[start][min_idx].length; idx++) {
        // this.length1 += 1;
        gridCoords[path[start][min_idx][idx]].isPath = true;
        // gridCoords[path[start][min_idx][idx]].parent = path[start][min_idx][idx - 1];
        // console.log([path[start][min_idx][idx]],path[start][min_idx][idx - 1]);
        let node = path[start][min_idx][idx];
        let node_next = path[start][min_idx][idx - 1];
        let x1 = Math.floor(node/hGrid)*30+15;
        let x2 = Math.floor(node_next/hGrid)*30+15;
        let y1 = (node%hGrid)*30+15;
        let y2 = (node_next%hGrid)*30+15;
        this.pathCord.push({ x1: x1, y1: y1, x2: x2, y2: y2 })
        this.length1 = this.length1 + Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2))/30;
        if(i==10000){
          console.log("exceeded limit");
          break
        }
      }
      
      this.destOrder.push(min_idx-1);
      for (let idx of path[start][min_idx]) {
        // this.length1 += 1;
        gridCoords[idx].isPath = true;
      }
      seen.push(start);
      start = min_idx;
      i++;
    }
    // for (let v of dests) {
    //   for (let idx of path[start][v]) {
    //     this.length1 += 1;
    //     gridCoords[idx].isPath = true;
    //   }
    //   start = v;
    // }
    // this.length1 += 2;
  }
}
