import { Component, OnInit } from '@angular/core';
import { LobbyService } from '../services/lobby.service';
import * as uuid from 'uuid';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  users = [];

  constructor(private lobby: LobbyService){ }

  ngOnInit() {
    this.lobby.rooms.subscribe(id => {
      this.users.push(id);
    });
  }

  create_room() {
    this.lobby.create_room(uuid.v4());
  }



}

