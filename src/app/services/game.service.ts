import { Injectable } from '@angular/core';
import { User } from './user.service';
import { ActionManager } from './actions/action-manager.service'
import { LobbyService } from './lobby.service'
import { TestBed } from '@angular/core/testing';
import { NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';

const TURNTIME = 60;
const NOT_INITIALIZED = 'NOT_INITIALIZED';
const PROCESSING = 'PROCESSING';
const CHOOSING = 'CHOOSING';
const RESULTS = 'RESULTS';

class Event {
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {

  actionPile: any = [];
  action: any;
  clock: number;
  gamestate: string;
  processed_events: any = [];

  constructor(private actionManager: ActionManager,
              private lobby: LobbyService) { }

  users = [];

  initialize(){
    var user = this.get_user();
    console.log(user);
    console.log(typeof(user));
    console.dir(user);
    user.reset_stats();
  }

  get_user(){
    return this.lobby.user;
  }

  get_users(){
    return this.lobby.users;
  }

  get_action(){
    return this.action;
  }

  actions(){
    return this.actionManager.get_all_actions();
  }

  events(){
    return this.processed_events;
  }

  register_action(action){
    this.action = action;
  }

  remove_action(){
    console.log('remove aciton');
    this.action = null;
  }
  
  turn_clock(value){
    this.clock = value;
  }

  update_users(users){
    this.lobby.users = users;
    users.forEach(given_user => {
      if (given_user.id === this.get_user().id) this.get_user().synchronize(given_user);
    })
  }

  begin_turn(){
    this.lobby.emit_synchronization(this.get_user())
    this.gamestate = CHOOSING;
    this.clock = TURNTIME;
  }

  begin_round(){
    this.clock = 0;
  }

  play(action, group_target){
    console.log(action);
    console.log(group_target);
    //status = this.action.process();
    //this.lobby.emit_action_state_processed(this.get_user())
  }

  end_round(users, events){
    this.update_users(users);
    this.processed_events = [];
    for (let user_id in events) {
      var event = new Event();
      if (this.get_user().id == events[user_id].emitter){
        event.message = events[user_id].custom_message
      }
      else{  
        event.message = events[user_id].public_message
      }
      this.processed_events.push(event);
    };
    console.log(this.processed_events);
    this.gamestate = CHOOSING;
    this.clock = TURNTIME;
  }

}
