import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import * as Rx from 'rxjs';

@Injectable()
export class WebsocketService {

  // Our socket connection
  private socket;
  private id;

  constructor() { }

  parse_incoming_data(data){
    return JSON.parse(data);
  }

  connect(): Subject<MessageEvent> {
    // If you aren't familiar with environment variables then
    // you can hard code `environment.ws_url` as `http://localhost:5000`
    this.socket = io('http://localhost:5000');

    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    const observable = new Observable(observer => {
      this.socket.on('room_creation', (data) => {
        console.log('Received room creation order on client.');
        console.log(data);
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });

    // We define our Observer which will listen to messages
    // from our other components and send messages back to our
    // socket server whenever the `next()` method is called.
    const observer = {
      next: (data: Object) => {
        if (!('action' in data)){
          console.log('ERROR : no actionType found in observer incoming data.');
        }

        const action = data['action'];
        if (action === 'room_creation') {
          this.socket.emit('room_creation', JSON.stringify(data));
        }
      },
    };

    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return Subject.create(observer, observable);
  }

}
