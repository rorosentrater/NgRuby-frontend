import { Injectable } from '@angular/core';
import {webSocket} from "rxjs/webSocket";
import {environment} from '../../../environments/environment';
import {catchError, tap, repeat, takeUntil} from "rxjs/operators";
import { ReplaySubject, Subject } from 'rxjs';
import {EMPTY} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AdvWebsocketService {
  private closed$ = new Subject;
  // @ts-ignore
  private socket$ = this.getNewWebSocket();
  // @ts-ignore
  public messages$ = this.socket$.asObservable().pipe(takeUntil(this.closed$), repeat(-1 ));

  constructor() { }

  public sendMessage(msg: { action: string; message: string | object; }) {
    console.log('sendMessage()')
    this.socket$.next(msg);
  }

  public closeConnection() {
    console.log('closeConnection()')
    this.closed$.next();
  }

  private getNewWebSocket() {
    console.log('ADV getNewWebSocket()')
    return webSocket({
      url: environment.backendWebsocketEndpoint,
      deserializer: msg => {
        // If for some reason you want the whole response from AWS (you'll have to parse .data yourself)
        // return msg;

        // try to parse message as json. If we can't, just return whatever it is (usually bare string)
        try {
          return JSON.parse(msg.data);
        } catch (e) {
          console.warn('Websocket response could not be parsed as JSON. Returning raw value.')
          return msg.data;
        }
      },
      closeObserver: {
        next: () => {
          console.log('ADV websocket service: connection closed');
        }
      },
    });
  }
}
