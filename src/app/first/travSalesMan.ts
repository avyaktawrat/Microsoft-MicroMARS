import { Astar } from './Astar';
import { BFS } from './BFS';
import { Dijkstra } from './dijkstra';
import { GridCoords } from './GridCoords';
import { DPair } from './adj';

export class TravSalesMan {
  start: number;
  destinations: number[];

  search(algo: BFS | Dijkstra | Astar, userPref: boolean, gridCoords?: GridCoords[], allowDiag?: boolean, adj?: Array<Array<DPair>>) {
    if (userPref) {
      for (let dest of this.destinations) {
        algo.search(this.start, dest, gridCoords, allowDiag, adj);
        this.start = dest;
      }
    }
    else {
      let lengths: DPair[];
      for (let dest of this.destinations) {
        algo.search(this.start, dest, gridCoords, allowDiag, adj);
        lengths.push({first: dest, second: algo.length1});
      }
      lengths.sort((a: DPair, b: DPair) =>  {
        if (a.second < b.second) {
          return a.first;
        }
        else {
          return b.first;
        }
      });
      for (let length of lengths) {
        algo.search(this.start, length.first, gridCoords, allowDiag, adj);
        this.start = length.first;
      }
    }
  }

}
