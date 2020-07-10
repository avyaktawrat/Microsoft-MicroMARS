import {utils } from './utils';
import { GridCoords } from './GridCoords';
import {hGrid, vGrid, totalGrid} from './constants'

let Utils :utils = new utils();

export interface Pair {
  Coord: number;
  Weight: number;
}

export class Astar{

  public steps :number = 0;
  public length1 :number= 0;
  public time :string = "0";

  public search(gridCord: GridCoords[] ,start:number, end:number,allowDiag:boolean):void {

    // console.log (hGrid,vGrid);
    console.log(this.calWeight(start,start+1));
    Utils.reset_color(gridCord,start,end);
    let milli = performance.now();
    var openList = new Array();
    var closedList = new Array();
    var f = new Array();
    var g = new Array();
    var h = new Array();

    var parent = new Array();

    openList.push(start);
    h[start] = this.distance(start , end);
    g[start] = 0;
    f[start] = g[start] + h[start];
    let currentNode :number;

    while(openList.length != 0) {
      this.steps ++;
      //select least f if same f then find least h
      var lowInd : number = 0;
      for(var i=0; i<openList.length; i++) {
        if(f[openList[i]] <= f[openList[lowInd]]) {
           lowInd = i;
        }
      }
      var lowIndH : number = lowInd;
      for(var i=0; i<openList.length; i++) {
        if(f[openList[i]] == f[openList[lowInd]]){
          if(h[openList[i]] < h[openList[lowIndH]]){
            lowIndH = i;
          }
        }
      }
      currentNode = openList[lowIndH];


      if(closedList.includes(currentNode)){
        continue;
      }

      let element = document.getElementsByTagName('rect')[currentNode];
      if (!(currentNode == start || currentNode == end)){
        // element.style.fill = "lightblue";
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
          let node:number;
          node = parent[currentNode];
          while(node!=start){
            let element = document.getElementsByTagName('rect')[node];
            if(element.style.fill != "grey"){  
              element.style.fill = "orange";
            }else{
              element.style.fill = "red";
            }
            node = parent[node];
            this.length1 ++;
          }
          this.length1++;
          let milli2 = performance.now();
          this.time =  (milli2-milli).toFixed(3);
          break;
      }

      //find neighbors
      var neighbors = this.getWeights(currentNode,gridCord,allowDiag);
      console.log("n of "+currentNode+" = ");
      console.log(neighbors);
      // for (let Coord of neighbors){
      for (let  i =0 ; i<neighbors.length ; i++){
        let Coord = neighbors[i].Coord;
        if(neighbors[i].Weight == NaN){
          neighbors[i].Weight = 10;
        }
        console.log(neighbors);
        let ng = (((Math.round(currentNode/hGrid)-Math.round(Coord/hGrid) === 0 )|| ((currentNode%hGrid)-(Coord%hGrid) )===0 )? 1 : 1.4);
        // if(this.distance(start,Coord) + this.distance(Coord,end) >= f[Coord] ){
        //   continue;
        // }
        if(closedList.includes(Coord) ){//already visited
          continue;
        }

          if(openList.includes(Coord)){
            let a = openList.indexOf(Coord);
            if(g[currentNode] + ng + neighbors[i].Weight < g[openList[a]]){
              g[Coord] = g[currentNode] + ng + neighbors[i].Weight;
              h[Coord] = this.distance(Coord,end);
              f[Coord] = g[Coord] + h[Coord];
              parent[Coord] = currentNode;
              // console.log("g of "+ Coord+ " = " + g + "contained");
            }
          }

          else{ //seeing the node for first time
            g[Coord] = g[currentNode] + ng + neighbors[i].Weight;
            h[Coord] = this.distance(Coord,end);
            f[Coord] = g[Coord] + h[Coord];
            parent[Coord] = currentNode;
            // console.log("g of "+ Coord+ " = " + g);
            if(Coord != end){
              let element = document.getElementsByTagName('rect')[Coord];
              // element.style.fill = "lightgreen";

            }

            openList.push(Coord);

          }
      }

    // if(this.steps == reqstep){
    //   // this.update_FGH(gridCord,f,g,h);
    //   // console.log(parent);
    //   break;
    // }

    }
  }
  getWeights(a: number, gridCord: GridCoords[], allowDiag: boolean): Array<Pair>{
    var arr = new Array<Pair>();
  
    let i : number = 0;
    if((a)%hGrid !=0 && a-1>=0){ //up
      let Weight =  this.calWeight(a-1,a);
      arr[i] = {Coord : a-1 , Weight : Weight};
      i++;
    }

    if ( a+hGrid < totalGrid){  //right
      let Weight =  this.calWeight(a+hGrid,a);
      arr[i] = {Coord : a+hGrid , Weight : Weight};
      i++;
    }

    if((a+1)%hGrid !=0 && a+1 < totalGrid){ //down
      let Weight =  this.calWeight(a+1,a);
      arr[i] = {Coord : a+1 , Weight : Weight};
      i++;
    }

    if(a-hGrid >= 0){ //left
      let Weight =  this.calWeight(a-hGrid,a);
      arr[i] = {Coord : a-hGrid , Weight : Weight};
      i++;
    }


    if((a)%hGrid !=0 && a-1>=0 && a+hGrid < totalGrid&& gridCord[a-1+hGrid].obstacle!=1 && allowDiag){ //right up
      let Weight =  this.calWeight(a-1+hGrid,a);
      arr[i] = {Coord : a-1+hGrid , Weight : Weight};
      i++;
    }

    if ( a+hGrid < totalGrid && (a+1)%hGrid !=0 && a+1 < totalGrid  && gridCord[a+hGrid+1].obstacle!=1 && allowDiag){  //right down
      let Weight =  this.calWeight(a+1+hGrid,a);
      arr[i] = {Coord : a+1+hGrid , Weight : Weight};
      i++;
    }

    if((a+1)%  hGrid !=0 && a-hGrid >= 0 && a+1 < totalGrid  && gridCord[a+1-hGrid].obstacle!=1 && allowDiag){ //down left
      let Weight = this.calWeight(a+1-hGrid,a);
      arr[i] = {Coord : a+1-hGrid , Weight : Weight};
      i++;
    }

    if(a-hGrid >= 0 && (a)%hGrid !=0 && a-1>=0 && gridCord[a-hGrid-1].obstacle!=1 && allowDiag){ //left up
      let Weight = this.calWeight(a-1-hGrid,a);
      arr[i] = {Coord : a-1-hGrid , Weight : Weight};
      i++;
    }

    return arr;
  }

