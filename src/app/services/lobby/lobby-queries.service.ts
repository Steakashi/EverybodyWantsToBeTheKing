import {Injectable} from '@angular/core';
import { ToastrService  } from 'ngx-toastr';
import { WebsocketService } from '../websocket.service';
import * as uuid from 'uuid';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {ExecutionPileService} from '../execution-pile.service';


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
  urlRoomID: string;
  roomName: string;
  users = [];
  state: string = null;

  constructor(private toastr: ToastrService,
              private wsService: WebsocketService,
              private executionPile: ExecutionPileService,
              private router: Router,
              private cookie: CookieService) {}

  set_title(title){
    this.title = title;
  }

  set_room_id_from_url(roomID){
    this.roomID = roomID;
  }

  connection_is_allowed(){
    if (this.state === BLOCKED){ return false; }
    else {
      this.state = PROCESSING;
      return true;
    }
  }

  is_waiting_order(){
    return (this.state === PENDING) || (this.state === PROCESSING);
  }

  validate_connection(){
    this.state = CONNECTED;
    this.toastr.success('Connection successfull !');
    this.executionPile.flush();
  }

  invalidate_connection(){
    this.state = ERROR;
    this.toastr.error('Connection has failed !');
    this.executionPile.flush();
  }

  block_connection(){
    this.state = BLOCKED;
    this.toastr.error('Connection refused : user already connected to the application.');
    this.executionPile.flush();
  }

  confirm_connection(){
    console.log('####### CONFIRM CONNECTION');
    console.log(this);
    this.state = this.executionPile.is_empty() ? PENDING : PROCESSING;
    this.executionPile.process();
  }

  update_users(users){
    this.users = users;
  }

  update_user(userName){
    this.userName = userName;
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

  emit_room_order_connection(){
    if (!this.connection_is_allowed()){ return; }
    this.wsService.emit(
      'room_connection',
      {
        action: 'room_connection',
        user_id: this.userID,
        user_name: this.userName !== undefined ? this.userName : 'randomName',
        room_id: this.roomID,
      }
    );
  }

  emit_user_update(userName){
    this.wsService.emit(
      'user_update',
      {
        action: 'user_update',
        user_id: this.userID,
        user_name: userName,
        room_id: this.roomID,
      }
    );
  }

  navigate_to_lobby(userName, roomID){
    this.roomID = roomID;
    this.userName = userName;
    this.router.navigate(['room/' + this.roomID]).then(() => { this.emit_room_order_connection(); });
    //
  }

  create_room(roomName, roomID, userName, userID){
    this.roomName = roomName;
    this.roomID = roomID;
    console.log('CREATING ROOM');
    console.log(this.roomID);
    this.userName = userName;
    this.users.push({
      user_name: this.userName,
      user_id: this.userID
    });
    this.router.navigate(['room/' + this.roomID]).then(() => { this.validate_connection(); });
  }

  join_room(roomID, roomName, userID, userName){
    this.roomID = roomID;
    this.roomName = roomName;
    this.userName = userName;
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
    const retrievedID = this.cookie.get(this.title);
    if ((retrievedID === '') || (retrievedID === undefined) || (retrievedID === null)){
      this.userID = uuid.v4();
      this.cookie.set(this.title, this.userID);
    }
    else{
      this.userID = retrievedID;
    }

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
