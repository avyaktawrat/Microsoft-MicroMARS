import { FirstComponent } from './first.component';
import { GridCoords } from './GridCoords';
import {hGrid, vGrid, totalGrid} from './constants'


export class utils{

  public  direction8_vector(a: number, gridCord: GridCoords[], allowDiag: boolean, notCrossCorner: boolean ): number[]{
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

  Manhattan(a: number, b:number ): number {
    var x1 = Math.round(a/hGrid);
    var y1 = a%hGrid;
    var x2 = Math.round(b/hGrid);
    var y2 = b%hGrid;
    let dist = Math.abs(x1-x2) + Math.abs(y1-y2);
    return dist;
  }
  Euclidean(a: number, b:number ): number {
    var x1 = Math.round(a/hGrid);
    var y1 = a%hGrid;
    var x2 = Math.round(b/hGrid);
    var y2 = b%hGrid;
    let dist = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
    return dist;
  }
  Octile(a: number, b:number ): number {
    var x1 = Math.round(a/hGrid);
    var y1 = a%hGrid;
    var x2 = Math.round(b/hGrid);
    var y2 = b%hGrid;
    var F = Math.SQRT2 - 1;
    let dist;
    let dx = Math.abs(x1-x2);
    let dy = Math.abs(y1-y2)
    if(dx  <  dy ){
      dist = F*dx + dy;
    }else{
      dist = F*dy + dx;
    }

    return dist;
  }
  Chebyshev(a: number, b:number ): number {
    var x1 = Math.round(a/hGrid);
    var y1 = a%hGrid;
    var x2 = Math.round(b/hGrid);
    var y2 = b%hGrid;
    let dist = Math.max(Math.abs(x1-x2) , Math.abs(y1-y2));
    return dist;
  }

}
