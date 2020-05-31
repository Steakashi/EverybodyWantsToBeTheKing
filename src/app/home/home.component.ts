import { Component, OnInit } from '@angular/core';
import { LobbyService } from '../services/lobby.service';
import * as uuid from 'uuid';
import {WebsocketService} from '../services/websocket.service';
import {NgForm} from '@angular/forms';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  constructor(private lobby: LobbyService){ }

  ngOnInit() {
    this.lobby.connect_user();
  }

  create_room(form: NgForm) {
    this.lobby.emit_room_order_creation(form.value['user_name'], form.value['room_name']);
  }

  get_room(){
    return this.lobby.get_current_room_name();
  }

}

