import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as uuid from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class LobbyService {
  rooms: Subject<any>;
  userID: null;

  constructor(private wsService: WebsocketService) {
    this.rooms = (wsService
      .connect() as Subject<any>);
    map((response: any): any => {
      return response;
    });
    this.userID = uuid.v4();
  }

  create_room(id) {
    this.rooms.next({
      action: 'room_creation',
      room_id: id,
      user_id: this.userID
    });
  }

  connect_user(){
    this.rooms.next({
      action: 'user_connexion',
      room_id: null,
      user_id: this.userID,
    });
  }

}
