import { Injectable } from '@angular/core';
import { Action } from './action';

export class Expedition extends Action{

  name = "Goes in expedition";

  constructor() {
      super();
  }

  title(){
    return this.name;
  }
  
}
