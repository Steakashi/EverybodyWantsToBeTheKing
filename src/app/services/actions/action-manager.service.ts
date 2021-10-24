import { Injectable } from '@angular/core';
import { Expedition } from './expedition';
import { Heal } from './heal';
import { Kill } from './kill';

@Injectable({
  providedIn: 'root'
})
export class ActionManager {

  EMITTER = "emitter"
  TARGETS = "targets"
  RECEIVERS = "receivers"

  actions = [
    new Expedition("Goes in Expedition", [this.EMITTER]),
    new Heal("Chill at home", [this.EMITTER]),
    new Kill("Murder a colleague", [this.TARGETS])
  ]

  constructor() { }

  get_all_actions(){
    return this.actions;
  }

}
