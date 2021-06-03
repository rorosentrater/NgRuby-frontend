import { Component, OnInit } from '@angular/core';
import {AddService} from '../services/add/add.service';


@Component({
  selector: 'app-testapi',
  templateUrl: './testapi.component.html',
  styleUrls: ['./testapi.component.scss']
})
export class TestapiComponent implements OnInit {
  model = {
    number1: 2,
    number2: 3,
  }
  result = undefined;
  constructor(private addService: AddService) { }

  ngOnInit(): void {
  }

  submit(formData: any) {
    console.log('formData:');
    console.log(formData);
    console.log(formData.value.number1)
    console.log(formData.value.number2)
    this.addService.addReq(formData.value.number1, formData.value.number2).subscribe(data => console.log('Backend response:', data));
  }
}
