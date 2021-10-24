import { Injectable } from '@angular/core';

export class Action{

  NEEDS_TARGET = false;

  identifier: string;
  name: string;
  order: string[];
  emitter: string;
  targets: string[];
  receivers: string[];

  constructor(name: string, order: string[]) {
    this.identifier = this.constructor.name
    this.name = name;
    this.order = order;
  }

  _implemented_error(title: string){
    throw new Error(title + ' function for action ' + this.constructor.name + ' : not implemented !');
  }

  title(){
    return this.name;
  }

  set_emitter(emitter: string){
    this.emitter = emitter;
  }

  set_targets(targets: string[]){
    this.targets = targets;
  }

  set_receivers(receivers: string[]){
    this.receivers = receivers;
  }

  needs_target(){
    return this.NEEDS_TARGET
  }
  
}
