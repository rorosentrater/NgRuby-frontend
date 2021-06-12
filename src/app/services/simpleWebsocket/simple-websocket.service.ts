import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {environment} from '../../../environments/environment';

export const WS_ENDPOINT = environment.backendWebsocketEndpoint;
@Injectable({
  providedIn: 'root'
})
export class SimpleWebsocketService {

  // private socket$  = webSocket(WS_ENDPOINT);
  private socket$  = webSocket({
    url: WS_ENDPOINT,
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
    }
  });
  public messages$ = this.socket$.asObservable();

  constructor() { }

  public sendMessage(msg: { action: string; message: string | object; }) {
    this.socket$.next(msg);
  }

}
