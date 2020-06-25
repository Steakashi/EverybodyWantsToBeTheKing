import {Injectable} from '@angular/core';
import { ToastrService  } from 'ngx-toastr';
import { WebsocketService } from '../websocket.service';
import * as uuid from 'uuid';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


const PENDING = 'PENDING';
const PROCESSING = 'PROCESSING';
const CONNECTED = 'CONNECTED';
const DISCONNECTED = 'DISCONNECTED';
const BLOCKED = 'BLOCKED';
const ERROR = 'ERROR';



@Injectable()
export class LobbyQueriesService{
  title: string;
  socketID: string;
  userID: string;
  userName: string;
  roomID: string;
  roomName: string;
  users = [];
  state: string = null;

  constructor(private toastr: ToastrService,
              private wsService: WebsocketService,
              private router: Router,
              private cookie: CookieService) {}

  set_title(title){
    this.title = title;
  }

  connection_is_allowed(){
    console.log('STATE : ' + this.state);
    if (this.state === BLOCKED){ return false; }
    else {
      this.state = PROCESSING;
      return true;
    }
  }

  is_waiting_order(){
    console.log('STATE ORDER : ' + this.state);
    return this.state === PENDING;
  }

  block_connection(){
    console.log('connection_blocked');
    this.state = BLOCKED;
    this.toastr.error('Connection refused : user already connected to the application.');
  }

  confirm_connection(){
    console.log('CONFIRM CONNECTION');
    console.log(this.state);
    if (this.state === null){
      console.log('###########" YES ! CONNECTING WELL ###########"');
    }
    else{
      this.state = PENDING;
    }
  }

  validate_connection(){
    this.state = CONNECTED;
    this.toastr.success('Connection successfull !');
  }

  invalidate_connection(){
    this.state = ERROR;
    this.toastr.error('Connection has failed !');
  }

  update_users(users){
    this.users = users;
  }

  emit_room_order_creation(userName, roomName) {
    if (!this.connection_is_allowed()){ return; }
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

  emit_room_order_connection(userName, roomID){
    if (!this.connection_is_allowed()){ return; }
    this.wsService.emit(
      'room_connection',
      {
        action: 'room_connection',
        user_id: this.userID,
        user_name: userName,
        room_id: roomID,
      }
    );
  }

  navigate_to_lobby(userName, roomID){
    //if (!this.connection_is_allowed()){ return; }
    this.roomID = roomID;
    this.userName = userName;
    this.router.navigate(['room/' + this.roomID]);
  }

  create_room(roomName, roomID, userName, userID){
    this.roomName = roomName;
    this.roomID = roomID;
    this.userName = userName;
    this.users.push({
      user_name: this.userName,
      user_id: this.userID
    });
    this.router.navigate(['room/' + this.roomID]).then(() => { this.validate_connection(); });
  }

  join_room(roomID, userID, userName, users){
    this.validate_connection();
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
    const retrieved_id = this.cookie.get(this.title);
    if ((retrieved_id === '') || (retrieved_id === undefined) || (retrieved_id === null)){
      this.userID = uuid.v4();
      this.cookie.set(this.title, this.userID);
    }
    else{
      this.userID = retrieved_id;
    }
    console.log('--');
    console.log(retrieved_id);
    console.log(this.userID);

    return this.userID;
    // this.cookie.delete(this.title);
    // this.userID = uuid.v4()
    // this.cookie.set(this.title, 'test cookie');
    // console.log(this.cookie.get(this.title));
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
