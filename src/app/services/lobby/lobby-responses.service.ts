import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

@Injectable()
export class LobbyResponsesService{
  observable: any;

  constructor(private router: Router) {


  }


  // room_error(roomID){
  //   this.router.navigate(['room/not-found']).then(() => { this.room.invalidate_connexion(); });
  // }
}
