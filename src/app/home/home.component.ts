import { Component, OnInit } from '@angular/core';
import { LobbyQueriesService } from '../services/lobby/lobby-queries.service';
import * as uuid from 'uuid';
import {WebsocketService} from '../services/websocket.service';
import {NgForm} from '@angular/forms';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  constructor(private lobby: LobbyQueriesService,
              private wsService: WebsocketService){ }

  ngOnInit() {
    this.lobby.connect_user();
  }

  send_form(form: NgForm){
    if (form.value.room_id === ''){ this.create_room(form.value.user_name, form.value.room_name); }
    else { this.join_room(form.value.user_name, form.value.room_id);  }
  }

  create_room(userName, roomName) {
    this.lobby.emit_room_order_creation(userName, roomName);
  }

  join_room(userName, roomID){
    this.lobby.emit_room_order_connexion(userName, roomID);
  }

  get_room(){
    return this.lobby.get_current_room_name();
  }

}

