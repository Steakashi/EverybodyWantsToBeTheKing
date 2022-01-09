import { Injectable} from '@angular/core';
import { ToastrService  } from 'ngx-toastr';
import * as uuid from 'uuid';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { ExecutionPileService } from './execution-pile.service';
import { WebsocketService } from './websocket.service';
import { User } from './user.service';
import { Room } from './room.service';


import * as cst from './constants';


const PENDING = 'PENDING';
const PROCESSING = 'PROCESSING';
const CONNECTED = 'CONNECTED';
const BLOCKED = 'BLOCKED';
const ERROR = 'ERROR';


@Injectable()
export class LobbyService{
  title: string;
  user: any;
  room: any;
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

  set_room_id_from_url(room_id){
    this.room = new Room();
    this.room.id = room_id;
  }

  set_user_name(user_name){
    this.user.name = user_name;
  }

  get_user_id(){
    if (this.user) return this.user.id;
  }

  get_user_name(){
    if (this.user) return this.user.name;
  }

  get_current_room_name(){
    if (this.room) return this.room.name;
  }

  get_default_name(){
    return cst.DEFAULT_NAMES[Math.floor(Math.random()*cst.DEFAULT_NAMES.length)];
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

  launch_game(users){
    this.update_users(users);
    this.router.navigate(['game/' + this.room.id]);
  }

  emit_room_order_creation(user_name, room_name) {
    if (!this.connection_is_allowed()){ return; }
    if (user_name.trim() === '') user_name = this.get_default_name();
    this.wsService.emit(
      'room_creation',
      {
        user_id: this.user.id,
        user_name: user_name,
        room_id: uuid.v4(),
        room_name: room_name,
      }
    );
  }

  emit_room_order_connection(){
    if (!this.connection_is_allowed()){ return; }
    this.wsService.emit(
      'room_connection',
      {
        user_id: this.user.id,
        user_name: this.user.name !== undefined ? this.user.name : this.get_default_name(),
        room_id: this.room.id,
      }
    );
  }

  emit_user_order_update(){
    this.wsService.emit(
      'user_update',
      {
        user_id: this.user.id,
        user_name: this.user.name,
        room_id: this.room.id,
      }
    );
  }

  emit_game_order_launch(){
    this.wsService.emit('game_launch',{});
  }

  emit_turn_end(action){
    console.log(action)
    this.wsService.emit('turn_end',
      {
        'action': action
      }
    );
  }

  emit_synchronization(user){
    this.wsService.emit(
      'synchronization', 
      {
        'player': user
      }
    );
  }

  emit_action_state_processed(user){
    this.wsService.emit(
      'action_state_processed', 
      {
        'player': user
      }
    );
  }

  navigate_to_lobby(user_name, room_id){
    // TODO : check if we need to fix room id at this moment
    //this.room.id = room_id;
    this.user.name = user_name;
    this.router.navigate(['room/' + room_id]).then(() => { this.emit_room_order_connection(); });
  }

  create_room(room_name, room_id, user_name){
    this.room = new Room();
    this.room.id = room_id;
    this.room.name = room_name;

    this.user.name = user_name;
    this.users.push(this.user);
    this.router.navigate(['room/' + this.room.id]).then(() => { this.validate_connection(); });
  }

  join_room(room_id, room_name){
    this.room = new Room();
    this.room.id = room_id;
    this.room.name = room_name;
    this.validate_connection();
  }

  connect_user(){
    const retrievedID = this.cookie.get(this.title);
    if ((retrievedID === '') || (retrievedID === undefined) || (retrievedID === null)){
      this.user = new User();
      this.user.id = uuid.v4();
      this.cookie.set(this.title, this.user.id);
    }
    else{
      this.user = new User();
      this.user.id = retrievedID;
    }
  }
/*
  update_users(users){
    this.users = users;
    this.users.forEach(user => {
      if (user.id === this.user.id){ this.user = user; }
    })
  }*/

  update_users(users){
    this.users = [];
    users.forEach(given_user => {
      var user = new User();
      user.synchronize(given_user);
      this.users.push(user);
      if (given_user.id === this.user.id) this.user.synchronize(given_user);
    })
    console.log(this.users);
  }

  update_user(user){
    console.log('update_user');
    console.log(user);
    this.user.synchronize(user);
  }

}
