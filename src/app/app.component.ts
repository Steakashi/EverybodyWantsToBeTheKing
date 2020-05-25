import {Component, OnInit} from '@angular/core';
import {LobbyService} from './services/lobby.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'EverybodyWantsToBeTheKing';

  constructor(private lobby: LobbyService){ }

  ngOnInit() {
    this.lobby.connect_user();
  }
}
