import { Component, OnInit } from '@angular/core';
import { SimpleWebsocketService } from '../services/simpleWebsocket/simple-websocket.service'


@Component({
  selector: 'app-websocket',
  templateUrl: './websocket.component.html',
  styleUrls: ['./websocket.component.scss']
})
export class WebsocketComponent implements OnInit {

  messages: any[] = [];
  model = {
    newMessage: ''
  }

  constructor(private service: SimpleWebsocketService) { }

  ngOnInit(): void {
    // Sub to the messages observable
    this.service.messages$.subscribe(
      msg => {
        console.log('Message from server:', msg)
        this.messages.unshift(msg) // Push messages to local array so this component can reference and display them
      },
      error => {
        console.log('Error on socket connection:', error)
      },
      () => {
        console.log('this is a complete or something idk. Connection was closed?')
      }
    )
  }

  submit(formData: any) {
    this.service.sendMessage({"action": "whatever", "message": formData.value.message})
  }

}
