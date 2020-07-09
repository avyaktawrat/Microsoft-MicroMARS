export interface Pair {
  first: number;
  second: number;
}

export function get_adjacency_list(width: number, height: number, diag: boolean): Array<Array<Pair>> {
  const rects = document.getElementsByTagName('rect');
  let adj = new Array<Array<Pair>>();
  adj.length = rects.length;
  for (let i = 0; i < rects.length; i++) {
    let self_opacity = parseFloat(rects[i].style.fillOpacity);
    adj[i] = new Array<Pair>();
    if (diag) {
      let possibilities: number[] = [i - height - 1, i - height,
        i - height + 1, i - 1, i + 1, i + height - 1, i + height, i + height + 1];
      let sq = [i - 1, i + 1, i + height, i - height];
      for (let pos of possibilities) {
        if (rects[pos] !== undefined) {
          if (sq.includes(pos)) {
            let pair: Pair = {first: pos, second: parseFloat(rects[pos].style['fill-opacity']) - self_opacity};
            adj[i].push(pair);
          } else {
            let pair: Pair = {first: pos, second: 1.4 * (parseFloat(rects[pos].style['fill-opacity']) - self_opacity)};
            adj[i].push(pair);
          }
        }
      }
      if (i === 0) {
        adj[i] = [{first: 1, second: parseFloat(rects[1].style['fill-opacity']) - self_opacity},
          {first: height, second: parseFloat(rects[height].style['fill-opacity']) - self_opacity},
          {first: height + 1, second: 1.4 * (parseFloat(rects[height + 1].style['fill-opacity']) - self_opacity)}];
      }
      else if (i === height - 1) {
        adj[i] = [{first: height - 2, second: parseFloat(rects[height - 2].style['fill-opacity']) - self_opacity},
          {first: 2 * i, second: 1.4 * (parseFloat(rects[2 * i].style['fill-opacity']) - self_opacity)},
          {first: i + height, second: parseFloat(rects[i + height].style['fill-opacity']) - self_opacity}];
      }
      else if (i === (width - 1) * height) {
        adj[i] = [{first: i + 1, second: parseFloat(rects[i + 1].style['fill-opacity']) - self_opacity},
          {first: i - height, second: parseFloat(rects[i - height].style['fill-opacity']) - self_opacity},
          {first: i - height + 1, second: 1.4 * (parseFloat(rects[i - height + 1].style['fill-opacity']) - self_opacity)}];
      }
      else if (i === (width * height) - 1) {
        adj[i] = [{first: i - 1, second: parseFloat(rects[i - 1].style['fill-opacity']) - self_opacity},
          {first: i - height - 1, second: 1.4 * (parseFloat(rects[i - height - 1].style['fill-opacity']) - self_opacity)},
          {first: i - height, second: parseFloat(rects[i - height + 1].style['fill-opacity']) - self_opacity}];
      }
      else {}
    }
    else {
      let possibilities: number[] = [i - height, i - 1, i + 1, i + height];
      for (let pos of possibilities) {
        if (rects[pos] !== undefined) {
          let pair: Pair = {first: pos, second: parseFloat(rects[pos].style.fillOpacity) - self_opacity};
          adj[i].push(pair);
        }
      }
      if (i == 0) {
        adj[i] = [{first: 1, second: parseFloat(rects[1].style.fillOpacity) - self_opacity},
          {first: height, second: parseFloat(rects[height].style.fillOpacity) - self_opacity}];
      }
      else if (i == height - 1) {
        adj[i] = [{first: height - 2, second: parseFloat(rects[height - 2].style.fillOpacity) - self_opacity},
          {first: i + height, second: parseFloat(rects[i + height].style.fillOpacity) - self_opacity}];
      }
      else if (i == (width - 1) * height) {
        adj[i] = [{first: i + 1, second: parseFloat(rects[i + 1].style.fillOpacity) - self_opacity},
          {first: i - height, second: parseFloat(rects[i - height].style.fillOpacity) - self_opacity}];
      }
      else if (i == (width * height) - 1) {
        adj[i] = [{first: i - 1, second: parseFloat(rects[i - 1].style.fillOpacity) - self_opacity},
          {first: i - height, second: parseFloat(rects[i - height + 1].style.fillOpacity) - self_opacity}];
      }
      else {}
    }
  }

  return adj;
}
