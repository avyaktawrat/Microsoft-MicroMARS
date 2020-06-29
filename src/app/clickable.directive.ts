import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appClickable]'
})
export class ClickableDirective {

  constructor(private el: ElementRef) {
    this.el.nativeElement.setAttribute('clickable', true);
  }

  @HostListener('mouseclick', ['$event'])
  changeColor(event) {
    const elementToBeClicked = event.target.getElementsByTagName('rect')[0];
    elementToBeClicked.style = {fill: "green"};
  }

}
