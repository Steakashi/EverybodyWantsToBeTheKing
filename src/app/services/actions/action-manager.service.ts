import { Injectable } from '@angular/core';
import { Expedition } from './expedition';

@Injectable({
  providedIn: 'root'
})
export class ActionManager {

  actions = [
    new Expedition()
  ]

  constructor() { }

  get_all_actions(){
    return this.actions;
  }

}
