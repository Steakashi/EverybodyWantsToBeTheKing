import {NgbModal, ModalDismissReasons, NgbTypeaheadConfig} from '@ng-bootstrap/ng-bootstrap';

import { Component, DebugElement, OnInit } from '@angular/core';
import { LobbyService } from '../services/lobby.service';
import { GameService } from '../services/game.service';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {

  constructor(private lobby: LobbyService,
              private game: GameService,
              private modalService: NgbModal) { }
  

  turnEnded = false;
  timer: any;

  ngOnInit(): void {
    this.game.initialize();
    this.game.begin_turn()
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      return;
    }, (reason) => {
      this.game.remove_action();
    });
  }

  _get_user_data(){
    return this.game.get_user();
  }

  get_actions(){
    return this.game.actions();
  }

  get_events(){
    return this.game.events()
  }

  get_user_name(){
    return this._get_user_data().name;
  }

  get_user_life(){
    return this._get_user_data().life;
  }

  get_user_popularity(){
    return this._get_user_data().popularity;
  }

  get_user_golds(){
    return this._get_user_data().golds;
  }

  get_user_effects(){
    return this._get_user_data().effects;
  }

  get_room_users() {
    return this.lobby.users;
  }

  get_alive_opponents() {
    var retrieved_users = [];
    this.get_room_users().forEach(user => {
      if (this.get_user_id() != user.id){ retrieved_users.push(user) }
    })
    return retrieved_users
  }

  get_user_id() {
    return this.lobby.user.id;
  }

  get_clock(){
    return this.game.clock;
  }

  gamestate(){
    return this.game.gamestate;
  }

  select_action(action, content){
    action.set_emitter(this.get_user_id());
    this.game.register_action(action);
    console.log('opened_window');

    if (action.needs_target()){ this.open(content) }
    else { this.end_turn(); }
  }

  register_target(user_id){
    this.game.get_action().set_targets([user_id]);
    this.end_turn();
  }

  end_turn(){
    this.turnEnded = true;
    console.log('results');
    console.log(this.game.get_action().emitter);
    console.log(this.game.get_action().targets);
    this.lobby.emit_turn_end(
      this.game.get_action()
    );
    //this.gamestate = PROCESSING;
    //console.log('timer ended');
  }

  

}
