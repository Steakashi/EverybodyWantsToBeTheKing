import {Injectable} from '@angular/core';
import { WebsocketService } from '../websocket.service';
import * as uuid from 'uuid';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'


@Injectable()
export class LobbyQueriesService{
  title: string;
  socketID: string;
  userID: string;
  userName: string;
  roomID: string;
  roomName: string;
  users = [];
  state = 'DISCONNECTED';

  constructor(private wsService: WebsocketService,
              private router: Router,
              private cookie: CookieService) {}

  set_title(title){
    this.title = title;
  }

  begin_connexion(){
    this.state = 'WAITING';
  }

  validate_connexion(){
    this.state = 'CONNECTED';
  }

  invalidate_connexion(){
    this.state = 'ERROR';
  }

  update_users(users){
    this.users = users;
  }

  emit_room_order_creation(userName, roomName) {
    this.begin_connexion();
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

  emit_room_order_connexion(userName, roomID){
    this.begin_connexion();
    this.wsService.emit(
      'room_connexion',
      {
        action: 'room_connexion',
        user_id: this.userID,
        user_name: userName,
        room_id: roomID,
      }
    );
  }

  create_room(roomName, roomID, userName, userID){
    this.roomName = roomName;
    this.roomID = roomID;
    this.userName = userName;
    this.users.push({
      user_name: this.userName,
      user_id: this.userID
    });
    this.router.navigate(['room/' + this.roomID]).then(() => { this.validate_connexion(); });
  }

  join_room(roomID, userID, userName, users){
    this.roomID = roomID;
    this.userName = userName;
    this.router.navigate(['room/' + this.roomID]).then(() => { this.validate_connexion(); });
  }

  get_current_room_name(){
    console.log('return name : ' + this.roomName);
    return this.roomName;
  }
  /*
  connect_user(){
    this.wsService.emit(
      'user_connexion',
      {
        action: 'user_connexion',
        room_id: null,
        user_id: this.userID,
      }
    );
  }*/

  connect_user(){
    const retrieved_id = this.cookie.get(this.title)
    if ((retrieved_id === '') || (retrieved_id === undefined) || (retrieved_id === null)){
      this.userID = uuid.v4()
      this.cookie.set(this.title, this.userID);
    }
    else{
      this.userID = retrieved_id;
    }
    console.log('--')
    console.log(retrieved_id);
    console.log(this.userID);

    return this.userID
    //this.cookie.delete(this.title);
    //this.userID = uuid.v4()
    //this.cookie.set(this.title, 'test cookie');
    //console.log(this.cookie.get(this.title));
  }

  get_user_id(){
    return this.userID;
  }

  disconnect_user(){
    this.wsService.emit(
      'user_disconnection',
      {
        action: 'user_disconnection',
        room_id: this.roomID,
        user_id: this.userID,
      }
    );
  }

}
