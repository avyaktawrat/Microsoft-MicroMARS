import { Component, OnInit} from '@angular/core';
import { GridCoords } from './GridCoords';

@Component({
  selector: 'app-first-component',
  templateUrl: './first-component.component.html',
  styleUrls: ['./first-component.component.css']
})
export class FirstComponentComponent implements OnInit {

  constructor() {
  }
  height = 653;
  width = 1535;
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
    element.style.fill = 'red';
  }

}
