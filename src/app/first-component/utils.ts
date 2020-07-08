import { FirstComponentComponent } from './first-component.component';
import { GridCoords } from './GridCoords';
import {hGrid, vGrid, totalGrid} from './constants'


export class utils{

  public  direction8_vector(a: number, gridCord: GridCoords[], allowDiag: boolean): number[]{
    var arr = new Array();   

    if((a)%hGrid !=0 && a-1>=0 && gridCord[a-1].obstacle!=1){ //up
      arr.push(a-1);
    } 

    if((a)%hGrid !=0 && a-1>=0 && a+hGrid < totalGrid && (gridCord[a+hGrid].obstacle!=1 || gridCord[a-1].obstacle!=1 )&& gridCord[a-1+hGrid].obstacle!=1 && allowDiag){ //right up
      arr.push(a-1+hGrid);
    }
    
    if ( a+hGrid < totalGrid && gridCord[a+hGrid].obstacle!=1){  //right
      arr.push(a+hGrid);
    }

    if ( a+hGrid < totalGrid && (a+1)%hGrid !=0 && a+1 < totalGrid && (gridCord[a+hGrid].obstacle!=1 || gridCord[a+1].obstacle!=1) && gridCord[a+hGrid+1].obstacle!=1 && allowDiag){  //right down
      arr.push(a+hGrid+1);
    }

    if((a+1)%hGrid !=0 && a+1 < totalGrid && gridCord[a+1].obstacle!=1){ //down
      arr.push(a+1);
    }
    
    if((a+1)%	hGrid !=0 && a-hGrid >= 0 && a+1 < totalGrid && (gridCord[a-hGrid].obstacle!=1  || gridCord[a+1].obstacle!=1) && gridCord[a+1-hGrid].obstacle!=1 && allowDiag){ //down left
      arr.push(a+1-hGrid);
    }

    if(a-hGrid >= 0 && gridCord[a-hGrid].obstacle!=1){ //left
      arr.push(a-hGrid);
    }

    if(a-hGrid >= 0 && (a)%hGrid !=0 && a-1>=0 && (gridCord[a-hGrid].obstacle!=1 || gridCord[a-1].obstacle!=1) && gridCord[a-hGrid-1].obstacle!=1 && allowDiag){ //left up
      arr.push(a-hGrid-1);
    }


    return arr;
  }


  reset_color(gridCord: GridCoords[] ,start:number, end:number) :void{ 
   for (var u = totalGrid - 1; u >= 0; u--) {
      if(u != start && u!= end && gridCord[u].obstacle !=1){
        let element = document.getElementsByTagName('rect')[u];
        element.style.fill = "white";

      }
    }
  }

}