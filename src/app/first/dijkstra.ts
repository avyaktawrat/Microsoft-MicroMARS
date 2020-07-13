import { DPair } from './adj';
import {GridCoords} from './GridCoords';
import {utils } from './utils';
import {hGrid, vGrid, totalGrid} from './constants'

let Utils: utils = new utils();

export class Dijkstra {
  public steps = 0;
  public length1: number;
  public time: string;
  public path = new  Array();

  Wsearch(start: number, end: number, gridCoords?: GridCoords[], allowDiag?: boolean, adj?: Array<Array<DPair>>) {
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
      this.path.push(v);
      gridCoords[v].parent = p[v];
    }


    // rects[s].style.fill = 'green';
    // rects[t].style.fill = 'red';
    gridCoords[end].isEndPoint = true;
    path.push(start);
    this.length1 = path.length - 1;
    this.time = (performance.now() - then).toFixed(3);
  }


  public search(gridCord: GridCoords[] ,start:number, end:number,allowDiag:boolean/*,req_step:number*/):void {
    let milli = performance.now();
    var openList = new Array();
    var closedList = new Array();
    

    openList.push(start);

    gridCord[start].g = 0; 
    
    let currentNode :number;

    while(openList.length != 0) {
      this.steps ++;

      //select least f 
      var leastG : number = openList[0];
      for (let node of openList){
        if(gridCord[node].g < gridCord[leastG].g ){
          leastG = node;
        }
      }
      // currentNode = openList[lowInd];
      currentNode = leastG ;
      gridCord[currentNode].visited = true;

      if(closedList.includes(currentNode)){
        continue;
      }

      //remove currentNode from openList
      function removeElement(array, elem) {
          var index = array.indexOf(elem);
          if (index > -1) {
              array.splice(index, 1);
          }
      }
      removeElement(openList, currentNode);

      //add currentNode to openList
      closedList.push(currentNode);

      if(currentNode == end){   //end found
          let milli2 = performance.now();
          let node:number;
          this.path.push(currentNode);
          node = gridCord[currentNode].parent;
          while(node!=start){
            gridCord[node].isPath = true;
            this.path.push(node);
            node = gridCord[node].parent;
            
           }
          this.path.push(start);
          this.path = this.path.reverse();
          this.time =  (milli2-milli).toFixed(3);
          break;
      }

      //find neighbors

      // let neighbors = new Array<Pair>() ;
      let neighbors = Utils.direction8_vector(currentNode,gridCord,allowDiag);
      // console.log(neighbors);
      for (var Coord of neighbors) {

        let ng = (((Math.round(currentNode/hGrid)-Math.round(Coord/hGrid) === 0 )|| ((currentNode%hGrid)-(Coord%hGrid) )===0 )? 1 : 1.4);
        // let ng :number= 0;
        if(closedList.includes(Coord) ){//already visited
          continue;
        }

          if(openList.includes(Coord)){
            if(gridCord[currentNode].g + ng  < gridCord[Coord].g){
              gridCord[Coord].g = gridCord[currentNode].g + ng;
              gridCord[Coord].parent = currentNode;
            }
          }

          else{ //seeing the node for first time
            gridCord[Coord].g = gridCord[currentNode].g + ng;
            gridCord[Coord].parent = currentNode;    
            gridCord[Coord].open = true;
            openList.push(Coord);
          }
        }
    // if(this.steps == req_step){
    //   break;
    // }

    }
  }
}
