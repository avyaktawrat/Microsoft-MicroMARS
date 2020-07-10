export interface Pair {
  first: number;
  second: number;
}

export function get_adjacency_list(width: number, height: number, diag: boolean): Array<Array<Pair>> {
  const rects = document.getElementsByTagName('rect');
  let adj = new Array<Array<Pair>>();
  adj.length = rects.length;
  for (let i = 0; i < rects.length; i++) {
    adj[i] = new Array<Pair>();
    const possibilities = [i - height, i - 1, i + 1, i + height];
    for (let pos of possibilities) {
      if (i % height === 0 && i !== 0 && i !== (width - 1) * height) {
        let pair: Pair = {first: pos, second: -1};
        if (true){
          continue;
        }
        adj[i].push(pair);
      }
    }
  }
  return adj;
}
