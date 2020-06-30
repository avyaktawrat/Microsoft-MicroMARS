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
  ngOnInit() {
    for (let i = 0; i < 70; i++) {
      for (let j = 0; j < 60; j++) {
        this.gridCord[30 * i + j] = {x: i * 30, y: j * 30};
      }
    }
  }

  changeColor(a: number, b: number): void {
    console.log(a,b);
    let element = document.getElementsByTagName('rect')[a+Math.floor(b/30)];
    if (element.style.fill == 'red'){
      element.style.fill = 'white';
    }
    else {element.style.fill = 'red'}
  }
  //choose obstacle
  chooseColor(a: number, b: number): void {
    console.log(a,b);
    let element = document.getElementsByTagName('rect')[a+Math.floor(b/30)];
    //window.alert("Hello There");
    //let value:number = window.prompt("Please enter obstacle %");
    //console.log(value);
    //element.style.fill = "rgb(256, 0, 0,value/100)";
  }

}
