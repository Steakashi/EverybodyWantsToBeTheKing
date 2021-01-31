import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import { LobbyService } from '../services/lobby.service';
import {WebsocketService} from '../services/websocket.service';
import {ExecutionPileService} from '../services/execution-pile.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {

  constructor(private lobby: LobbyService,
              private wsService: WebsocketService,
              private executionPile: ExecutionPileService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    if (!this.lobby.is_waiting_order()){
      this.lobby.set_room_id_from_url(this.route.snapshot.params.id);
      this.executionPile.register(this.lobby.emit_room_order_connection.bind(this.lobby));
    }

  }

  get_lobby_state() {
    return this.lobby.state;
  }

  get_room_name() {
    return this.lobby.room.name;
  }

  get_player_name() {
    return this.lobby.user.name;
  }

  get_room_users() {
    return this.lobby.users;
  }

  update_player_name(userName){
    this.lobby.emit_user_order_update(userName);
  }

  has_enough_players() {
    return this.lobby.users.length >= 2;
  }

  launch_game() {
    this.lobby.emit_game_order_creation()
  }

}
