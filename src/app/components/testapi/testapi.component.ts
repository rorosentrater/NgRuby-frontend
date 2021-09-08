import { Component, OnInit } from '@angular/core';
import {AddService} from '../../services/add/add.service';


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
  loading = false;
  result: any;

  constructor(private addService: AddService) { }

  ngOnInit(): void {
  }

  submit(formData: any) {
    this.result = undefined; // Clear any existing result
    this.loading = true      // Loading flag so we can show a spinner
    // console.log('formData:');
    // console.log(formData);
    // console.log(formData.value.number1)
    // console.log(formData.value.number2)
    this.addService.addReq(formData.value.number1, formData.value.number2).subscribe(
      data => {this.result = data; this.loading = false;});
  }
}
