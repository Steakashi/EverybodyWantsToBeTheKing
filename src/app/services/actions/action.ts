import { Injectable } from '@angular/core';

export class Action{

  constructor() {}

  _implemented_error(title: string){
    throw new Error(title + ' function for action ' + this.constructor.name + ' : not implemented !');
  }

  preprocess(){
    this._implemented_error('preprocess');
  }

}
