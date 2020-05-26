import {Injectable} from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as uuid from 'uuid';

@Injectable()
export class LobbyService{
  // rooms: Subject<any>;
  userID: null;
  roomID: null;

  constructor(private wsService: WebsocketService) {
    this.userID = uuid.v4();
  }

  create_room() {
    this.roomID = uuid.v4();
    this.wsService.emit(
      'room_creation',
      {
        action: 'room_creation',
        room_id: this.roomID,
        user_id: this.userID
      }
    );
  }

  connect_user(){
    this.wsService.emit(
      'user_connexion',
      {
        action: 'user_connexion',
        room_id: null,
        user_id: this.userID,
      }
    );
  }

}
