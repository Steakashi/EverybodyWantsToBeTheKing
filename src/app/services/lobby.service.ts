import {Injectable} from '@angular/core';
import { ToastrService  } from 'ngx-toastr';
import { WebsocketService } from './websocket.service';
import * as uuid from 'uuid';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {ExecutionPileService} from './execution-pile.service';


const PENDING = 'PENDING';
const PROCESSING = 'PROCESSING';
const CONNECTED = 'CONNECTED';
const BLOCKED = 'BLOCKED';
const ERROR = 'ERROR';


@Injectable()
export class LobbyService{
  title: string;
  user = {name: undefined, id: undefined};
  room = {name: undefined, id: undefined};
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
    this.room.id = roomID;
  }

  get_user_id(){
    return this.user.id;
  }

  get_current_room_name(){
    return this.room.name;
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
    this.state = this.executionPile.is_empty() ? PENDING : PROCESSING;
    this.executionPile.process();
  }

  emit_room_order_creation(userName, roomName) {
    if (!this.connection_is_allowed()){ return; }
    this.wsService.emit(
      'room_creation',
      {
        action: 'room_creation',
        user_id: this.user.id,
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
        user_id: this.user.id,
        user_name: this.user.name !== undefined ? this.user.name : 'randomName',
        room_id: this.room.id,
      }
    );
  }

  emit_user_order_update(userName){
    this.wsService.emit(
      'user_update',
      {
        action: 'user_update',
        user_id: this.user.id,
        user_name: userName,
        room_id: this.room.id,
      }
    );
  }

  emit_game_order_creation(){
    console.log('emit order');
  }

  navigate_to_lobby(userName, roomID){
    this.room.id = roomID;
    this.user.name = userName;
    this.router.navigate(['room/' + this.room.id]).then(() => { this.emit_room_order_connection(); });
  }

  create_room(roomName, roomID, userName){
    this.room.name = roomName;
    this.room.id = roomID;
    this.user.name = userName;
    this.users.push({
      user_name: this.user.name,
      user_id: this.user.id
    });
    this.router.navigate(['room/' + this.room.id]).then(() => { this.validate_connection(); });
  }

  join_room(roomID, roomName, userID, userName){
    this.room.id = roomID;
    this.room.name = roomName;
    this.user.id = userID;
    this.user.name = userName;
    this.validate_connection();
  }

  connect_user(){
    const retrievedID = this.cookie.get(this.title);
    if ((retrievedID === '') || (retrievedID === undefined) || (retrievedID === null)){
      this.user.id = uuid.v4();
      this.cookie.set(this.title, this.user.id);
    }
    else{
      this.user.id = retrievedID;
    }

    return this.user.id;
  }

  update_users(users){
    this.users = users;
  }

  update_user(user){
    this.user = user;
  }

}
