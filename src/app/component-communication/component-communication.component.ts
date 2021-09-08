import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-component-communication',
  templateUrl: './component-communication.component.html',
  styleUrls: ['./component-communication.component.scss']
})
export class ComponentCommunicationComponent implements OnInit {
  parentNumber = 3;
  stringFromChild = 'Child has not emitted any data yet...';
  constructor() { }

  ngOnInit(): void {
  }

}
