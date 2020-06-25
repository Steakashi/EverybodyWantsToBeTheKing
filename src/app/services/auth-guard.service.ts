import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';


import { LobbyQueriesService } from '../services/lobby/lobby-queries.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private lobby: LobbyQueriesService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (this.lobby.state === 'BLOCKED'){
        console.log('blocked');
      }
      else { console.log('allowed'); return true; }
  }
}
