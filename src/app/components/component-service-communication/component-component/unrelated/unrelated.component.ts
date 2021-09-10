import { Component, OnInit } from '@angular/core';
import { StateService } from "../../../../services/state/state.service";

@Component({
  selector: 'app-unrelated',
  templateUrl: './unrelated.component.html',
  styleUrls: ['./unrelated.component.scss']
})
export class UnrelatedComponent implements OnInit {

  constructor(public stateService: StateService) { }

  ngOnInit(): void {
  }

  setStateTrue() {
    this.stateService.myState = true
  }

  setStateFalse() {
    this.stateService.myState = false
  }
}
