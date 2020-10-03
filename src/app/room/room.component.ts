import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterEvent} from '@angular/router';

import { LobbyQueriesService } from '../services/lobby/lobby-queries.service';
import { filter } from 'rxjs/operators';
import {Observable, Observer, Subscription} from 'rxjs';
import {LobbyResponsesService} from '../services/lobby/lobby-responses.service';
import {WebsocketService} from '../services/websocket.service';
import {ExecutionPileService} from '../services/execution-pile.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
  currentUserName = 'Player';
  subscription: Subscription;

  constructor(private lobby: LobbyQueriesService,
              private lobbyR: LobbyResponsesService,
              private wsService: WebsocketService,
              private executionPile: ExecutionPileService,
              private route: ActivatedRoute,
              private router: Router) {}

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
    return this.lobby.roomName;
  }

  get_player_name() {
    console.log(this.lobby.userName);
    return this.lobby.userName;
  }

  update_player_name(userName){
    this.lobby.emit_user_update(userName);
  }

  get_room_users() {
    return this.lobby.users;
  }

}
