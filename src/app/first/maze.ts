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
		for (var i = 0; i < totalGrid; ++i) {
    	gridCoord[i].isTerrain = true;
      gridCoord[i].value = 100;

    }
		for (let j = 0; j < hGrid; j++) {
      gridCoord[j].isTerrain = false;
      gridCoord[j].value = 0;
    }
    for (let j = 0; j < vGrid; j++) {
      gridCoord[j*hGrid].isTerrain = false;
      gridCoord[j*hGrid].value = 0;
    }
    for (let j = 2; j < hGrid; j+=2) {
      for (let i = 2; i < vGrid; i+=2) {
        if(Math.random()>0.5){ //north
          gridCoord[i*hGrid+j].isTerrain = false;
          gridCoord[i*hGrid+j].value = 0;
          gridCoord[i*hGrid+j-1].isTerrain = false;
          gridCoord[i*hGrid+j-1].value = 0;

        }else{  //west
          gridCoord[i*hGrid+j].isTerrain = false;
          gridCoord[i*hGrid+j].value = 0;
          gridCoord[(i-1)*hGrid+j].isTerrain = false;
          gridCoord[(i-1)*hGrid+j].value = 0;
        }

      }
    }
	}

	dfsMaze(gridCoord : GridCoords[]):void{
			function removeElement(array, elem) {
          var index = array.indexOf(elem);
          if (index > -1) {
              array.splice(index, 1);
          }
      }

			for (var i = 0; i < totalGrid; ++i) {
	    	gridCoord[i].isTerrain = true;
	      gridCoord[i].value = 100;
    	}
      let s = Array();
      s.push(0);
      let step = 0;
      while (s.length !== 0) {
      	step++;
        let v = s.pop();
        // gridCoord[v].debug = true;

        gridCoord[v].isTerrain = false;
        gridCoord[v].value = 0;
        let arr1 = new Array;
        let arr = Utils.direction8_maze(v, gridCoord);

        // console.log(arr);
        if(arr.length==0){
        	continue;
        }
        arr1.length = arr.length;
        arr1 = arr;
        while(arr.length!=0){
        	let u = arr[Math.floor(Math.random()*arr.length)]; //add to list in random order
					removeElement(arr, u);
	        gridCoord[(u+v)/2].isTerrain = false;
       	 	gridCoord[(u+v)/2].value = 0;
       	 	gridCoord[u].isTerrain = false;
        	gridCoord[u].value = 0;
        	s.push(u);
      	}
      // if(step == 5) break;
        }


	}

	primMaze(gridCoord : GridCoords[]){
    for (var i = 0; i < totalGrid; ++i) {
      gridCoord[i].isTerrain = true;
      gridCoord[i].value = 100;
    }
	  let start = Math.floor(Math.random() * totalGrid);
    if (start === 0) {
      start++;
    }
	  let pathSet = [start];
	  // console.log(pathSet);
	  while (pathSet.length !== 0) {
	    let cell = pathSet.pop();
	    let arr = Utils.direction8_maze(cell, gridCoord);
	    if (arr.length !== 0) {
	      let randIdx = Math.floor(Math.random() * arr.length);
	      while (!gridCoord[randIdx].isTerrain) {
	        randIdx = Math.floor(Math.random() * arr.length);
        }
	      // console.log(randIdx);
	      gridCoord[cell].isTerrain = false;
	      gridCoord[cell].value = 0;
	      // gridCoord[arr[randIdx]].isTerrain = false;
	      // gridCoord[arr[randIdx]].value = 0;
        arr.sort(() => Math.random() - 0.5);
	      for (let x of arr) {
	        if (x !== randIdx) {
	          gridCoord[(x + cell)/2].isTerrain = false;
	          gridCoord[(x + cell)/2].value = 0;
	          gridCoord[x].isTerrain = false;
	          gridCoord[x].value = 0;
          }
        }
      }
	    pathSet.push(...arr);
    }
    // for (let v = 0; v < totalGrid; v++) {
    //   if (gridCoord[v].isTerrain) {
    //     gridCoord[v].isTerrain = false;
    //     gridCoord[v].value = 0;
    //   }
    //   else {
    //     gridCoord[v].isTerrain = true;
    //     gridCoord[v].value = 100;
    //   }
    // }
	}

	sidewinder(gridCoord : GridCoords[]):void{
		// console.log(hGrid,vGrid);
    let currPath = new Array();
    for (var i = 0; i < totalGrid; ++i) {
    	gridCoord[i].isTerrain = true;
      gridCoord[i].value = 100;

    }
    for (let j = 0; j < vGrid; j++) {
      gridCoord[j*hGrid].isTerrain = false;
      gridCoord[j*hGrid].value = 0;
    }
    for (let j = 2; j < hGrid; j+=2) {
      for (let i = 0; i+1 < vGrid; i++) {
      	if(i>=vGrid-3){//edge cases
      		// gridCoord[i*hGrid+j].debug = true;
      		gridCoord[i*hGrid+j].isTerrain = false;
          gridCoord[i*hGrid+j].value = 0;
          gridCoord[(i+1)*hGrid+j].isTerrain = false;
          gridCoord[(i+1)*hGrid+j].value = 0;
          currPath.push(i);
          i++;
          currPath.push(i);

         var x = currPath[Math.floor(Math.random() * currPath.length)];
          while(gridCoord[x*hGrid+j-2].isTerrain){
          	x = currPath[Math.floor(Math.random() * currPath.length)];
          }
          
          gridCoord[x*hGrid+j-1].isTerrain = false;
          gridCoord[x*hGrid+j-1].value = 0;
        	currPath = [];
        	continue;
      	}
        if(Math.random()>0.7 || currPath.length==0){ //path
          gridCoord[i*hGrid+j].isTerrain = false;
          gridCoord[i*hGrid+j].value = 0;
          gridCoord[(i+1)*hGrid+j].isTerrain = false;
          gridCoord[(i+1)*hGrid+j].value = 0;
          currPath.push(i);
          i++;
          currPath.push(i);

        }else{  //no path
          var x = currPath[Math.floor(Math.random() * currPath.length)];
          while(gridCoord[x*hGrid+j-2].isTerrain){
          	x = currPath[Math.floor(Math.random() * currPath.length)];
          }
          // console.log(x,j);
          // gridCoord[x*hGrid+j-1].debug= true;
          gridCoord[x*hGrid+j-1].isTerrain = false;
          gridCoord[x*hGrid+j-1].value = 0;
        	currPath = [];
        }

      }
    }
	}

}
