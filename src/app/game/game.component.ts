import { Component, DebugElement, OnInit } from '@angular/core';
import { LobbyService } from '../services/lobby.service';
import { GameService } from '../services/game.service';


const TURNTIME = 60;
const PROCESSING = 'PROCESSING';
const CHOOSING = 'CHOOSING';
const RESULTS = 'RESULTS';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})


export class GameComponent implements OnInit {

  constructor(private lobby: LobbyService,
              private game: GameService) { }
  

  turnEnded = false;
  timeLeft = TURNTIME;
  timer: any;
  gamestate: string;

  ngOnInit(): void {
    this.game.initialize(this.lobby.get_user_name());
    this.lobby.emit_player_synchronization(this.game.get_player(), this.game.get_action())
    this.gamestate = CHOOSING;
    this.begin_turn();
  }

  _get_player_data(){
    return this.game.get_player();
  }

  get_actions(){
    return this.game.actions();
  }

  get_player_name(){
    return this._get_player_data().name;
  }

  get_player_popularity(){
    return this._get_player_data().popularity;
  }

  get_room_users() {
    return this.lobby.users;
  }

  get_clock(){
    return this.game.clock;
  }
  
  register_action(action){
    this.game.register_action(action);
    //action.preprocess();
    this.end_turn();
  }

  begin_turn() {
    this.game.clock = TURNTIME;
  }

  end_turn(){
    this.turnEnded = true;
    this.lobby.emit_turn_end();
    //this.gamestate = PROCESSING;
    //console.log('timer ended');
  }

  

}
