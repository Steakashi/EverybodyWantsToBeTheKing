import { Injectable } from '@angular/core';
import { PlayerService } from './player.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private player: PlayerService) { }

  initialize(playerName){
    this.player.initialize(playerName)
  }

  get_player(){
    return this.player;
  }
}
