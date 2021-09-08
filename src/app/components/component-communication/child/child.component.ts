import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss']
})
export class ChildComponent implements OnInit {
  // https://angular.io/guide/inputs-outputs
  @Input() numberFromParent: number | undefined; // decorate the property with @Input()

  @Output() ChildEvent = new EventEmitter<string>();

  emitEvent() {
    if (this.numberFromParent !== undefined) {
      if (this.numberFromParent % 2) {
        this.ChildEvent.emit('numberFromParent is odd');
      } else {
        this.ChildEvent.emit('numberFromParent is even');
      }
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
