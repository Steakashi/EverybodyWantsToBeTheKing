import { Injectable } from '@angular/core';
import {LobbyQueriesService} from './lobby/lobby-queries.service';

@Injectable({
  providedIn: 'root'
})
export class ExecutionPileService {

  pile: any = [];

  constructor() { }

  register(fn){
    this.pile.push(fn);
  }

  process(){
    this.pile.forEach(fn => {
      fn();
    });
    this.flush();
  }

  flush(){
    this.pile = [];
  }

  is_empty(){
    return (Array.isArray(this.pile) && this.pile.length === 0);
  }

}
