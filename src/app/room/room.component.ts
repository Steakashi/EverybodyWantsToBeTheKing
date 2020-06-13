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
  currentRoomID = null;
  subscription: Subscription;

  constructor(private lobby: LobbyQueriesService,
              private lobbyR: LobbyResponsesService,
              private wsService: WebsocketService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit(): void {
    this.wsService.listen('room_unknown').subscribe((data) => {
      // @ts-ignore
      console.log('Room connexion order received, but no corresponding room found. Id : ' + data.room_id);
      this.lobby.invalidate_connexion();
    });

    this.route.queryParams.subscribe(params => {
      this.currentRoomID = params.id;
      // console.log(params)
      // console.log('currentRoomID : ' + params.id)
    });

    this.currentRoomID = this.route.snapshot.params.id;
    console.log('currentRoomID : ' + this.currentRoomID );
    console.log(this.lobby.roomID );

    if (this.lobby.roomID === undefined){
      this.lobby.emit_room_order_connexion(
        this.lobby.userName !== undefined ? this.lobby.userName : 'randomName',
        this.currentRoomID
      );
    }
    else {
      this.lobby.validate_connexion();
    }

  }

  get_lobby_state() {
    console.log('LOBBY STATE : ' + this.lobby.state);
    return this.lobby.state;
  }

  get_room_name() {
    return this.lobby.roomName;
  }

  get_player_name() {
    return this.lobby.userName;
  }

  get_room_users() {
    return this.lobby.users.map(t => t.user_name);
  }

}
