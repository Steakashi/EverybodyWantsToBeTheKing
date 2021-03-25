import { Injectable } from '@angular/core';

export class Action{

  name: string;

  constructor(name: string) {
    this.name = name;
  }

  _implemented_error(title: string){
    throw new Error(title + ' function for action ' + this.constructor.name + ' : not implemented !');
  }

  title(){
    return this.name;
  }

  preprocess(){
    this._implemented_error('preprocess');
  }
  
}
