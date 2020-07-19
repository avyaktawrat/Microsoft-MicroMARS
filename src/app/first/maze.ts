import {utils } from './utils';
import { GridCoords } from './GridCoords';
import {hGrid, vGrid, totalGrid} from './constants';

let Utils: utils = new utils();

export class maze  {
	constructor() {}

	
	
	hori(gridCoord : GridCoords[]):void{
		for (let i = 0; i < hGrid; i+=2) {
      for (let j = 0; j < vGrid; ++j) {
        if(Math.random()>0.3){
          gridCoord[j*hGrid+i].isTerrain = true;
          gridCoord[j*hGrid+i].value = 100;
        }
      }
    }
    for (let i = 0; i < totalGrid; ++i) {
      if(gridCoord[i].isTerrain){
        continue;
      }
      if(Math.random()>0.9){
        gridCoord[i].isTerrain = true;
        gridCoord[i].value = 100;
      }else{
        gridCoord[i].isTerrain = false;
        gridCoord[i].value = 0;
      }
    }
	}

	vert(gridCoord : GridCoords[]):void{
		for (let i = 0; i < hGrid; i++) {
      for (let j = 0; j < vGrid; j+=2) {
        if(Math.random()>0.3){
          gridCoord[j*hGrid+i].isTerrain = true;
          gridCoord[j*hGrid+i].value = 100;
        }
      }
    }
    for (let i = 0; i < totalGrid; ++i) {
      if(gridCoord[i].isTerrain){
        continue;
      }
      if(Math.random()>0.9){
        gridCoord[i].isTerrain = true;
        gridCoord[i].value = 100;
      }else{
        gridCoord[i].isTerrain = false;
        gridCoord[i].value = 0;
      }
    }
	}

	rand(gridCoord : GridCoords[]):void{
		for (let i = 0; i < totalGrid; ++i) {
      let n = Utils.direction8_vector(i,gridCoord,false,false);
      if(Math.random()>0.65 && n.length >= 2){
        gridCoord[i].isTerrain = true;
        gridCoord[i].value = 100;
      }else{
        gridCoord[i].isTerrain = false;
        gridCoord[i].value = 0;
      }
    }
	}

	stair(gridCoord : GridCoords[]):void{
		let i = 0;
	  for ( i = 0; i <= 22*(hGrid+1); i=i+hGrid+1) {
	    gridCoord[i].isTerrain = true;
	    gridCoord[i].value = 100;
	  }
	  for ( i = 22*(hGrid+1); i%hGrid !=0 ; i=i+hGrid-1) {
	    gridCoord[i].isTerrain = true;
	    gridCoord[i].value = 100;         // code...
	  }
	    gridCoord[i].isTerrain = false;
	    gridCoord[i].value = 0;
	    i+=2;
	  for(let j=0; j<5;j++){
	    gridCoord[i+j*(hGrid+1)].isTerrain = true;
	    gridCoord[i+j*(hGrid+1)].value = 100;         // code...
	  }
	}

	binary(gridCoord : GridCoords[]):void{
		for (let j = 0; j < hGrid; j++) {
      gridCoord[j].isTerrain = true;
      gridCoord[j].value = 100;    
    } 
    for (let j = 0; j < vGrid; j++) {
      gridCoord[j*hGrid].isTerrain = true;
      gridCoord[j*hGrid].value = 100;    
    }            
    for (let j = 2; j < hGrid; j+=2) {
      for (let i = 2; i < vGrid; i+=2) {
        if(Math.random()>0.5){ //north
          gridCoord[i*hGrid+j].isTerrain = true;
          gridCoord[i*hGrid+j].value = 100;
          gridCoord[i*hGrid+j-1].isTerrain = true;
          gridCoord[i*hGrid+j-1].value = 100;
          
        }else{  //west
          gridCoord[i*hGrid+j].isTerrain = true;
          gridCoord[i*hGrid+j].value = 100;
          gridCoord[(i-1)*hGrid+j].isTerrain = true;
          gridCoord[(i-1)*hGrid+j].value = 100;
        }

      }
    }
	}

	dfsMaze(gridCoord : GridCoords[]):void{
		for (let p = 0; p < totalGrid * 0.2; p++) {
      let j = Math.round(Math.random() * totalGrid);
      let s = Array();
      s.push(j);
      while (s.length !== 0) {
        let v = s.pop();
        gridCoord[v].isTerrain = true;
        gridCoord[v].value = 100;
        let arr = Utils.direction8_vector(v, gridCoord, false, false);
        for (let u of arr) {
          if (Math.random() > 0.8) {
            gridCoord[u].isTerrain = true;
            gridCoord[u].value = 100;
            s.push(u);
          }
        }
      }
    }
	}

	primMaze(gridCoord : GridCoords[]){
		for (let p = 0; p < totalGrid * 0.05; p++) {
      let j = Math.round(Math.random() * totalGrid);
      let s = Array();
      s.push(j);
      while (s.length !== 0) {
        let v = s.pop();
        gridCoord[v].isTerrain = true;
        gridCoord[v].value = 100;
        let arr = Utils.direction8_vector(v, gridCoord, false, false);
        let c = arr[Math.round(Math.random() * arr.length)];
        if (c === undefined) {
          break;
        }
        gridCoord[c].isTerrain = true;
        gridCoord[c].value = 100;
        for (let u of arr) {
          if (u !== c) {
            console.log(u,c);
            s.push(u);
          }
        }
      }
    }
	}


}