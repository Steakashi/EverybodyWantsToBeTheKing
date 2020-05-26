import { Component, OnInit } from '@angular/core';
import { LobbyService } from '../services/lobby.service';
import * as uuid from 'uuid';
import {WebsocketService} from '../services/websocket.service';


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

  create_room() {
    this.lobby.create_room();
  }

}

