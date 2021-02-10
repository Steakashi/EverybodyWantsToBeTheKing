import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  name: string;
  popularity: number;
  objects: [];

  constructor() { }

  initialize(playerName){
    this.name = playerName
    this.popularity = 0;
  }
}
