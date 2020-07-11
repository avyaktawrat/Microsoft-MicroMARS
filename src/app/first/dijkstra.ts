import { DPair } from './adj';
import {GridCoords} from './GridCoords';

export class Dijkstra {
  steps = 0;
  length1: number;
  time: string;
  search(start: number, end: number, gridCoords?: GridCoords[], allowDiag?: boolean, adj?: Array<Array<DPair>>) {
    const then = performance.now();
    const INF = 1000000000;
    console.log(adj);
    // let rects = document.getElementsByTagName('rect');
    let n: number = adj.length;
    let d = new Array<number>();
    let p = new Array<number>();
    let u: boolean[] = new Array<boolean>();
    u.length = n;
    d.length = n;
    p.length = n;
    for (let i = 0; i < n; i++) {
      u[i] = false;
      d[i] = INF;
      p[i] = -1;
    }
    d[start] = 0;

    for (let i = 0; i < n; i++) {
      let v = -1;
      this.steps += 1;
      for (let j = 0; j < n; j++) {
        if (!u[j] && (v === -1 || d[j] < d[v])) {
          v = j;
        }
      }
      u[v] = true;
      gridCoords[v].visited= true;
      // rects[v].style.fill = 'lightblue';
      // gridCoords[v].visited = true;
      for (let edge of adj[v]){
        if (edge.first !== null && edge.second !== null) {
          let to: number = edge.first;
          let len: number = edge.second;
          if (d[v] + len < d[to]) {
            d[to] = d[v] + len;
            p[to] = v;
          }
        }
        // if (d[v] + len < d[to]) {
        //   d[to] = d[v] + len;
        //   p[to] = v;
        // }
      }
      if (d[v] === INF || v === end) {
        break;
      }
    }
    let path: number[] = new Array();
    for (let v = end; v !== start; v = p[v]) {
      if (v !== end){
        // rects[v].style.fill = 'orange';
        gridCoords[v].isPath = true;
        // gridCoords[v].isPath = true;
      }
      path.push(v);
    }

    // rects[s].style.fill = 'green';
    // rects[t].style.fill = 'red';
    gridCoords[end].isEndPoint = true;
    path.push(start);
    this.length1 = path.length - 1;
    this.time = (performance.now() - then).toFixed(3);
  }

}
