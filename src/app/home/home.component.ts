import { Component } from '@angular/core';
import { LobbyService } from '../services/lobby.service';
import {NgForm} from '@angular/forms';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {

  constructor(private lobby: LobbyService){ }


  send_form(form: NgForm){
    if (form.value.room_id === ''){ this.create_room(form.value.user_name, form.value.room_name); }
    else { this.join_room(form.value.user_name, form.value.room_id);  }
  }

  create_room(user_name, room_name) {
    this.lobby.emit_room_order_creation(user_name, room_name);
  }

  join_room(user_name, room_id){
    this.lobby.navigate_to_lobby(user_name, room_id);
  }

  get_room(){
    return this.lobby.get_current_room_name();
  }

}

