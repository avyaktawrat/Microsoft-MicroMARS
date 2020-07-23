export interface DPair {  // An interface used to handle Adjacency List representation of a graph
  first: number;
  second: number;
}

export function get_adjacency_list(width: number, height: number, diag: boolean): Array<Array<DPair>> {   // function that generates an adjacent list using the grid
  const rects = document.getElementsByTagName('rect');
  let adj = new Array<Array<DPair>>();
  adj.length = rects.length;
  for (let i = 0; i < rects.length; i++) {
    adj[i] = new Array<DPair>();
    const possibilities = [i - height, i - 1, i + 1, i + height]; // possible orthogonal neighbors
    for (let pos of possibilities) {
      let pair: DPair = {first: pos, second: null};
      if (i % height === 0 && i !== 0 && i !== (width - 1) * height && pos !== i - 1) {  // top-most row of the grid
        pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1;
      }
      else if ((i + 1) % (height) === 0 && i !== height - 1 && i !== width * height - 1 && pos !== i + 1 && i !== 0) {  // bottom-most row of the grid
        pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1;
      }
      else if (i < height - 1 && i > 0 && pos !== i - height ) {  // left-most column of the grid
        pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1;
      }
      else if (i < width * height - 1 && i > (width - 1) * height && pos !== i + height) {  // right-most column of the grid
        pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1;
      }
      else if (i === 0 && pos !== i - height && pos !== i - 1) {   // the top-left corner
        pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1;
      }
      else if (i === height - 1 && pos !== i - height && pos !== i + 1) {   // the bottom-right corner
        pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1;
      }
      else if (i === (width - 1) * height && pos !== i + height && pos !== i - 1) {   // the top-right corner
        pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1;
      }
      else if (i === width * height - 1 && pos !== i + 1 && pos !== i + height) {  // the bottom-right corner
        pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1;
      }
      else if (i >= height + 1 && (i + 1) % height !== 0 && i % height !== 0 && i <= width * height - 1 - height) {   // the rest of the grid cells
        pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1;
      }
      else {
        continue;
      }
      adj[i].push(pair);
    }
    if (diag) {    // if diagonal neighbors have to be considered
      const morePossibilities = [i - height - 1, i - height + 1, i + height - 1, i + height + 1]; // possible diagonal neighbors
      for (let pos of morePossibilities) {
        let pair: DPair = {first: pos, second: null};
        if (i % height === 0 && i !== 0 && i !== (width - 1) * height && pos !== i - height - 1 && pos !== i + height - 1) {    // top-most row of the grid
          pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1.4;
        }
        else if ((i + 1) % (height) === 0 && i !== height - 1 && i !== width * height - 1 && pos !== i - height + 1 && pos !== i + height + 1 && i !== 0) {  // bottom-most row of the grid
          pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1.4;
        }
        else if (i < height - 1 && i > 0 && pos !== i + 1 - height && pos !== i - 1 - height) {    // left-most column of the grid
          pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1.4;
        }
        else if (i < width * height - 1 && i > (width - 1) * height && pos !== i + height + 1 && pos !== i + height - 1) {    // right-most column of the grid
          pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1.4;
        }
        else if (i === 0 && pos === i + height + 1) {    // the top-left corner
          pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1.4;
        }
        else if (i === height - 1 && pos === i + height - 1) {    // the bottom-left corner
          pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1.4;
        }
        else if (i === (width - 1) * height && pos === i - height + 1) {   // the top-right corner
          pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1.4;
        }
        else if (i === width * height - 1 && pos === i - height - 1 ) {   // the bottom-right corner
          pair.second = 0.05 * parseFloat(rects[pos].id.split(',')[0]) + 1.4;
        }
        else if (i >= height + 1 && (i + 1) % height !== 0 && i % height !== 0 && i <= width * height - 1 - height) {     // the rest of the grid cells
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
