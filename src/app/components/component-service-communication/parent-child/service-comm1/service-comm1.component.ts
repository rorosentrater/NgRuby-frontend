import { Component, OnInit } from '@angular/core';
import { StateService } from "../../../../services/state/state.service";

@Component({
  selector: 'app-service-comm1',
  templateUrl: './service-comm1.component.html',
  styleUrls: ['./service-comm1.component.scss']
})
export class ServiceComm1Component implements OnInit {

  astronauts = ['Lovell', 'Swigert', 'Haise'];
  history: string[] = [];
  missions = ['Fly to the moon!',
    'Fly to mars!',
    'Fly to Vegas!'];
  nextMission = 0;

  constructor(private stateService: StateService) {
    stateService.missionConfirmed$.subscribe(
      astronaut => {
        // Every time a new event
        this.history.push(`${astronaut} confirmed the mission`);
      });
  }

  announce() {
    const mission = this.missions[this.nextMission++];
    this.stateService.announceMission(mission);
    this.history.push(`Mission "${mission}" announced`);
    if (this.nextMission >= this.missions.length) { this.nextMission = 0; }
  }

  ngOnInit(): void {

  }

}
