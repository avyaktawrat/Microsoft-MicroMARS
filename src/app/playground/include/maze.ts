import {utils } from './utils';
import { GridCoords } from './GridCoords';
import {hGrid, vGrid, totalGrid} from './constants';

let Utils: utils = new utils();

export class maze  {   // class implementing different maze-generating algorithms
	constructor() {}

	rand(gridCoord : GridCoords[]):void{      // random maze
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

	stair(gridCoord : GridCoords[]):void{     // maze in the form of stair case
		let i = 0;
	  for ( i = 0; i <= (hGrid-5)*(hGrid+1); i=i+hGrid+1) {
	    gridCoord[i].isTerrain = true;
	    gridCoord[i].value = 100;
	  }
	  for ( i = (hGrid-5)*(hGrid+1); i%hGrid !=0 ; i=i+hGrid-1) {
	    gridCoord[i].isTerrain = true;
	    gridCoord[i].value = 100;
	  }
	    gridCoord[i].isTerrain = false;
	    gridCoord[i].value = 0;
	    i+=2;
	  for(let j=0; j<5;j++){
	    gridCoord[i+j*(hGrid+1)].isTerrain = true;
	    gridCoord[i+j*(hGrid+1)].value = 100;
	  }
	}

	binary(gridCoord : GridCoords[]):void{     // maze using binary tree
		for (let i = 0; i < totalGrid; ++i) {
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

	dfsMaze(gridCoord : GridCoords[]):void{      // maze using depth-first-search
			function removeElement(array, elem) {
          let index = array.indexOf(elem);
          if (index > -1) {
              array.splice(index, 1);
          }
      }

			for (let i = 0; i < totalGrid; ++i) {
	    	gridCoord[i].isTerrain = true;
	      gridCoord[i].value = 100;
    	}
      let s = Array();
      s.push(0);
      let step = 0;
      while (s.length !== 0) {
      	step++;
        let v = s.pop();

        gridCoord[v].isTerrain = false;
        gridCoord[v].value = 0;
        let arr1 = new Array();
        let arr = Utils.direction8_maze(v, gridCoord);

        if(arr.length === 0){
        	continue;
        }
        arr1.length = arr.length;
        arr1 = arr;
        while(arr.length !== 0){
        	let u = arr[Math.floor(Math.random()*arr.length)]; //add to list in random order
					removeElement(arr, u);
	        gridCoord[(u+v)/2].isTerrain = false;
       	 	gridCoord[(u+v)/2].value = 0;
       	 	gridCoord[u].isTerrain = false;
        	gridCoord[u].value = 0;
        	s.push(u);
      	}
      }
	}

	primMaze(gridCoord : GridCoords[]){        // maze using Prim's Algorithm
    for (let i = 0; i < totalGrid; ++i) {   // initialize the grid
      gridCoord[i].isTerrain = true;
      gridCoord[i].value = 100;
    }
	  let start = Math.floor(Math.random() * totalGrid);  // start with a random number
    if (start === 0) {
      start += Math.floor(Math.random() * totalGrid);   // handling the corner case
    }
	  let pathSet = [start];   // pathSet contains all the visited nodes of the grid
	  while (pathSet.length !== 0) {
	    let cell = pathSet.pop();
	    let arr = Utils.direction8_maze(cell, gridCoord);   // get the neighboring cells of the maze
	    if (arr.length !== 0) {
	      let randIdx = Math.floor(Math.random() * arr.length);
	      while (!gridCoord[randIdx].isTerrain) {                 // choose a random neighbor which is not visited yet
	        randIdx = Math.floor(Math.random() * arr.length);
        }
	      gridCoord[cell].isTerrain = false;   // connect the current node and this neighbor
	      gridCoord[cell].value = 0;
        arr.sort(() => Math.random() - 0.5);   // randomly shuffle the neighbors of the current node
	      for (let x of arr) {
	        if (x !== randIdx) {
	          gridCoord[(x + cell)/2].isTerrain = false;   // connect all the neighbors of the current node in random order
	          gridCoord[(x + cell)/2].value = 0;
	          gridCoord[x].isTerrain = false;
	          gridCoord[x].value = 0;
          }
        }
      }
	    pathSet.push(...arr);  // push all the connected neighbors
    }
	}

	sidewinder(gridCoord : GridCoords[]):void{    // Side-Winder algorithm to generate maze
    let currPath = new Array();
    for (let i = 0; i < totalGrid; ++i) {
    	gridCoord[i].isTerrain = true;
      gridCoord[i].value = 100;

    }
    for (let j = 0; j < vGrid; j++) {
      gridCoord[j*hGrid].isTerrain = false;
      gridCoord[j*hGrid].value = 0;
    }
    for (let j = 2; j < hGrid; j+=2) {
      for (let i = 0; i+1 < vGrid; i++) {
      	if(i >= vGrid-3){               //edge cases
      		gridCoord[i*hGrid+j].isTerrain = false;
          gridCoord[i*hGrid+j].value = 0;
          gridCoord[(i+1)*hGrid+j].isTerrain = false;
          gridCoord[(i+1)*hGrid+j].value = 0;
          currPath.push(i);
          i++;
          currPath.push(i);

         let x = currPath[Math.floor(Math.random() * currPath.length)];
          while(gridCoord[x*hGrid+j-2].isTerrain){
          	x = currPath[Math.floor(Math.random() * currPath.length)];
          }

          gridCoord[x*hGrid+j-1].isTerrain = false;
          gridCoord[x*hGrid+j-1].value = 0;
        	currPath = [];
        	continue;
      	}
        if(Math.random()>0.5 || currPath.length === 0){           //path
          gridCoord[i*hGrid+j].isTerrain = false;
          gridCoord[i*hGrid+j].value = 0;
          gridCoord[(i+1)*hGrid+j].isTerrain = false;
          gridCoord[(i+1)*hGrid+j].value = 0;
          currPath.push(i);
          i++;
          currPath.push(i);

        }
        else{                 //no path
          let x = currPath[Math.floor(Math.random() * currPath.length)];
          while(gridCoord[x*hGrid+j-2].isTerrain){
          	x = currPath[Math.floor(Math.random() * currPath.length)];
          }
          gridCoord[x*hGrid+j-1].isTerrain = false;
          gridCoord[x*hGrid+j-1].value = 0;
        	currPath = [];
        }
      }
    }
	}

}
