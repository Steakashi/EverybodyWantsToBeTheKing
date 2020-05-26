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

  constructor(private wsService: WebsocketService) {}

  ngOnInit() {
    this.wsService.listen('room_creation').subscribe((data) => {
      console.log('Room creation order received on client with id : ' + data.room_id);
      console.log(data);
    });
    console.log('Lobby Service initialized');
  }
}
