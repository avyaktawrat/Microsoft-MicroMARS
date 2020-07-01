import { Component, OnInit} from '@angular/core';
import { GridCoords } from './GridCoords';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-first-component',
  templateUrl: './first-component.component.html',
  styleUrls: ['./first-component.component.css']
})
export class FirstComponentComponent implements OnInit {

  constructor() {
  } 
  height = window.innerHeight;
  width = screen.height;
  gridCord: GridCoords[] = new Array(4200);
  mouseDown : boolean = false;
  toFill:boolean = true;
  color :number = 2; //0 red 1 green 2 other
  i :number = 0;
  ngOnInit() {
    for (let i = 0; i < 70; i++) {
      for (let j = 0; j < 60; j++) {
        this.gridCord[30 * i + j] = {x: i * 30, y: j * 30};
      }
    }
  }

  fillGrey(a: number, b: number): void {
    console.log(a,b);  
    let element = document.getElementsByTagName('rect')[a+Math.floor(b/30)];
    if(this.mouseDown == true && !(element.style.fill == "green" || element.style.fill == "red" )){
      element.style.fill = "grey";
    }
  }

  fillColor (a :number , b:number): void{
    console.log('toggle');    
    let element = document.getElementsByTagName('rect')[a+Math.floor(b/30)];
    if(element.style.fill == "green"){  //clicked color is green
      console.log('green');
      element.style.fill = "white";
      this.toFill = true;
      this.color = 1;
    }else if (element.style.fill == "red") {//clicked color is red
      console.log('red');
      element.style.fill = "white";
      this.toFill = true;
      this.color = 0;
    }else{      //clicked color is white or grey
      console.log ('white or grey');

        if(this.i == 0){      // prev click color red
          element.style.fill = "red";
          this.i++;
        }else if (this.i == 1) {// prev click color green
          element.style.fill = "green";
          this.i++;
        }else{    // fill red green or grey
          if(this.color == 0){
            element.style.fill = "red";
            this.color  = 2;
          }else if(this.color == 1){
            element.style.fill = "green";
            this.color = 2;
          }else{    // toggle grey
            if(element.style.fill == "grey"){
              element.style.fill = "white";
            }else{
            element.style.fill = "grey";
          }
        }
      }
      
    }
  }


  mouseUp (a :number , b:number): void{
    this.mouseDown = false;
  }
  mouseDownE (a :number , b:number): void{
    this.mouseDown = true;
  }


  //choose obstacle
  chooseColor(a: number, b: number): void {
    console.log(a,b);
    console.log('hello');
    let element = document.getElementsByTagName('rect')[a+Math.floor(b/30)];
    //window.alert("Hello There");
    //let value:number = window.prompt("Please enter obstacle %");
    //console.log(value);
    //element.style.fill = "rgb(256, 0, 0,value/100)";
  }

}
