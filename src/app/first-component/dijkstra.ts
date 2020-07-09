import { Pair, get_adjacency_list } from './adj';


// var adj = new Array<Array<Pair>>(10);

export function dijkstra(s: number, t: number, adj: Array<Array<Pair>>) {
  const INF = 1000000;
  let steps = 0;
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
    steps += 1;
    for (let j = 0; j < n; j++) {
      if (!u[j] && (v === -1 || d[j] < d[v])) {
        v = j;
      }
    }

    if (d[v] === INF) {
      break;
    }

    u[v] = true;
    for (let edge of adj[v]){
      let to: number = edge.first;
      let len: number;
      if (isNaN(edge.second)){
        len = 10;
      } else {
        len = edge.second * 100;
      }
      if (d[v] + len < d[to]) {
        d[to] = d[v] + len;
        p[to] = v;
      }
    }
  }
  let path: number[] = new Array();
  console.log(d);
  for (let v = t; v !== s; v = p[v]) {
    if (v != t){
      rects[v].style.fill = 'orange';
    }
    path.push(v);
  }
  path.push(s);
  console.log(path.reverse());
  return  [steps, path.length];
}

// function restore_path(s: number, t: number, p: number[]) {
//   let path: number[];
//
//   for (let v = t; v != s; v = p[v]) {
//     path.push(v);
//   }
//   path.push(s);
//   return path.reverse();
// }
