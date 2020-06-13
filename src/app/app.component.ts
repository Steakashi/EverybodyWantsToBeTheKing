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
    this.wsService.listen('room_creation').subscribe((data) => {
      // @ts-ignore
      console.log('Room creation order received on client with id : ' + data.room_id);
      // @ts-ignore
      this.lobby.create_room(data.room_name, data.room_id, data.user_name, data.user_id);
    });
    this.wsService.listen('room_connexion').subscribe((data) => {
      // @ts-ignore
      console.log('Room connexion order received on client with id : ' + data.room_id);
      // @ts-ignore
      this.lobby.join_room(data.room_id, data.user_id, data.user_name, data.users);
    });
    this.wsService.listen('disconnection_order').subscribe((data) => {
      // @ts-ignore
      console.log('User has disconnected from application.');
      // @ts-ignore
      this.lobby.disconnect_user();
    });

    this.wsService.listen('user_disconnection').subscribe((data) => {
      // @ts-ignore
      console.log('Disconnecting user ' + data.user_id + ' from application');
      // @ts-ignore
      this.lobby.update_users(data.users);
    });

    console.log('Lobby Service initialized');
  }
}
