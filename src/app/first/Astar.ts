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
    let milli = performance.now();
    var openList = new Array();
    var closedList = new Array();

    openList.push(start);

    gridCord[start].h = this.distance(start , end); 
    gridCord[start].g = 0;
    gridCord[start].f = gridCord[start].h;
    
    let currentNode :number;

    while(openList.length != 0) {
      this.steps ++;
      //select least f if same f then find least h
      var lowInd : number = 0;
      for(var i=0; i<openList.length; i++) {
        if(gridCord[openList[i]].f <= gridCord[openList[lowInd]].f) {
           lowInd = i;
        }
      }
      var lowIndH : number = lowInd;
      for(var i=0; i<openList.length; i++) {
        if(gridCord[openList[i]].f <= gridCord[openList[lowInd]].f){
          if(gridCord[openList[i]].h <= gridCord[openList[lowIndH]].h){
            lowIndH = i;
          }
        }
      }
      currentNode = openList[lowIndH];
      gridCord[currentNode].visited = true;

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
          node = gridCord[currentNode].parent;
          while(node!=start){
            gridCord[node].isPath = true;
            node = gridCord[node].parent;
            this.length1 ++;
          }
          this.length1++;
          let milli2 = performance.now();
          this.time =  (milli2-milli).toFixed(3);
          break;
      }

      //find neighbors
      var neighbors = Utils.direction8_vector(currentNode,gridCord,allowDiag);
      // console.log("n of "+currentNode+" = ");
      // console.log(neighbors);
      // for (let Coord of neighbors){
      for (let Coord of neighbors){

        // let Coord = neighbors[i].Coord;
        // if(neighbors[i].Weight == NaN){
        //   neighbors[i].Weight = 10;
        // }
        // console.log(neighbors);
        let ng = (((Math.round(currentNode/hGrid)-Math.round(Coord/hGrid) === 0 )|| ((currentNode%hGrid)-(Coord%hGrid) )===0 )? 1 : 1.4);
        // if(this.distance(start,Coord) + this.distance(Coord,end) >= f[Coord] ){
        //   continue;
        // }
        if(closedList.includes(Coord) ){//already visited
          continue;
        }

          if(openList.includes(Coord)){
            let a = openList.indexOf(Coord);
            if(gridCord[currentNode].g + ng  < gridCord[openList[a]].g){
              gridCord[Coord].g = gridCord[currentNode].g + ng ;
              gridCord[Coord].h = this.distance(Coord,end);
              gridCord[Coord].f = gridCord[Coord].h + gridCord[Coord].g;
              gridCord[Coord].parent = currentNode;
              // console.log("g of "+ Coord+ " = " + g + "contained");
            }
          }

          else{ //seeing the node for first time
            gridCord[Coord].g = gridCord[currentNode].g + ng ;
            gridCord[Coord].h = this.distance(Coord,end);
            gridCord[Coord].f = gridCord[Coord].h + gridCord[Coord].g;
            gridCord[Coord].parent = currentNode;
          // console.log("g of "+ Coord+ " = " + g);
            if(Coord != end){
              let element = document.getElementsByTagName('rect')[Coord];
              // element.style.fill = "lightgreen";
              gridCord[Coord].open = true;
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
 /* getWeights(a: number, gridCord: GridCoords[], allowDiag: boolean): Array<Pair>{
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
  }*/

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
