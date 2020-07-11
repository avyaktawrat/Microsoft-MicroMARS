import { DPair } from './adj';
import { GridCoords } from './GridCoords';

export class FloydWarshall {
  time: string;  //
  steps: number;
  length: number;
  d: number[][] = new Array<Array<number>>();
  p: number[][] = new Array<Array<number>>();
  search(adj: Array<Array<DPair>>) {
    let then = performance.now();
    const n = adj.length;
    const INF = 1000000000;
    this.d.length = n;
    this.p.length = n;
    for (let i = 0; i < n; i++) {
      this.d[i] = new Array(n);
      this.p[i] = new Array(n);
      for (let j = 0; j < n; j++) {
        if (adj[i][j] !== undefined) {
          this.d[i][j] = adj[i][j].second * 100;
          // this.next[i][j] = j;
        }
        else {
          this.d[i][j] = INF;
          // this.next[i][j] = -1;
        }
        this.p[i][j] = i;
      }
    }
    for (let i = 0; i < n; i++) {
      this.d[i][i] = 0;
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
    this.time = (performance.now() - then).toFixed(3);
    console.log(this.p);
    // console.log(this.d);
  }

  getPath(start: number, end: number, gridCoords: GridCoords[]) {
    console.log('get path');
    console.log(this.d[start][end]);
    if (start !== end) {
      this.getPath(start, this.p[start][end], gridCoords);
    }
    console.log(end);
    let then = performance.now();
    // let path: number[] = [start];
    // for (let v = end; v !== start; v = this.next[start][v]) {
    //   if (v !== end){
    //     // rects[v].style.fill = 'orange';
    //     gridCoords[v].isPath = true;
    //     // gridCoords[v].isPath = true;
    //   }
    //   path.push(v);
    // }
    // // if (this.next[start][end] === -1) {
    // //   // window.alert('No Path');
    // // }
    // // let path: number[] = [start];
    // // while (start !== end) {
    // //   start = this.next[start][end];
    // //   path.push(start);
    // //   gridCoords[start].isPath = true;
    // // }
    // // this.length = this.d[start][end];
    // console.log(path);
    // this.length = path.length - 1;
    this.time += (performance.now() - then).toFixed(3);
  }
}
