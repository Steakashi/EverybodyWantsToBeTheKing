import {Injectable} from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as uuid from 'uuid';


@Injectable()
export class LobbyService{
  // rooms: Subject<any>;
  userID: null;
  userName: null;
  roomID: null;
  roomName: null;

  constructor(private wsService: WebsocketService) {
    this.userID = uuid.v4();
  }

  emit_room_order_creation(userName, roomName) {
    this.wsService.emit(
      'room_creation',
      {
        action: 'room_creation',
        user_id: this.userID,
        user_name: userName,
        room_id: uuid.v4(),
        room_name: roomName,
      }
    );
  }

  create_room(roomName, roomID){
    console.log('create room');
    this.roomName = roomName;
    this.roomID = roomID;
  }

  get_current_room_name(){
    console.log('return name : ' + this.roomName)
    return this.roomName;
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
