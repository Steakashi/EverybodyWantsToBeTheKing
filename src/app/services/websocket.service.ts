  import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import * as Rx from 'rxjs';

@Injectable()
export class WebsocketService {

  socket: any;
  readonly url: string = 'ws://localhost:5000';

  constructor() {
    this.socket = io(this.url);
  }

  listen(eventName: string){
    return new Observable(subscriber => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any){
    this.socket.emit(eventName, data);
  }

}
