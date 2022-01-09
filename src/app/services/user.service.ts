import { Injectable } from '@angular/core';


@Injectable()
export class User {

  name: string;
  id: string;
  room_id: string;
  status: string;
  life: number;
  max_life: number;
  popularity: number;
  agility: number;
  golds: number;
  effects: [];
  objects: [];

  constructor(){}

  reset_stats(){
    this.life = 3;
    this.max_life = 3;
    this.popularity = 0;
    this.agility = 50;
    this.golds = 100;
    this.effects = [];
  }

  synchronize(user_data){
    this.name = user_data.name;
    this.id = user_data.id;
    this.room_id = user_data.room_id;
    this.status = user_data.status
    this.life = user_data.life;
    this.popularity = user_data.popularity;
    this.agility = user_data.agility;
    this.golds = user_data.golds;
    this.effects = user_data.effects;
  }

}
