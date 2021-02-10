import { Component, OnInit } from '@angular/core';
import { LobbyService } from '../services/lobby.service';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor(private lobby: LobbyService,
              private game: GameService) { }

  ngOnInit(): void {
    this.game.initialize(this.lobby.get_user_name())
  }

  _get_player_data(){
    return this.game.get_player()
  }

  get_player_name(){
    return this._get_player_data().name
  }

  get_player_popularity(){
    return this._get_player_data().popularity
  }
  

}
