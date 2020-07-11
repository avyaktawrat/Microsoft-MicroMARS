import { Astar } from './Astar';
import { BFS } from './BFS';
import { Dijkstra } from './dijkstra';
import { GridCoords } from './GridCoords';
import { DPair } from './adj';
import { FloydWarshall } from './floydWarshall';

export class TravSalesMan {
  start: number;
  destinations: number[];

  search(algo: BFS | Dijkstra | Astar | FloydWarshall, userPref: boolean, gridCoords?: GridCoords[], allowDiag?: boolean, adj?: Array<Array<DPair>>) {
    if (userPref) {
        if (algo instanceof FloydWarshall) {
          algo.search(adj);
          for (let dest of this.destinations) {
            algo.getPath(this.start, dest, gridCoords);
            this.start = dest;
          }
        }
        else {
          for (let dest of this.destinations) {
            algo.search(this.start, dest, gridCoords, allowDiag, adj);
            this.start = dest;
          }
        }
    }
    else {
      if (!(algo instanceof FloydWarshall)) {
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
      else {
        algo.search(adj);
        let min: number = 0;
        while (this.destinations.length !== 0) {
          for (let i = 0; i < algo.d[this.start].length; i++) {
            if (algo.d[this.start][i] < algo.d[this.start][min] && this.destinations.includes(algo.d[this.start][i])) {
              min = i;
            }
          }
          algo.getPath(this.start, min, gridCoords);
          this.start = min;
          this.destinations = this.destinations.filter((x: number)=>{if (x !== min){return x;}});
        }
      }
    }
  }

}
