import { Injectable } from '@angular/core';
import { Action } from './action';

export class Expedition extends Action{

  constructor() {
    super("Goes in expedition");
  }

  process(){
    console.log("processing action");
    return "OK";
  }
  
}