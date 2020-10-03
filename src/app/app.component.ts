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

  constructor(private wsService: WebsocketService,
              private lobby: LobbyQueriesService,
              private response: LobbyResponsesService) {}

  ngOnInit() {
    this.wsService.listen('user_connection').subscribe((data) => {
      console.log(data)

      // TODO : connect user if not already connected to app
    });

    this.wsService.listen('user_duplicated').subscribe((data) => {
      this.lobby.block_connection();
    });
    this.wsService.listen('confirm_user_connection').subscribe((data) => {
      console.log('user connexion confirmed');
      this.lobby.confirm_connection();
    });

    this.wsService.listen('user_disconnection').subscribe((data) => {
     // @ts-ignore
     console.log('Disconnecting user ' + data.user_id + ' from application');
     // @ts-ignore
     this.lobby.update_users(data.users);
    });

    this.wsService.listen('update_users').subscribe((data) => {
     // @ts-ignore
     console.log('Update connected users : ' + data.users);
     // @ts-ignore
     this.lobby.update_users(data.users);
    });

    this.wsService.listen('update_user').subscribe((data) => {
      // @ts-ignore
      console.log('Update current user name : ' + data.user_nam);
      // @ts-ignore
      this.lobby.update_users(data.users, data.user_name);
    });

    this.wsService.listen('room_creation').subscribe((data) => {
      // @ts-ignore
      console.log(data);
      // @ts-ignore
      console.log('Room creation order received on client with id : ' + data.room_id);
      // @ts-ignore
      this.lobby.create_room(data.room_name, data.room_id, data.user_name, data.user_id);
    });

    this.wsService.listen('room_connection').subscribe((data) => {
       // @ts-ignore
       console.log('Room connection order received on client with id : ' + data.room_id);
       // @ts-ignore
       this.lobby.join_room(data.room_id, data.user_id, data.user_name, data.users);
    });

    this.wsService.listen('room_unknown').subscribe((data) => {
      // @ts-ignore
      console.log('Room connection order received, but no corresponding room found. Id : ' + data.room_id);
      this.lobby.invalidate_connection();
    });

    this.wsService.listen('disconnection_order').subscribe((data) => {
       // @ts-ignore
       console.log('User has disconnected from application.');
       // @ts-ignore
       this.lobby.disconnect_user();
    });

    this.lobby.set_title(this.title);
    this.lobby.connect_user();
    console.log('Lobby Service initialized');

    this.wsService.emit('user_connection', {
      user_id: this.lobby.get_user_id()
    });
  }
}
