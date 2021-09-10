import { Component, OnInit } from '@angular/core';
import { StateService } from "../../../../services/state/state.service";


@Component({
  selector: 'app-unrelated2',
  templateUrl: './unrelated2.component.html',
  styleUrls: ['./unrelated2.component.scss']
})
export class Unrelated2Component implements OnInit {

  constructor(public stateService: StateService) {
  }

  ngOnInit(): void {
  }

  toggleState() {
    this.stateService.myState = !this.stateService.myState
  }
}
