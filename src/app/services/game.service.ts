import { Injectable } from '@angular/core';
import { PlayerService } from './player.service';
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

  constructor(private player: PlayerService,
              private actionManager: ActionManager,
              private lobby: LobbyService) { }

  players = [];

  initialize(user){
    this.player.initialize(user)
  }

  get_player(){
    return this.player;
  }

  get_players(){
    return this.players;
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

  update_players(players){
    this.players = players;
    players.forEach(given_player => {
      if (given_player.id === this.player.user.id) this.player.synchronize(given_player);
    })
  }

  launch_game(users){
    this.update_players(users);
    this.lobby.launch_game(users);
  }

  begin_turn(){
    this.lobby.emit_synchronization(this.get_player())
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
    //this.lobby.emit_action_state_processed(this.get_player())
  }

  end_round(players, events){
    this.update_players(players);
    this.processed_events = [];
    for (let user_id in events) {
      var event = new Event();
      if (this.get_player().user.id == events[user_id].emitter){
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
