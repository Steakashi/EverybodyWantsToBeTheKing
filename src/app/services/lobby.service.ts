import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LobbyService {
  rooms: Subject<any>;

  constructor(private wsService: WebsocketService) {
    this.rooms = (wsService
      .connect() as Subject<any>);
    map((response: any): any => {
      return response;
    });
  }

  create_room(id) {
    this.rooms.next(id);
  }

}
