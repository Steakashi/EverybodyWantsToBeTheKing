import { Injectable } from '@angular/core';
import { PlayerService } from './player.service';
import { ActionManager } from './actions/action-manager.service'

@Injectable({
  providedIn: 'root'
})
export class GameService {

  actionPile: any = [];
  action: any;
  clock: number;

  constructor(private player: PlayerService,
              private actionManager: ActionManager) { }

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

  begin_action(){
    this.clock = 0;
  }

  play(){
    console.log('PLAYING ACTION');
  }
}
