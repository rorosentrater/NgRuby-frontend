import { Component, OnInit } from '@angular/core';
import { AdvWebsocketService } from '../../services/advWebsocket/adv-websocket.service'


@Component({
  selector: 'app-websocket',
  templateUrl: './websocket.component.html',
  styleUrls: ['./websocket.component.scss']
})
export class WebsocketComponent implements OnInit {

  messages: any[] = []; // array we will fill with messages from SimpleWebsocketService
  advMessages: any[] = []; // array we will fill with messages from SimpleWebsocketService
  advMessages2: any[] = []; // array we will fill with messages from SimpleWebsocketService
  // Model for chat box form
  advModel = {
    newMessage: ''
  }
  advModel2 = {
    newMessage: ''
  }
  // @ts-ignore
  sub;
  // @ts-ignore
  sub2;

  constructor(public advService: AdvWebsocketService) { }

  ngOnInit(): void {

    // Sub to the messages observable
    this.sub = this.advService.messages$.subscribe(
        (msg: any) => {
        console.log('ADV Message from server:', msg)
        this.advMessages.unshift(msg) // Push messages to local array so this component can reference and display them
      },
        (error: any) => {
        console.log('ADV Error on socket connection:', error)
      },
      () => {
        console.log('ADV Socket connection closed. By server or client?')
      }
    )

    this.sub2 = this.advService.messages$.subscribe(
      (msg: any) => {
        console.log('2 ADV Message from server:', msg)
        this.advMessages2.unshift(msg) // Push messages to local array so this component can reference and display them
      },
      (error: any) => {
        console.log('2 ADV Error on socket connection:', error)
      },
      () => {
        console.log('2 ADV Socket connection closed. By server or client?')
      }
    )
  }


  advSubmit(advmessageForm: any) {
    this.advService.sendMessage({"action": "whatever", "message": advmessageForm.value.message})
  }

  advSubmit2(advmessageForm: any) {
    this.advService.sendMessage({"action": "whatever", "message": advmessageForm.value.message})
  }
}
