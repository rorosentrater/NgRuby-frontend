import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pipe',
  templateUrl: './pipe.component.html',
  styleUrls: ['./pipe.component.scss']
})
export class PipeComponent implements OnInit {
  myText = 'It smells'
  myNumber = 24.99
  constructor() { }

  ngOnInit(): void {
  }

}
