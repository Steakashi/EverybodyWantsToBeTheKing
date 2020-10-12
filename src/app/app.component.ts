import {Component, OnInit} from '@angular/core';


import {LobbyQueriesService} from './services/lobby/lobby-queries.service';
import {WebsocketService} from './services/websocket.service';
import {LobbyResponsesService} from './services/lobby/lobby-responses.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'EverybodyWantsToBeTheKing';

  signals = [
    {
      event_name: 'confirm_user_connection',
      callback: this.lobby.confirm_connection.bind(this.lobby),
      args: [],
    },
    {
      event_name: 'user_duplicated',
      callback: this.lobby.block_connection.bind(this.lobby),
      args: [],
    },
    {
      event_name: 'user_disconnection',
      callback: this.lobby.update_users.bind(this.lobby),
      args: ['users'],
    },
    {
      event_name: 'update_users',
      callback: this.lobby.update_users.bind(this.lobby),
      args: ['users'],
    },
    {
      event_name: 'update_user',
      callback: this.lobby.update_user.bind(this.lobby),
      args: ['user_name'],
    },
    {
      event_name: 'room_creation',
      callback: this.lobby.create_room.bind(this.lobby),
      args: ['room_name', 'room_id', 'user_name', 'user_id'],
    },
    {
      event_name: 'room_connection',
      callback: this.lobby.join_room.bind(this.lobby),
      args: ['room_id', 'room_name', 'user_id', 'user_name', 'users'],
    },
    {
      event_name: 'room_unknown',
      callback: this.lobby.invalidate_connection.bind(this.lobby),
      args: [],
    },
    {
      event_name: 'disconnection_order',
      callback: this.lobby.disconnect_user.bind(this.lobby),
      args: [],
    },

  ];

  constructor(private wsService: WebsocketService,
              private lobby: LobbyQueriesService,
              private response: LobbyResponsesService) {}

  generate_signal(signalObject){
    this.wsService.listen(signalObject.event_name).subscribe((data) => {
      signalObject.callback(...signalObject.args.map((elt) => data[elt]));
    });
  }

  ngOnInit() {

    this.lobby.set_title(this.title);
    this.lobby.connect_user();
    console.log('Lobby Service initialized');

    this.signals.forEach(signal => {
      this.generate_signal(signal);
    });

    this.wsService.emit('user_connection', {
      user_id: this.lobby.get_user_id()
    });
  }
}
