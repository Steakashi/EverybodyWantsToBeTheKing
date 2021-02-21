import {Component, OnInit} from '@angular/core';


import {LobbyService} from './services/lobby.service';
import {LogService} from './services/log-service.service';
import {WebsocketService} from './services/websocket.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'EverybodyWantsToBeTheKing';

  signals = [
    {
      event_name: 'user_connection_confirmed',
      callback: this.lobby.confirm_connection.bind(this.lobby),
      args: [],
      log: 'A user has logged into the application'
    },
    {
      event_name: 'user_duplicated',
      callback: this.lobby.block_connection.bind(this.lobby),
      args: [],
      log: 'Duplicated user found. Connection needs to be aborted'
    },
    {
      event_name: 'user_disconnected',
      callback: this.lobby.update_users.bind(this.lobby),
      args: ['users'],
      log: 'A user has logged out of the application'
    },
    {
      event_name: 'user_kicked_out',
      callback: this.lobby.update_users.bind(this.lobby),
      args: ['users'],
      log: 'A user has been kicked out of the room'
    },
    {
      event_name: 'users_update',
      callback: this.lobby.update_users.bind(this.lobby),
      args: ['users'],
      log: 'Users data has been updated from server'
    },
    {
      event_name: 'user_update',
      callback: this.lobby.update_user.bind(this.lobby),
      args: ['user_name'],
      log: 'Single user data has been updated from server'
    },
    {
      event_name: 'room_creation',
      callback: this.lobby.create_room.bind(this.lobby),
      args: ['room_name', 'room_id', 'user_name'],
      log: 'Room creation order received from server'
    },
    {
      event_name: 'room_connection',
      callback: this.lobby.join_room.bind(this.lobby),
      args: ['room_id', 'room_name', 'user_id', 'user_name', 'users'],
      log: 'Room connection order received from server'
    },
    {
      event_name: 'room_unknown',
      callback: this.lobby.invalidate_connection.bind(this.lobby),
      args: [],
      log: 'A user tried to join a room, but no one has been found from given id'
    },
    {
      event_name: 'game_launch',
      callback: this.lobby.launch_game.bind(this.lobby),
      args: ['users'],
      log: 'User has launched a game'
    },
    {
      event_name: 'begin_action',
      callback: this.lobby.begin_action.bind(this.lobby),
      args: ['users'],
      log: 'All users has chosen an action'
    }
  ];

  constructor(private wsService: WebsocketService,
              private lobby: LobbyService,
              private logger: LogService) {}

  generate_signal(signalObject){
    this.wsService.listen(signalObject.event_name).subscribe((data) => {
      signalObject.callback(...signalObject.args.map((elt) => data[elt]));
      this.logger.debug(signalObject.log);
    });
  }

  ngOnInit() {

    this.lobby.set_title(this.title);
    this.lobby.connect_user();

    this.signals.forEach(signal => {
      this.generate_signal(signal);
    });

    this.wsService.emit('user_connection', {
      user_id: this.lobby.get_user_id()
    });
  }
}
