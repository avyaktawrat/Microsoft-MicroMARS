import { FirstComponent } from './first.component';
import { GridCoords } from './GridCoords';
import {hGrid, vGrid, totalGrid} from './constants'


export class utils{

  public  direction8_vector(a: number, gridCord: GridCoords[], allowDiag: boolean, notCrossCorner: boolean = false): number[]{
    var arr = new Array();
    //console.log(a)

    if((a)%hGrid !=0 && a-1>=0 && !gridCord[a-1].isTerrain){ //up
      arr.push(a-1);
    }

    if ( a+hGrid < totalGrid && !gridCord[a+hGrid].isTerrain){  //right
      arr.push(a+hGrid);
    }

    if((a+1)%hGrid !=0 && a+1 < totalGrid && !gridCord[a+1].isTerrain){ //down
      arr.push(a+1);
    }

    if(a-hGrid >= 0 && !gridCord[a-hGrid].isTerrain){ //left
      arr.push(a-hGrid);
    }


    if((a)%hGrid !=0 && a-1>=0 && a+hGrid < totalGrid && (!gridCord[a+hGrid].isTerrain || !gridCord[a-1].isTerrain)&& !gridCord[a-1+hGrid].isTerrain && allowDiag){ //right up
      if(!(notCrossCorner && (gridCord[a+hGrid].isTerrain || gridCord[a-1].isTerrain))){
        arr.push(a-1+hGrid);
      }
    }

    if ( a+hGrid < totalGrid && (a+1)%hGrid !=0 && a+1 < totalGrid && (!gridCord[a+hGrid].isTerrain || !gridCord[a+1].isTerrain) && !gridCord[a+hGrid+1].isTerrain && allowDiag){  //right down
      if(!(notCrossCorner && (gridCord[a+hGrid].isTerrain || gridCord[a+1].isTerrain))){
        arr.push(a+hGrid+1);
      }
    }

    if((a+1)%	hGrid !=0 && a-hGrid >= 0 && a+1 < totalGrid && (!gridCord[a-hGrid].isTerrain  || !gridCord[a+1].isTerrain) && !gridCord[a+1-hGrid].isTerrain && allowDiag){ //down left
      if(!(notCrossCorner && (gridCord[a-hGrid].isTerrain || gridCord[a+1].isTerrain))){
        arr.push(a+1-hGrid);
      } 
    }

    if(a-hGrid >= 0 && (a)%hGrid !=0 && a-1>=0 && (!gridCord[a-hGrid].isTerrain || !gridCord[a-1].isTerrain) && !gridCord[a-hGrid-1].isTerrain && allowDiag){ //left up
      if(!(notCrossCorner && (gridCord[a-hGrid].isTerrain || gridCord[a-1].isTerrain))){
        arr.push(a-hGrid-1);
      } 
    }

    return arr;
  }

  distance(a: number, b:number ): number {
    var x1 = Math.round(a/hGrid);
    var y1 = a%hGrid;
    var x2 = Math.round(b/hGrid);
    var y2 = b%hGrid;
    let dist = Math.abs(x1-x2) + Math.abs(y1-y2);
    return dist;
  }

}
