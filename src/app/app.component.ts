import {Component, OnInit} from '@angular/core';
import {LobbyService} from './services/lobby.service';
import {WebsocketService} from './services/websocket.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'EverybodyWantsToBeTheKing';

  constructor(private wsService: WebsocketService,
              private lobby: LobbyService) {}

  ngOnInit() {
    this.wsService.listen('room_creation').subscribe((data) => {
      // @ts-ignore
      console.log('Room creation order received on client with id : ' + data.room_id);
      // @ts-ignore
      this.lobby.create_room(data.room_name, data.room_id);
    });
    console.log('Lobby Service initialized');
  }
}
