import { Injectable } from '@angular/core';
import { PlayerService } from './player.service';
import { ActionManager } from './actions/action-manager.service'

@Injectable({
  providedIn: 'root'
})
export class GameService {

  actionPile: any = [];

  constructor(private player: PlayerService,
              private actionManager: ActionManager) { }

  initialize(playerName){
    this.player.initialize(playerName)
  }

  get_player(){
    return this.player;
  }

  actions(){
    return this.actionManager.get_all_actions();
  }

  register_action(action){
    this.actionPile.push(action);
  }
}
