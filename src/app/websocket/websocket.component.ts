import { Component, OnInit } from '@angular/core';
import { SimpleWebsocketService } from '../services/simpleWebsocket/simple-websocket.service'


@Component({
  selector: 'app-websocket',
  templateUrl: './websocket.component.html',
  styleUrls: ['./websocket.component.scss']
})
export class WebsocketComponent implements OnInit {

  constructor(private service: SimpleWebsocketService) { }

  ngOnInit(): void {
    this.service.messages$.subscribe(
      msg => {
        console.log('Message from server:', msg)
        // console.log(typeof msg)
        // msg = JSON.parse(msg)
        // console.log('Message from server parsed:', msg)
        // console.log(typeof msg)
      },
      error => {
        console.log('Error on socket connection:', error)
      },
      () => {
        console.log('this is a complete or something idk. Connection was closed?')
      }
    )
    this.service.sendMessage({"action": "whatever", "message": {'key': 'val'}})
    this.service.sendMessage({"action": "whatever", "message": 'simple string message'})
  }

}
