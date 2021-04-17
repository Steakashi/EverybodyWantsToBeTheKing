import { Injectable } from '@angular/core';
import { PlayerService } from './player.service';
import { ActionManager } from './actions/action-manager.service'
import { LobbyService } from './lobby.service'
import { TestBed } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  actionPile: any = [];
  action: any;
  clock: number;

  constructor(private player: PlayerService,
              private actionManager: ActionManager,
              private lobby: LobbyService) { }

  initialize(playerName){
    this.player.initialize(playerName)
  }

  get_player(){
    return this.player;
  }

  get_action(){
    return this.action
  }

  actions(){
    return this.actionManager.get_all_actions();
  }

  register_action(action){
    this.action = action;
  }
  
  turn_clock(value){
    this.clock = value;
  }

  begin_round(){
    this.clock = 0;
  }

  play(){
    status = this.action.process();
    console.log("has played")
    this.lobby.emit_synchronization(this.get_player(), null, true)
  }

  end_round(){
    console.log("Round has ended");
  }
}
