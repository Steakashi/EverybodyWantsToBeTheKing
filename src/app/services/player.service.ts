import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  name: string;
  popularity: number;
  agility: number;
  objects: [];

  constructor() { }

  initialize(playerName){
    this.name = playerName
    this.popularity = 0;
    this.agility = 50;
  }

}
