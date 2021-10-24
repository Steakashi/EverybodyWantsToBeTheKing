import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  user: any;
  life: number;
  popularity: number;
  agility: number;
  golds: number;
  states: [];
  objects: [];

  constructor() { }

  initialize(user){
    this.user = user;
    this.life = 3;
    this.popularity = 0;
    this.agility = 50;
    this.golds = 100;
    this.states = [];
  }

  synchronize(player_data){
    this.life = player_data.life;
    this.popularity = player_data.popularity;
    this.agility = player_data.agility;
    this.golds = player_data.golds;
    this.states = player_data.states;
  }

  id(){
    return this.user.id
  }

}
