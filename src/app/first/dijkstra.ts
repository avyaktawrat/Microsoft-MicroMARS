import { Pair } from './adj';
import {GridCoords} from './GridCoords';

export class Dijkstra {
  steps: number = 0;
  length: number;
  time: string;
  search(s: number, t: number, adj: Array<Array<Pair>>, gridCoords: GridCoords[]) {
    let then = performance.now();
    const INF = 1000000000;
    let rects = document.getElementsByTagName('rect');
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
    d[s] = 0;

    for (let i = 0; i < n; i++) {
      let v = -1;
      this.steps += 1;
      for (let j = 0; j < n; j++) {
        if (!u[j] && (v === -1 || d[j] < d[v])) {
          v = j;
        }
      }
      u[v] = true;
      rects[v].style.fill = 'lightblue';
      for (let edge of adj[v]){
        let to: number = edge.first;
        let len: number = edge.second;
        if (d[v] + len < d[to]) {
          d[to] = d[v] + len;
          p[to] = v;
        }
      }
      if (d[v] === INF) {
        break;
      }
    }
    let path: number[] = new Array();
    for (let v = t; v !== s; v = p[v]) {
      if (v != t){
        rects[v].style.fill = 'orange';
      }
      path.push(v);
    }
    rects[s].style.fill = 'green';
    rects[t].style.fill = 'red';
    path.push(s);
    console.log(path.reverse());
    this.length = path.length;

    for (let i = 0; i < gridCoords.length; i++) {
      if (gridCoords[i].isTerrain) {
        rects[i].style.fill = 'gray';
      }
    }
    this.time = (performance.now() - then).toFixed(3);
  }

}