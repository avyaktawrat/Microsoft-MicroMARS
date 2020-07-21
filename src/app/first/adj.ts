export interface DPair {
  first: number;
  second: number;
}

export function get_adjacency_list(width: number, height: number, diag: boolean): Array<Array<DPair>> {
  const rects = document.getElementsByTagName('rect');
  let adj = new Array<Array<DPair>>();
  adj.length = rects.length;
  for (let i = 0; i < rects.length; i++) {
    adj[i] = new Array<DPair>();
    const possibilities = [i - height, i - 1, i + 1, i + height];
    for (let pos of possibilities) {
      let pair: DPair = {first: pos, second: null};
      if (i % height === 0 && i !== 0 && i !== (width - 1) * height && pos !== i - 1) {
        pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1;
      }
      else if ((i + 1) % (height) === 0 && i !== height - 1 && i !== width * height - 1 && pos !== i + 1 && i !== 0) {
        pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1;
      }
      else if (i < height - 1 && i > 0 && pos !== i - height ) {
        pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1;
      }
      else if (i < width * height - 1 && i > (width - 1) * height && pos !== i + height) {
        pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1;
      }
      else if (i === 0 && pos !== i - height && pos !== i - 1) {
        pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1;
      }
      else if (i === height - 1 && pos !== i - height && pos !== i + 1) {
        pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1;
      }
      else if (i === (width - 1) * height && pos !== i + height && pos !== i - 1) {
        pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1;
      }
      else if (i === width * height - 1 && pos !== i + 1 && pos !== i + height) {
        pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1;
      }
      else if (i >= height + 1 && (i + 1) % height !== 0 && i % height !== 0 && i <= width * height - 1 - height) {
        pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1;
      }
      else {
        continue;
      }
      adj[i].push(pair);
    }
    if (diag) {
      const morePossibilities = [i - height - 1, i - height + 1, i + height - 1, i + height + 1];
      for (let pos of morePossibilities) {
        let pair: DPair = {first: pos, second: null};
        if (i % height === 0 && i !== 0 && i !== (width - 1) * height && pos !== i - height - 1 && pos !== i + height - 1) {
          pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1.4;
        }
        else if ((i + 1) % (height) === 0 && i !== height - 1 && i !== width * height - 1 && pos !== i - height + 1 && pos !== i + height + 1 && i !== 0) {
          pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1.4;
        }
        else if (i < height - 1 && i > 0 && pos !== i + 1 - height && pos !== i - 1 - height) {
          pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1.4;
        }
        else if (i < width * height - 1 && i > (width - 1) * height && pos !== i + height + 1 && pos !== i + height - 1) {
          pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1.4;
        }
        else if (i === 0 && pos === i + height + 1) {
          pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1.4;
        }
        else if (i === height - 1 && pos === i + height - 1) {
          pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1.4;
        }
        else if (i === (width - 1) * height && pos === i - height + 1) {
          pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1.4;
        }
        else if (i === width * height - 1 && pos === i - height - 1 ) {
          pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1.4;
        }
        else if (i >= height + 1 && (i + 1) % height !== 0 && i % height !== 0 && i <= width * height - 1 - height) {
          pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1.4;
        }
        else {
          continue;
        }
        adj[i].push(pair);
      }
    }
  }
  return adj;
}
