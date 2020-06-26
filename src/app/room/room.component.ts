import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterEvent} from '@angular/router';

import { LobbyQueriesService } from '../services/lobby/lobby-queries.service';
import { filter } from 'rxjs/operators';
import {Observable, Observer, Subscription} from 'rxjs';
import {LobbyResponsesService} from '../services/lobby/lobby-responses.service';
import {WebsocketService} from '../services/websocket.service';

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
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit(): void {
    this.wsService.listen('room_unknown').subscribe((data) => {
      // @ts-ignore
      console.log('Room connection order received, but no corresponding room found. Id : ' + data.room_id);
      this.lobby.invalidate_connection();
    });

    // this.route.queryParams.subscribe(params => {
    //   console.log(params)
    //   console.log(params.id)
    //   this.lobby.set_room_id_from_url(params.id);
    // });
    
    this.lobby.set_room_id_from_url(this.route.snapshot.params.id);

    if (this.lobby.is_waiting_order()){
      this.lobby.emit_room_order_connection()
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