  calWeight (a:number , b:number) : number{
    const rect =  document.getElementsByTagName('rect');
    let Weight = 5 * Math.abs(parseFloat(rect[a].style.fillOpacity) - parseFloat(rect[b].style.fillOpacity) )+10;
    return Weight;
  }
  distance(a: number, b:number ): number {
    // console.log(a,b);
    // let init : FirstComponent = new FirstComponent();


    var x1 = Math.round(a/hGrid);
    var y1 = a%hGrid;
    var x2 = Math.round(b/hGrid);

    var y2 = b%hGrid;
    // console.log("h v "+ this.hGrid + " "+ this.vGrid);
    // console.log("x1 x2 =" + x1 + " "+x2 + " y1 y2 " + y1 +" " + y2);
    let dist = Math.abs(x1-x2) + Math.abs(y1-y2);
    return dist;
  }


 // update_FGH(gridCord: GridCoords[], f:Array<number> , g:Array<number> ,h:Array<number> ) :void{
 //     for (let i = 0; i < vGrid; i++) {
 //      for (let j = 0; j < hGrid; j++) {
 //        gridCord[i*hGrid+j].f = f[i*hGrid+j];
 //        gridCord[i*hGrid+j].g = g[i*hGrid+j];
 //        gridCord[i*hGrid+j].h = h[i*hGrid+j];
 //      }
 //    }
 //  }



}
