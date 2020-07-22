import { GridCoords } from './GridCoords';
import { hGrid } from './constants';
import { lineCord } from './lineCoord';

export class FloydWarshall {
  steps: number = 0; // total number of recursive steps
  length1: number = 0; // total path length
  destOrder: number[] = new Array();
  d: number[][] = new Array<Array<number>>(); // all pairs shortest distance matrix
  pathCord: lineCord[] = new Array();
  // static pathCord: lineCord[];
  search(adjM: Array<Array<number>>) {
    this.d = adjM;
    let n = adjM.length;

    for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          this.steps += 1;
          if (this.d[i][k] + this.d[k][j] < this.d[i][j]) {
            this.d[i][j] = this.d[i][k] + this.d[k][j];
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
    let alert_once = true;
    while (i < dests.length) {
      let min = 1000000000;
      for (let j = 0; j < this.d[start].length; j++) {
        if (this.d[start][j] < min && j !== start && !seen.includes(j)) {
          min_idx = j;
          min = this.d[start][j];
        }
      }
      if(gridCoords[path[start][min_idx][0]] !== null){
        gridCoords[path[start][min_idx][0]].isPath = true;
      }
      else if(alert_once){
        window.alert("All Destinations cannot be reached!")
        alert_once = false;
      }
      for (let idx = 1; idx < path[start][min_idx].length; idx++) {
        gridCoords[path[start][min_idx][idx]].isPath = true;
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
        gridCoords[idx].isPath = true;
      }
      seen.push(start);
      start = min_idx;
      i++;
    }
  }
}
