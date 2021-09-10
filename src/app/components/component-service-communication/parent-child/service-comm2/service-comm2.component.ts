import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { StateService } from "../../../../services/state/state.service";
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-service-comm2',
  templateUrl: './service-comm2.component.html',
  styleUrls: ['./service-comm2.component.scss']
})
export class ServiceComm2Component implements OnInit {

  @Input() astronaut = '';
  mission = '<no mission announced>';
  confirmed = false;
  announced = false;
  subscription: Subscription;

  constructor(private stateService: StateService) {
    this.subscription = stateService.missionAnnounced$.subscribe(
      mission => {
        this.mission = mission;
        this.announced = true;
        this.confirmed = false;
      });
  }

  confirm() {
    this.confirmed = true;
    this.stateService.confirmMission(this.astronaut);
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
